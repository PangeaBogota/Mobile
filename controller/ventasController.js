/**
 * Created by dev10 on 1/7/2016.
 */
var app_angular = angular.module('PedidosOnline');


//CONTROLADOR DEL MOULO DE VENTAS
app_angular.controller("pedidoController",['Conexion','$scope','$location','$http','$routeParams',function (Conexion,$scope,$location,$http,$routeParams) {
	$scope.ejemplovista=[];
	
	//CRUD.select(vista2,function(elem){$scope.ejemplovista.push(elem)});
	$scope.sessiondate=JSON.parse(window.localStorage.getItem("CUR_USER"));
	$scope.validacion=0;
	$scope.item;
	$scope.listaPrecios=[];
	$scope.pedidoDetalles=[];
	$scope.date;
	$scope.dateEntrega;
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
	$scope.sucursalDespacho=[];
	$scope.ciudadSucursal=[];
	$scope.puntoEnvio=[];
	$scope.hasfocus;
	$scope.cantidadBase;
	$scope.dataFiltro;
	$scope.SearchItem;
	$scope.filter=[];
	$scope.criterio=[];
	//var query1="select item.item_referencia||'-'||item.item_descripcion as producto,item.id_unidad,item.rowid as rowid_item,item.item_descripcion as descripcion,precios.rowid as rowid_listaprecios,precios.precio_lista as precio";
	//var query=query1+" from erp_items item inner join erp_items_precios precios on  item.rowid=precios.rowid_item ";
	//CRUD.select(query,function(elem){$scope.list_items.push(elem);});
    $scope.terceroDeTercero=$routeParams.personId;
	CRUD.select('select*from erp_terceros',
		function(elem)
		{
			$scope.list_tercero.push(elem);
			if ($scope.terceroDeTercero!=undefined   && elem.rowid==$scope.terceroDeTercero) 
			{
				$scope.terceroSelected=elem
				//$scope.Search=$scope.terceroSelected.razonsocial;
				
			}
		});
	
	
	$scope.onChangeListaPrecios=function(){

		if ($scope.pedidos.rowid_lista_precios==undefined) {$scope.list_items=[];return}
		$scope.list_items=[];
		var count='';
		var vista='';
		if ($scope.filter.codigoitem!=''  && $scope.filter.codigoitem!=undefined   &&  ( $scope.filter.descripcionitem==''   || $scope.filter.descripcionitem==undefined)){//  && $scope.filter.descripcionitem=='' || $scope.filter.descripcionitem==undefined ) {
			vista="select*from vw_items_precios  where  rowid="+$scope.pedidos.rowid_lista_precios+"  and    item_codigo1 like '%"+$scope.filter.codigoitem+"%'  order by rowid LIMIT 100 ";
			count="select count(*) as cantidad from vw_items_precios  where  rowid="+$scope.pedidos.rowid_lista_precios+"  and    item_codigo1 like '%"+$scope.filter.codigoitem+"%'  order by rowid LIMIT 100 ";
		}
		else if ($scope.filter.descripcionitem!='' && $scope.filter.descripcionitem!=undefined && ( $scope.filter.codigoitem=='' || $scope.filter.codigoitem==undefined   )) {
			vista="select*from vw_items_precios  where  rowid="+$scope.pedidos.rowid_lista_precios+"  and   (   item_referencia1 like '%"+$scope.filter.descripcionitem+"%'   or descripcion like '%"+$scope.filter.descripcionitem+"%' )   order by rowid LIMIT 100";
			count="select count(*) from vw_items_precios  where  rowid="+$scope.pedidos.rowid_lista_precios+"  and   (   item_referencia1 like '%"+$scope.filter.descripcionitem+"%'   or descripcion like '%"+$scope.filter.descripcionitem+"%' )   order by rowid LIMIT 100";
		}
		else if ($scope.filter.descripcionitem!='' && $scope.filter.descripcionitem!=undefined && $scope.filter.codigoitem!='' && $scope.filter.codigoitem!=undefined   ) {
			vista="select*from vw_items_precios  where  rowid="+$scope.pedidos.rowid_lista_precios+"  and  item_codigo1 like '%"+$scope.filter.codigoitem+"%' and   (   item_referencia1 like '%"+$scope.filter.descripcionitem+"%'   or descripcion like '%"+$scope.filter.descripcionitem+"%' )    order by rowid LIMIT 200";
			count="select count(*) as cantidadfrom vw_items_precios  where  rowid="+$scope.pedidos.rowid_lista_precios+"  and  item_codigo1 like '%"+$scope.filter.codigoitem+"%' and   (   item_referencia1 like '%"+$scope.filter.descripcionitem+"%'   or descripcion like '%"+$scope.filter.descripcionitem+"%' )    order by rowid LIMIT 200";
		}
		else {
			vista="select*from vw_items_precios  where  rowid="+$scope.pedidos.rowid_lista_precios+"  order by rowid LIMIT 100 ";
			count="select 100 as cantidad ";
		}
		CRUD.select(vista,function(elem){$scope.list_items.push(elem)});
		//var query1="select item.item_codigo||'-'||item.item_referencia||'-'||item.item_descripcion||'-'||item.id_unidad||'-'||CAST(precios.precio_lista as text)  as producto,item.id_unidad,item.rowid as rowid_item,item.item_descripcion as descripcion,precios.rowid as rowid_listaprecios,precios.precio_lista as precio";
		//var query=query1+" from erp_items item inner join erp_items_precios precios on  item.rowid=precios.rowid_item  inner join erp_entidades_master maestro on maestro.erp_id_maestro=precios.id_lista_precios  WHERE  maestro.rowid="+$scope.pedidos.rowid_lista_precios+"    order by item.item_descripcion";
		//CRUD.select(query,function(elem){$scope.list_items.push(elem);});
	}
	$scope.onChangeFiltro=function()
	{
		if ($scope.SearchItem=='') {$scope.item=[]}
	}
	$scope.onGetFiltro=function()
	{
		$scope.onChangeListaPrecios();		
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
		$scope.day=$scope.YearS+'-'+$scope.MonthS+'-'+$scope.DayS;
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
		$scope.pedidos.fecha_pedido=$scope.CurrentDate();
		var FechaCreacion=$scope.pedidos.fechacreacion.replace('-','');
		var FechaSolicitud=$scope.pedidos.fecha_solicitud.replace('-','');
		FechaCreacion=FechaCreacion.replace('-','');
    	 FechaSolicitud=FechaSolicitud.replace('-','');
    	if (FechaSolicitud<FechaCreacion) {
    		$scope.pedidos.fecha_solicitud='';
    		document.getElementById("fecha_solicitud").valueAsDate = null;
    		Mensajes('Fecha Solicitud No puede ser Menor que La Fecha creacion del pedido','error','');
    		return;
    	}
	}
	$scope.fechaentrega=function(){
		debugger
		$scope.pedidos.fecha_entrega=$scope.SelectedDate($scope.dateEntrega);
		$scope.pedidos.fecha_pedido=$scope.CurrentDate();
    	var FechaCreacion=$scope.pedidos.fechacreacion.replace('-','');
    	var FechaEntrega=$scope.pedidos.fecha_entrega.replace('-','');
    	 FechaCreacion=FechaCreacion.replace('-','');
    	 FechaEntrega=FechaEntrega.replace('-','');
    	if (FechaEntrega<FechaCreacion) {
    		Mensajes('Fecha Entrega No puede ser Menor que La Fecha creacion del pedido','error','');
    		$scope.pedidos.fecha_entrega='';
    		document.getElementById("fecha_entrega").valueAsDate = null;
    		return;
    	}
	}
	$scope.onChangeTercero=function(){
		document.getElementById("fecha_entrega").valueAsDate = null;
		document.getElementById("fecha_solicitud").valueAsDate = null;
		$scope.pedidos=[];
		$scope.criterio=[];
		$scope.list_Sucursales=[];
		$scope.list_puntoEnvio=[];
		$scope.itemsAgregadosPedido=[];
		$scope.pedidoDetalles=[];
		$scope.sucursalDespacho=[];
		$scope.ciudad='';
		$scope.ciudadSucursal=[];
		$scope.list_items=[];
		$scope.filter=[];
		$scope.list_precios=[];
		CRUD.select("select  codigo_sucursal||'-'||nombre_sucursal as sucursal,*from erp_terceros_sucursales where rowid_tercero = '"+$scope.terceroSelected.rowid+"' ",function(elem){$scope.list_Sucursales.push(elem)})

		//CRUD.selectParametro('erp_terceros_sucursales','rowid_tercero',$scope.terceroSelected.rowid,function(elem){$scope.list_Sucursales.push(elem)});
		//CRUD.selectParametro('erp_terceros_punto_envio','rowid_tercero',$scope.terceroSelected.rowid,function(elem){$scope.list_puntoEnvio.push(elem)});	''
		//$scope.pedidos.rowid_tercero=$scope.terceroSelected.rowid
	}
	CRUD.select("select count(*) as cantidad from erp_entidades_master ",function(elem){console.log(elem.cantidad)})
	$scope.onChangeSucursal=function(){
		if ($scope.sucursal==undefined) {$scope.pedidos.rowid_lista_precios='';$scope.list_items=[];return}
		$scope.list_precios=[];
		var consultacriterio="select*from erp_entidades_master where id_tipo_maestro='CRITERIO_CLASIFICACION' and erp_id_maestro='"+$scope.sucursal.id_criterio_clasificacion.trim()+"'"
		CRUD.select(consultacriterio,function(elem){
			$scope.criterio=elem;
		})
		CRUD.select("select count(*) as dataValidacion,erp_id_maestro||'-'||erp_descripcion as concatenado ,*from erp_entidades_master where erp_id_maestro = '"+$scope.sucursal.id_lista_precios+"'  and id_tipo_maestro='LISTA_PRECIOS' order by rowid LIMIT 1",
			
			function(elem){
				if (elem.dataValidacion==0) {
					CRUD.select("select erp_id_maestro||'-'||erp_descripcion as concatenado , * from erp_entidades_master where erp_id_maestro = '001' and id_tipo_maestro='LISTA_PRECIOS'",function(elem){
						
						$scope.list_precios.push(elem);$scope.listaPrecios=$scope.list_precios[0];$scope.pedidos.rowid_lista_precios=$scope.listaPrecios.rowid;//$scope.onChangeListaPrecios();
					})
				}
				else
				{
					$scope.list_precios.push(elem);$scope.listaPrecios=$scope.list_precios[0];$scope.pedidos.rowid_lista_precios=$scope.listaPrecios.rowid;//$scope.onChangeListaPrecios();		
				}
				
			});
		//CRUD.selectParametro('erp_entidades_master','erp_id_maestro',$scope.sucursal.id_lista_precios,function(elem){$scope.list_precios.push(elem)});
		$scope.pedidos.rowid_cliente_facturacion=$scope.sucursal.rowid;
	}

	$scope.onChangeSucursalDespacho=function()
	{
		//console.log("select  *from erp_terceros_punto_envio where rowid_tercero = '"+$scope.terceroSelected.rowid+"'  and  codigo_sucursal = '"+$scope.sucursalDespacho.codigo_sucursal+"'   order by rowid  LIMIT 1  ");
		$scope.pedidos.rowid_cliente_despacho=$scope.sucursalDespacho.rowid;
		CRUD.select("select pais.nombre||'-'||ciudad.nombre as nombre from m_localizacion  pais inner join m_localizacion ciudad  on ciudad.id_pais=pais.id_pais and pais.id_depto='' and pais.id_ciudad=''  where ciudad.id_ciudad='"+$scope.sucursalDespacho.id_ciudad+"' and ciudad.id_depto='"+$scope.sucursalDespacho.id_depto+"' and ciudad.id_pais='"+$scope.sucursalDespacho.id_pais+"'",
			function(elem){$scope.ciudadSucursal=elem});
		CRUD.select("select id_punto_envio||'-'||nombre_punto_envio as concatenado, *from erp_terceros_punto_envio where rowid_tercero = '"+$scope.terceroSelected.rowid+"'  and  codigo_sucursal = '"+$scope.sucursalDespacho.codigo_sucursal+"'   order by rowid  LIMIT 1  ",
			function(elem){$scope.list_puntoEnvio.push(elem);$scope.pedidos.id_punto_envio=elem.rowid;$scope.puntoEnvio=elem});
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
	$scope.onChangeFiltroTercero=function(){
		if ($scope.Search=='') {$scope.terceroSelected=[];}
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
		console.log($scope.cantidadBase)
		if($scope.cantidadBase==undefined)
		{
			Mensajes('Agrege una Cantidad al item','error','');
			return
		}
		if($scope.cantidadBase=='')
		{
			Mensajes('Agrege una Cantidad al item','error','');
			return
		}
		if ($scope.itemsAgregadosPedido.indexOf($scope.item) == -1) {
			$scope.item.cantidad=$scope.cantidadBase;
			$scope.item.iva=$scope.item.precio*$scope.item.impuesto_porcentaje/100;
			$scope.item.valorTotal=0;
			$scope.itemsAgregadosPedido.unshift($scope.item);
			Mensajes('Item Agregado','success','');
			$scope.item=[];
			$scope.SearchItem='';
			$scope.cantidadBase='';
			$scope.CalcularCantidadValorTotal();
			$scope.filter=[];
			$scope.list_items=[];
		}
		else
		{
			Mensajes('El Item ya existe en la lista','error','');
		}
		
	}
	$scope.CalcularCantidadValorTotal=function(){
		$scope.valortotal=0;
		$scope.iva=0;
		$scope.cantidad=0;
		$scope.ivatotal=0;
		$scope.precioEstandar=0;
		$scope.precioEstandar1=0;
		angular.forEach($scope.itemsAgregadosPedido,function(value,key){
			$scope.precioEstandar1+=value.precio*value.cantidad;
			$scope.precioEstandar=value.precio*value.cantidad;
			$scope.valortotal+=$scope.precioEstandar;
			$scope.cantidad+=value.cantidad;
			$scope.ivatotal+=value.iva*value.cantidad;
		})
		$scope.pedidoDetalles.neto=$scope.precioEstandar1;
		$scope.pedidoDetalles.iva=$scope.ivatotal;
		$scope.pedidoDetalles.cantidad=$scope.cantidad;
		$scope.pedidoDetalles.total=$scope.valortotal+$scope.ivatotal;
	}
	$scope.delete = function (index) {
		console.log(index)
    	$scope.itemsAgregadosPedido.splice(index, 1);
    	$scope.CalcularCantidadValorTotal();
	}
	$scope.guardarDetalle=function(){
		
		angular.forEach($scope.itemsAgregadosPedido,function(value,key){
			CRUD.select('select max(rowid) as rowid from t_pedidos',function(elem){
				$scope.p1=[];
				$scope.p1.push(elem);
				$scope.ultimoseleccionado=[];
				$scope.ultimoseleccionado=$scope.p1[0];
				$scope.detalle=[];
				$scope.detalle.rowid=$scope.ultimoseleccionado.rowid+1;
				$scope.detalle.rowid_item=value.rowid_item;
				$scope.detalle.rowid_pedido=$scope.pedidos.rowid;
				$scope.detalle.linea_descripcion=value.descripcion;
				$scope.detalle.id_unidad=value.id_unidad;
				$scope.detalle.cantidad=value.cantidad;
				$scope.detalle.factor=0;
				$scope.detalle.cantidad_base=value.cantidad;
				$scope.detalle.stock=0;
				$scope.detalle.porcen_descuento=value.impuesto_porcentaje;
				$scope.detalle.valor_impuesto=value.iva*value.cantidad;
				$scope.detalle.valor_descuento=0;
				$scope.detalle.valor_total_linea=(value.precio*value.cantidad)+$scope.detalle.valor_impuesto;
				$scope.detalle.precio_unitario=value.precio;
				$scope.detalle.valor_base=value.precio*value.cantidad;
				$scope.detalle.usuariocreacion=$scope.sessiondate.nombre_usuario;
				$scope.detalle.fechacreacion=$scope.CurrentDate();
				CRUD.insert('t_pedidos_detalle',$scope.detalle);
			})
			
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
			$scope.pedidos.modulo_creacion='MOBILE';
			$scope.pedidos.valor_total=$scope.pedidoDetalles.total;
			$scope.pedidos.valor_base=$scope.pedidoDetalles.neto;
			$scope.pedidos.usuariocreacion=$scope.sessiondate.nombre_usuario;
			$scope.pedidos.rowid_empresa=4;
			$scope.pedidos.id_cia=1;
			$scope.pedidos.fecha_pedido=$scope.pedidos.fecha_solicitud;
			$scope.pedidos.fecha_entrega=$scope.pedidos.fecha_solicitud;
			$scope.pedidos.valor_impuesto=$scope.pedidoDetalles.iva;
			$scope.pedidos.valor_descuento=0;
			$scope.pedidos.id_estado=101;
			$scope.pedidos.ind_estado_erp=0;
			$scope.pedidos.valor_facturado=0;
			$scope.pedidos.sincronizado='false';
			
			CRUD.insert('t_pedidos',$scope.pedidos)
		})
	}
	$scope.validacionInsert=function()
	{
		$scope.pedidos.fecha_entrega=$scope.SelectedDate($scope.dateEntrega);
		if ($scope.pedidos.rowid_cliente_facturacion =='' || $scope.pedidos.rowid_cliente_facturacion==undefined) {
			Mensajes("Verifique Que Todos lo campos esten Llenos","error","")
			return
		}
		if ($scope.pedidos.rowid_cliente_despacho =='' || $scope.pedidos.rowid_cliente_despacho==undefined) {
			Mensajes("Verifique Que Todos lo campos esten Llenos","error","")
			return
		}
		if ($scope.pedidos.rowid_lista_precios =='' || $scope.pedidos.rowid_lista_precios==undefined) {
			Mensajes("Verifique Que Todos lo campos esten Llenos","error","")
			return
		}
		if ($scope.pedidos.fecha_solicitud =='' || $scope.pedidos.fecha_solicitud==undefined) {
			$scope.pedidos.fecha_solicitud =$scope.pedidos.fecha_entrega
			//Mensajes("Verifique Que Todos lo campos esten Llenos","error","")
			//return
		}
		if ($scope.pedidos.fecha_entrega =='' || $scope.pedidos.fecha_entrega==undefined) {
			$scope.pedidos.fecha_solicitud =$scope.pedidos.fecha_entrega
			//Mensajes("Verifique Que Todos lo campos esten Llenos","error","")
			//return
		}
		if($scope.itemsAgregadosPedido.length==0)
		{
			Mensajes('Debe Seleccionar al menos un item de la lista','error','');
			return
		}
		$scope.finalizarPedido()
	}
	$scope.ValidacionCabezera=function()
    {
    	$scope.CambiarTab('3','atras');
    	$scope.hasfocus=true;
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
	$scope.validacion=false;
	$scope.pedidos = [];
	$scope.pedidoSeleccionado=[];
	$scope.detallespedido=[];
    CRUD.select('select distinct pedidos.valor_impuesto,pedidos.fecha_solicitud,pedidos.sincronizado, pedidos.rowid as rowidpedido,terceros.razonsocial,sucursal.nombre_sucursal,punto_envio.nombre_punto_envio,pedidos.valor_total,detalle.rowid_pedido,count(detalle.rowid_pedido) cantidaddetalles,sum(detalle.cantidad) as cantidadproductos from  t_pedidos pedidos inner join erp_terceros_sucursales sucursal on sucursal.rowid=pedidos.rowid_cliente_facturacion  inner join erp_terceros terceros on terceros.rowid=sucursal.rowid_tercero  left  join t_pedidos_detalle detalle on detalle.rowid_pedido=pedidos.rowid left join erp_terceros_punto_envio punto_envio on punto_envio.rowid=pedidos.id_punto_envio group by  pedidos.fecha_solicitud,detalle.rowid_pedido,pedidos.rowid,terceros.razonsocial,sucursal.nombre_sucursal,punto_envio.nombre_punto_envio,pedidos.valor_total order by pedidos.fecha_solicitud desc    LIMIT 50',function(elem) {$scope.pedidos.push(elem)});
    CRUD.select("select count(*) as cantidad",function(elem){
    	
    	if (elem.cantidad==0) {
    		$scope.validacion=true;
    	}
    })
	$scope.ConsultarDatos =function(pedido){
		$scope.detallespedido=[];
		$scope.pedidoSeleccionado=pedido;

		CRUD.select('select items.item_referencia, items.item_descripcion, detalle.cantidad, detalle.precio_unitario, detalle.valor_base,detalle.valor_total_linea,detalle.valor_impuesto from t_pedidos pedido left join t_pedidos_detalle detalle on pedido.rowid = detalle.rowid_pedido inner join erp_items items on Detalle.rowid_item = items.rowid where pedido.rowid='+pedido.rowidpedido+'',
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