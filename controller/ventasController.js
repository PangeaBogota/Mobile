/**
 * Created by dev10 on 1/7/2016.
 */
var app_angular = angular.module('PedidosOnline');


//CONTROLADOR DEL MOULO DE VENTAS
app_angular.controller("pedidoController",['Conexion','$scope','$location','$http',function (Conexion,$scope,$location,$http) {
	$scope.sessiondate=JSON.parse(window.localStorage.getItem("CUR_USER"));
	$scope.validacion=0;
	$scope.item;
	$scope.pedidoDetalles=[];
	$scope.date;
	$scope.precioItem;
	$scope.itemPrecio;
	$scope.itemsAgregadosPedido=[];
	$scope.terceroSelected=[];
    $scope.Search;
	$scope.sucursal=[];
	$scope.pedidos=[];
    $scope.list_tercero = [];
	$scope.list_Sucursales=[];
	$scope.list_precios=[];
	$scope.listprecios=[];
	$scope.list_puntoEnvio=[];
	$scope.list_items=[];
	$scope.SearchItem;
	$scope.ultimoRegistroseleccionado=[];
	$scope.ultimoRegistro=[];
	$scope.pedido_detalle=[];
	$scope.list_pedidos_detalles=[];
	$scope.valorTotal;
	
    
	CRUD.selectAll('erp_terceros',function(elem){$scope.list_tercero.push(elem);});
	
	
	$scope.onChangeListaPrecios=function(){
		if ($scope.pedidos.rowid_lista_precios==undefined) {$scope.list_items=[];return}
		$scope.list_items=[];
		var query1="select item.item_referencia||'-'||item.item_descripcion as producto,item.id_unidad,item.rowid as rowid_item,item.item_descripcion as descripcion,precios.rowid as rowid_listaprecios,precios.precio_lista as precio";
		var query=query1+" from erp_items item inner join erp_items_precios precios on  item.rowid=precios.rowid_item and item.id_unidad=precios.id_unidad inner join erp_entidades_master maestro on maestro.erp_id_maestro=precios.id_lista_precios and maestro.id_tipo_maestro='LISTA_PRECIOS' WHERE item_referencia NOT LIKE '%*DESC*%'   and maestro.rowid="+$scope.pedidos.rowid_lista_precios+"";
		CRUD.select(query,function(elem){$scope.list_items.push(elem);});
	}
	
	$scope.CurrentDate=function(){
		$scope.day;
		$scope.DayNow=Date.now();
		$scope.YearS=$scope.DayNow.getFullYear();
		$scope.MonthS=$scope.DayNow.getMonth()+1;
		if ($scope.MonthS<10) {$scope.MonthS='0'+$scope.MonthS}
		$scope.DayS=$scope.DayNow.getDate();
		$scope.HourS=$scope.DayNow.getHours();
		$scope.MinuteS=$scope.DayNow.getMinutes();
		if ($scope.DayS<10) {$scope.DayS='0'+$scope.DayS}
		$scope.day=$scope.YearS+'/'+$scope.MonthS+'/'+$scope.DayS;
		return $scope.day;
	}
	$scope.SelectedDate=function(daySelected){
		$scope.day;
		$scope.DayNow=new Date(daySelected);
		$scope.YearS=$scope.DayNow.getFullYear();
		$scope.MonthS=$scope.DayNow.getMonth()+1;
		if ($scope.MonthS<10) {$scope.MonthS='0'+$scope.MonthS}
		$scope.DayS=$scope.DayNow.getDate();
		$scope.HourS=$scope.DayNow.getHours();
		$scope.MinuteS=$scope.DayNow.getMinutes();
		if ($scope.DayS<10) {$scope.DayS='0'+$scope.DayS}
		$scope.day=$scope.YearS+'-'+$scope.MonthS+'-'+$scope.DayS;
		return $scope.day;
	}
	$scope.fechasolicitud=function(){
		$scope.pedidos.fecha_solicitud=$scope.SelectedDate($scope.date);
		$scope.datenow=new Date();
		$scope.pedidos.fechacreacion=$scope.CurrentDate();
	}
	
	$scope.onChangeTercero=function(){
		$scope.list_Sucursales=[];
		$scope.list_puntoEnvio=[];
		CRUD.selectParametro('erp_terceros_sucursales','rowid_tercero',$scope.terceroSelected.rowid,function(elem){$scope.list_Sucursales.push(elem)});
		CRUD.selectParametro('erp_terceros_punto_envio','rowid_tercero',$scope.terceroSelected.rowid,function(elem){$scope.list_puntoEnvio.push(elem)});	
	}
	
	$scope.onChangeSucursal=function(){
		if ($scope.sucursal==undefined) {$scope.pedidos.rowid_lista_precios='';$scope.list_items=[];return}
		$scope.list_precios=[];
		CRUD.selectParametro('erp_entidades_master','erp_id_maestro',$scope.sucursal.id_lista_precios,function(elem){$scope.list_precios.push(elem)});
		$scope.pedidos.rowid_cliente_facturacion=$scope.sucursal.rowid;
	}
	$scope.finalizarPedido=function(){
		if($scope.itemsAgregadosPedido.length==0)
		{
			Mensajes('Debe Seleccionar al menos un item de la lista','error','');
			return
		}
		$scope.guardarCabezera();
		window.setTimeout(function(){
			$scope.guardarDetalle();
		},1000)
		Mensajes('Pedido Guardado Correctamente','success','');
		window.setTimeout(function(){
			window.location.href = '#/ventas/pedidos_ingresados';
		},1200)
		
	}
	$scope.adicionaritem=function(){
		if($scope.item==null)
		{
			Mensajes('Seleccione un item de la lista','error','');
			return
		}
		if($scope.item.length==0)
		{
			Mensajes('Seleccione un item de la lista','error','');
			return
		}
		if ($scope.itemsAgregadosPedido.indexOf($scope.item) == -1) {
			$scope.item.cantidad=1;
			$scope.item.valorTotal=0;
			$scope.itemsAgregadosPedido.push($scope.item);
			Mensajes('Item Agregado','success','');
			$scope.item=[];
			$scope.SearchItem='';
			$scope.CalcularCantidadValorTotal();
		}
		else
		{
			Mensajes('El Item ya existe en la lista','error','');
		}
		
	}
	$scope.CalcularCantidadValorTotal=function(){
		$scope.valortotal=0;
		$scope.cantidad=0;
		angular.forEach($scope.itemsAgregadosPedido,function(value,key){
			$scope.precioEstandar=value.precio*value.cantidad;
			$scope.valortotal+=$scope.precioEstandar;
			$scope.cantidad+=value.cantidad;
		})
		$scope.pedidoDetalles.cantidad=$scope.cantidad;
		$scope.pedidoDetalles.total=$scope.valortotal;
	}
	$scope.delete = function (index) {
    	$scope.itemsAgregadosPedido.splice(index, 1);
    	$scope.CalcularCantidadValorTotal();
	}
	$scope.guardarDetalle=function(){
		if($scope.itemsAgregadosPedido.length==0)
		{
			Mensajes('Debe Seleccionar al menos un item de la lista','error','');
			return
		}
		angular.forEach($scope.itemsAgregadosPedido,function(value,key){
			$scope.detalle=[];
			$scope.detalle.rowid_item=value.rowid_item;
			$scope.detalle.rowid_pedido=$scope.pedidos.rowid;
			$scope.detalle.linea_descripcion=value.descripcion;
			$scope.detalle.id_unidad=value.id_unidad;
			$scope.detalle.cantidad=value.cantidad;
			$scope.detalle.factor=0;

			$scope.detalle.precio_unitario=value.precio;
			$scope.detalle.valor_base=value.precio*value.cantidad;
			$scope.detalle.usuariocreacion=$scope.sessiondate.nombre_usuario;
			$scope.detalle.fechacreacion=$scope.CurrentDate();
			CRUD.insert('t_pedidos_detalle',$scope.detalle);
		})
		
		CRUD.select('SELECT  SUM (valor_base)  as total,SUM (cantidad)  as cantidad FROM  t_pedidos_detalle  where rowid_pedido='+$scope.pedidos.rowid+'',function(elem){$scope.pedidoDetalles.push(elem)});
	}
	$scope.actualizarPrecio=function(){
		$scope.CalcularCantidadValorTotal();
	}
	$scope.guardarCabezera=function(){
		CRUD.select('select max(rowid) as rowid from t_pedidos',function(elem){$scope.ultimoRegistro.push(elem);
			$scope.ultimoRegistroseleccionado=$scope.ultimoRegistro[0];
			$scope.pedidos.rowid=$scope.ultimoRegistroseleccionado.rowid+1;
			$scope.pedido_detalle.rowid_pedido=$scope.pedidos.rowid;
			$scope.pedidos.modulo_creacion='MOVIL';
			$scope.pedidos.valor_total=$scope.pedidoDetalles.total;
			$scope.pedidos.usuariocreacion=$scope.sessiondate.nombre_usuario;
			CRUD.insert('t_pedidos',$scope.pedidos)
		})
	}
	$scope.modulo=MODULO_PEDIDO_NUEVO;
    angular.element('ul.tabs li').click(function () {

        var tab_id = angular.element(this).find('a').data('tab');
        angular.element('ul.tabs li').removeClass('active');
        angular.element('.tab-pane').removeClass('active');
        angular.element(this).toggleClass('active');
        angular.element("#" + tab_id).toggleClass('active');
    });
    $scope.CambiarTab = function (tab_actual, accion) {
        $scope.tab_id = null;

        if (tab_actual == '2' && accion == 'atras')
            $scope.tab_id = 'tab_1';
        else if (tab_actual == '2' && accion == 'siguiente')
            $scope.tab_id = 'tab_3';
        else if (tab_actual == '3' && accion == 'atras')
            $scope.tab_id = 'tab_2';

        angular.element('ul.tabs li').removeClass('active');
        angular.element('.tab-pane').removeClass('active');

        angular.element("ul.tabs").find("[data-tab='" + $scope.tab_id + "']").toggleClass('active');
        angular.element("#" + $scope.tab_id).toggleClass('active');
    };
    angular.element('#ui-id-1').mouseover(function (){
        angular.element('#ui-id-1').show();
    });
	

}]);

