var app_angular= angular.module('PedidosOnline');

app_angular.controller("TercerosController",['Conexion','$scope',function (Conexion,$scope) {
	// body...
	$scope.terceros = [];
	$scope.terceroSeleccionado=[];
    CRUD.selectAll('erp_terceros',function(elem) {$scope.terceros.push(elem)});
    
	$scope.ConsultarDatos =function(tercero){
		$scope.terceroSeleccionado=tercero;
		$scope.CambiarTab('1','siguiente');	
	}
	
	$scope.Refrescar =function(){
    	CRUD.selectAll('erp_terceros',function(elem) {$scope.terceros.push(elem)});
		$scope.Search = '';
	}
	
	
	$scope.CambiarTab = function (tab_actual, accion) {
        var tab_id = null;

        if (tab_actual == '1' && accion == 'siguiente')
            tab_id = 'tab_2';
        else if (tab_actual == '2' && accion == 'atras')
            tab_id = 'tab_1';

        angular.element('ul.tabs li').removeClass('active');
        angular.element('.tab-pane').removeClass('active');

        angular.element("ul.tabs").find("[data-tab='" + tab_id + "']").toggleClass('active');
        angular.element("#" + tab_id).toggleClass('active');
    };
    angular.element('#ui-id-1').mouseover(function (){
        angular.element('#ui-id-1').show();
    });
	
	
}]);



