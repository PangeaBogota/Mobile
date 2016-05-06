var app_angular= angular.module('PedidosOnline');

app_angular.controller("TercerosController",['Conexion','$scope',function (Conexion,$scope) {
	// body...
	$scope.terceros = [];
	$scope.terceroSeleccionado=[];
	$scope.detalleTercero=[];
	$scope.terceroDetalles=[];
    CRUD.selectAll('erp_terceros',function(elem) {$scope.terceros.push(elem)});
    $scope.query=
	$scope.ConsultarDatos =function(tercero){
		$scope.terceroSeleccionado=tercero;
		$scope.terceroDetalles=[];
		$scope.detalleTercero=[];
		CRUD.select("select sucursal.rowid,  tercero.identificacion, tercero.razonsocial,sucursal.nombre_sucursal,contacto.nombres||' '||contacto.apellidos as contacto,contacto.telefono,contacto.celular from erp_terceros tercero inner join erp_terceros_sucursales sucursal  on sucursal.rowid_tercero=tercero.rowid inner join crm_contactos contacto on contacto.rowid_sucursal=sucursal.rowid where contacto.ind_principal='true'   and tercero.rowid="+tercero.rowid+"",
		function(elem){$scope.detalleTercero.push(elem);$scope.terceroDetalles=$scope.detalleTercero[0];})
	}
	$scope.abrirModal=function(tercero){
		$('#terceroOpenModal').click();
		$scope.ConsultarDatos(tercero);
	}
	$scope.Refrescar =function(){
    	CRUD.selectAll('erp_terceros',function(elem) {$scope.terceros.push(elem)});
		$scope.Search = '';
	}
}]);



