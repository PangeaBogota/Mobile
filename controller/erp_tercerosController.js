var app_angular= angular.module('PedidosOnline');

app_angular.controller("TercerosController",['Conexion','$scope','$http',function (Conexion,$scope,$http) {
	// body...
	$scope.sessiondate=JSON.parse(window.localStorage.getItem("CUR_USER"));
	$scope.usuario=$scope.sessiondate.nombre_usuario;
    $scope.codigoempresa=$scope.sessiondate.codigo_empresa;
    $scope.direccionMaps;
	$scope.correoDescripcion=[];
	$scope.terceros = [];
	$scope.terceroSeleccionado=[];
	$scope.detalleTercero=[];
	$scope.terceroDetalles=[];
    CRUD.select('select*from erp_terceros order by razonsocial',function(elem) {$scope.terceros.push(elem)});
    $scope.query=
	$scope.ConsultarDatos =function(tercero){
		$scope.terceroSeleccionado=tercero;
		$scope.terceroDetalles=[];
		$scope.detalleTercero=[];
		CRUD.select("select sucursal.rowid,  tercero.identificacion, tercero.razonsocial,sucursal.nombre_sucursal,sucursal.direccion1,sucursal.telefono1,contacto.nombres||' '||contacto.apellidos as contacto,contacto.telefono,contacto.celular,contacto.email from erp_terceros tercero inner join erp_terceros_sucursales sucursal  on sucursal.rowid_tercero=tercero.rowid left join crm_contactos contacto on contacto.rowid_sucursal=sucursal.rowid where contacto.ind_principal='true'  and  sucursal.ind_principal='true'  and tercero.rowid="+tercero.rowid+"",
		function(elem){$scope.detalleTercero.push(elem);$scope.terceroDetalles=$scope.detalleTercero[0];})
	}
	$scope.abrirModal=function(tercero){
		$('#terceroOpenModal').click();
		$scope.ConsultarDatos(tercero);
	}
	$scope.abrirModalEmail=function(){
		$('#terceroOpenModalEmail').click();
	}
	$scope.Refrescar =function(){
    	CRUD.selectAll('erp_terceros',function(elem) {$scope.terceros.push(elem)});
		$scope.Search = '';
	}
	
	$scope.enviarCorreo=function(){
		$scope.correoDescripcion.para=$scope.terceroDetalles.email;
		$scope.url='http://demos.pedidosonline.co/Mobile/enviarCorreo?usuario='+$scope.usuario+'&codigo_empresa=' + $scope.codigoempresa + '&datos=' + JSON.stringify($scope.correoDescripcion);
		//$scope.Request($scope.url);
	}
	$scope.Request=function(url){
        
        var responsePromise =$http.get(url);
        responsePromise.success(function(data) {
        	Mensajes('Correo Enviado Correctamente','success','');
        });
        responsePromise.error(function() {
            function error(err) {Mensajes('Error al Subir El Pedido','error','');return }
        });
    }
}]);



