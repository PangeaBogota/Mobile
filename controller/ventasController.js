/**
 * Created by dev10 on 1/7/2016.
 */
var app_angular = angular.module('PedidosOnline');


//CONTROLADOR DEL MOULO DE VENTAS
app_angular.controller("pedidoController",['Conexion','$scope','$location','$http',function (Conexion,$scope,$location,$http) {
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
	CRUD.select('select item.rowid as rowid_item,item.item_descripcion as descripcion,precios.rowid as rowid_listaprecios,precios.precio_lista as precio from erp_items item inner join erp_items_precios precios on  item.rowid=precios.rowid_item',function(elem){$scope.list_items.push(elem);});
    
	CRUD.selectAll('erp_terceros',function(elem){$scope.list_tercero.push(elem);});
	
    //$scope.AutoCompletar=function(){
//        $("#tercerosBusqueda").autocomplete({
//            source: $scope.list_tercero
//        })
//    }
	$scope.fechasolicitud=function(){
		$scope.datenow=new Date();
		$scope.pedidos.fecha_solicitud=$scope.datenow.getDate() + "/" +$scope.datenow.getDay()+"/"+$scope.datenow.getFullYear();
		$scope.pedidos.fechacreacion=$scope.datenow.getDate() + "/" +$scope.datenow.getDay()+"/"+$scope.datenow.getFullYear();
		
	}
	
	$scope.onChangeTercero=function(){
		$scope.list_Sucursales=[];
		$scope.list_puntoEnvio=[];
		CRUD.selectParametro('erp_terceros_sucursales','rowid_tercero',$scope.terceroSelected.rowid,function(elem){$scope.list_Sucursales.push(elem)});
		CRUD.selectParametro('erp_terceros_punto_envio','rowid_tercero',$scope.terceroSelected.rowid,function(elem){$scope.list_puntoEnvio.push(elem)});
		
		
	}
	
	$scope.onChangeSucursal=function(){
		$scope.list_precios=[];
		CRUD.selectParametro('erp_entidades_master','erp_id_maestro',$scope.sucursal.id_lista_precios,function(elem){$scope.list_precios.push(elem)});
		$scope.pedidos.rowid_cliente_facturacion=$scope.sucursal.rowid;
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
			$scope.item.rowid_pedido=$scope.pedidos.rowid;
			$scope.item.cantidad=1;
			$scope.item.valorTotal=0;
			$scope.itemsAgregadosPedido.push($scope.item);
			Mensajes('Item Agregado','success','');
			$scope.item=[];
			$scope.SearchItem='';
		}
		else
		{
			Mensajes('El Item ya existe en la lista','error','');
		}
		
	}
	$scope.delete = function (index) {
		debugger
    	$scope.itemsAgregadosPedido.splice(index, 1);
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
				$scope.detalle.cantidad=value.cantidad;
				$scope.detalle.precio_unitario=value.precio;
				$scope.detalle.valor_base=value.precio*value.cantidad;
				CRUD.insert('t_pedidos_detalle',$scope.detalle);
				//$scope.valorTotal=$scope.valorTotal+$scope.detalle.valor_base;
			})
			
			CRUD.select('SELECT  SUM (valor_base)  as total,SUM (cantidad)  as cantidad FROM  t_pedidos_detalle  where rowid_pedido='+$scope.pedidos.rowid+'',function(elem){$scope.pedidoDetalles.push(elem)});
			$scope.CambiarTab('2','siguiente');
	}
	$scope.guardarCabezera=function(){
		if($scope.validacion==0)
		{
			CRUD.select('select max(rowid) as rowid from t_pedidos',function(elem){$scope.ultimoRegistro.push(elem);
				$scope.ultimoRegistroseleccionado=$scope.ultimoRegistro[0];
				$scope.pedidos.rowid=$scope.ultimoRegistroseleccionado.rowid+1;
				$scope.pedido_detalle.rowid_pedido=$scope.pedidos.rowid;
				$scope.pedidos.modulo_creacion='MOVIL';
				CRUD.insert('t_pedidos',$scope.pedidos)
				Mensajes('Registrado Correctamente','success','');
				$scope.CambiarTab('3','atras')
			})
		}
		else
		{
			return
		}
		
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
    CRUD.select('select * from t_pedidos where modulo_creacion="MOVIL"',function(elem) {$scope.pedidos.push(elem)});
    
	$scope.ConsultarDatos =function(pedido){
		$scope.detallespedido=[];
		$scope.pedidoSeleccionado=pedido;
		$scope.CambiarTab('1','siguiente');	
		CRUD.select('select items.item_referencia, items.item_descripcion, detalle.cantidad, detalle.precio_unitario, detalle.valor_base from t_pedidos pedido left join t_pedidos_detalle detalle on pedido.rowid = detalle.rowid_pedido inner join erp_items items on Detalle.rowid_item = items.rowid where pedido.rowid='+pedido.rowid+'',
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