app_angular.controller("PedidosController",['Conexion','$scope',function (Conexion,$scope) {
	
	$scope.pedidos = [];
	$scope.pedidoSeleccionado=[];
	$scope.detallespedido=[];
    CRUD.select('select distinct pedidos.fecha_solicitud, pedidos.rowid as rowidpedido,terceros.razonsocial,sucursal.nombre_sucursal,punto_envio.nombre_punto_envio,pedidos.valor_total,detalle.rowid_pedido,count(detalle.rowid_pedido) cantidaddetalles,sum(detalle.cantidad) as cantidadproductos from  t_pedidos pedidos inner join erp_terceros_sucursales sucursal on sucursal.rowid=pedidos.rowid_cliente_facturacion  inner join erp_terceros terceros on terceros.rowid=sucursal.rowid_tercero  left  join t_pedidos_detalle detalle on detalle.rowid_pedido=pedidos.rowid left join erp_terceros_punto_envio punto_envio on punto_envio.rowid=pedidos.id_punto_envio group by  pedidos.fecha_solicitud,detalle.rowid_pedido,pedidos.rowid,terceros.razonsocial,sucursal.nombre_sucursal,punto_envio.nombre_punto_envio,pedidos.valor_total order by pedidos.fecha_solicitud desc',function(elem) {$scope.pedidos.push(elem)});
    
	$scope.ConsultarDatos =function(pedido){
		$scope.detallespedido=[];
		$scope.pedidoSeleccionado=pedido;

		CRUD.select('select items.item_referencia, items.item_descripcion, detalle.cantidad, detalle.precio_unitario, detalle.valor_base from t_pedidos pedido left join t_pedidos_detalle detalle on pedido.rowid = detalle.rowid_pedido inner join erp_items items on Detalle.rowid_item = items.rowid where pedido.rowid='+pedido.rowidpedido+'',
		function(ele){$scope.detallespedido.push(ele);})
		
	}
	
	$scope.Refrescar =function(){
    	CRUD.selectAll('t_pedidos',function(elem) {$scope.pedidos.push(elem)});
		$scope.Search = '';
		
	}
	
	angular.element('ul.tabs li').click(function () {

        var tab_id = angular.element(this).find('a').data('tab');
        angular.element('ul.tabs li').removeClass('active');
        angular.element('.tab-pane').removeClass('active');
        angular.element(this).toggleClass('active');
        angular.element("#" + tab_id).toggleClass('active');
    });
	
	$scope.abrirModal=function(pedido){
		$('#pedidoOpenModal').click();
		$scope.ConsultarDatos(pedido);
	}

	
	$scope.CambiarTab = function (tab_actual, accion) {
        var tab_id = null;

        if (tab_actual == '1' && accion == 'siguiente')
            tab_id = 'tab_2';

        angular.element('ul.tabs li').removeClass('active');
        angular.element('.tab-pane').removeClass('active');

        angular.element("ul.tabs").find("[data-tab='" + tab_id + "']").toggleClass('active');
        angular.element("#" + tab_id).toggleClass('active');
    };
    angular.element('#ui-id-1').mouseover(function (){
        angular.element('#ui-id-1').show();
    });
	
}]);