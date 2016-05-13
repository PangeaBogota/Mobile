/**
 * Created by dev10 on 12/23/2015.
 */
var app_angular = angular.module('PedidosOnline', ['chart.js','ui.calendar','angular-websql', 'ngResource', 'ngRoute']);

app_angular.config(['$routeProvider',//'$locationProvider',
    function ($routeProvider) {
        //, $locationProvider) {
        $routeProvider
            .when("/", {
                controller: 'appController',
                templateUrl: "view/home/home.html"
            })
            .when('/:modulo/:url', {
                template: '<div ng-include="templateUrl">Loading...</div>',
                controller: 'appController'
            })
            .when('/:modulo/:url/:personId', {
                template: '<div ng-include="templateUrl">Loading...</div>',
                controller: 'appController'
            })
            /*.when("/:modulo/:url",{
             controller:'appController',
             templateUrl: function(urlattr){
             if(urlattr.modulo=='pagina_Actual')
             return '#'+ urlattr.url;
             if(urlattr.modulo=='' || urlattr.url=='') {
             urlattr.modulo = 'home';
             urlattr.urlurl = 'home';
             }
             //angular.element('#titulo').html( urlattr.urlurl);
             return 'view/'+ urlattr.modulo+'/' + urlattr.url + '.html';
             }
             })*/
            .otherwise("/");
        // use the HTML5 History API
        //$locationProvider.html5Mode(true);
    }
]);

//CONTROLADOR DE GENERAL
app_angular.controller('sessionController',['Conexion','$scope','$location','$http', '$routeParams', 'Factory' ,function (Conexion, $scope, $location, $http, $routeParams, Factory) {
    $scope.sessiondate=JSON.parse(window.localStorage.getItem("CUR_USER"));
    $scope.pedidos=[];
    $scope.actividades=[];
    $scope.datosSubir=function(){
        ProcesadoShow();
        $scope.pedidos=[];
        $scope.actividades=[];
        $scope.detalle_pedidos=[];
        console.log('entro'); 
        CRUD.select('select *from crm_actividades where usuario_modificacion="MOBILE"',function(elem){$scope.actividades.push(elem)})
        CRUD.select('select *from t_pedidos where usuariomod="MOBILE"',function(elem){$scope.pedidos.push(elem)})
        CRUD.select('select *from t_pedidos_detalle where usuariomod="MOBILE"',function(elem){$scope.detalle_pedidos.push(elem)})
        window.setTimeout(function(){
            ALMACENARDATOS[0]=$scope.actividades;
            ALMACENARDATOS[1]=$scope.pedidos;
            ALMACENARDATOS[2]=$scope.detalle_pedidos;
            if (ALMACENARDATOS[0].length==0) {
                if (ALMACENARDATOS[1].length==0) {
                    if (ALMACENARDATOS[2].length==0) {
                        Mensajes('No hay Datos que Subir','error','') 
                        ProcesadoHiden();
                        return;
                    }
                }
            }
            debugger
            for (var i =0;i< STEP_SUBIRDATOS.length ; i++) {
                
                for (var j =0;j< ALMACENARDATOS[i].length ;j++) {
                    if (STEP_SUBIRDATOS[i]==ENTIDAD_ACTIVIDADES) {
                        $scope.usuario=$scope.sessiondate.nombre_usuario;
                        $scope.codigoempresa=$scope.sessiondate.codigo_empresa;
                        $scope.objeto=ALMACENARDATOS[i][j];
                        SubirDatos( $scope.usuario,'ACTIVIDADES',$scope.objeto,$scope.codigoempresa) 
                        CRUD.Updatedynamic("update crm_actividades set usuario_modificacion='SINCRONIZADO' where rowid="+$scope.objeto.rowid+"");
                    } 
                    if (STEP_SUBIRDATOS[i]==ENTIDAD_PEDIDOS) {
                        $scope.codigoempresa=$scope.sessiondate.codigo_empresa;
                        $scope.objeto=ALMACENARDATOS[i][j];
                        $scope.usuario=$scope.sessiondate.nombre_usuario;
                        SubirDatos( $scope.usuario,'PEDIDOS',$scope.objeto,$scope.codigoempresa) 
                        CRUD.Updatedynamic("update t_pedidos set usuariomod='SINCRONIZADO' where rowid="+$scope.objeto.rowid+"");
                    }
                    if (STEP_SUBIRDATOS[i]==ENTIDAD_PEDIDOS_DETALLE) {
                        $scope.codigoempresa=$scope.sessiondate.codigo_empresa;
                        $scope.usuario=$scope.sessiondate.nombre_usuario;
                        $scope.objeto=ALMACENARDATOS[i][j];
                        SubirDatos( $scope.usuario,'PEDIDO_DETALLE',$scope.objeto,$scope.codigoempresa) 
                        CRUD.Updatedynamic("update t_pedidos_detalle set usuariomod='SINCRONIZADO' where rowid="+$scope.objeto.rowid+"");
                        
                    }  
                }
            }
            Mensajes('Sincronizado Con Exito','success','') 
            ProcesadoHiden();
        },2000)
        
        

    }
    $scope.sincronizar=function(){
        console.log('sincronizo')
        ProcesadoShow();
        for(var i=0; i < STEP_SINCRONIZACION.length; i++)
        {
            DATOS_ENTIDADES_SINCRONIZACION[i]=localStorage.getItem(STEP_SINCRONIZACION[i].toString());
            DATOS_ENTIDADES_SINCRONIZACION[i] = JSON.parse(DATOS_ENTIDADES_SINCRONIZACION[i]);
    
            for(var j=0; j < DATOS_ENTIDADES_SINCRONIZACION[i].length; j++) {
                if (STEP_SINCRONIZACION[i] == ENTIDAD_PEDIDOS) {
                    CRUD.insert('t_pedidos',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                }
                else if (STEP_SINCRONIZACION[i] == ENTIDAD_PEDIDOS_DETALLE) {
                    
                    CRUD.insert('t_pedidos_detalle',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                }
                else if (STEP_SINCRONIZACION[i] == ENTIDAD_TERCEROS) {
                    CRUD.insert('erp_terceros',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                }
                else if (STEP_SINCRONIZACION[i] == ENTIDAD_SUCURSALES) {
                    CRUD.insert('erp_terceros_sucursales',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                }
                else if (STEP_SINCRONIZACION[i] == ENTIDAD_MAESTROS) {
                    CRUD.insert('erp_entidades_master',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                }
                else if (STEP_SINCRONIZACION[i] == ENTIDAD_PUNTOS_ENVIO) {
                    CRUD.insert('erp_terceros_punto_envio',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                }
                else if (STEP_SINCRONIZACION[i] == ENTIDAD_ITEMS) {
                    CRUD.insert('erp_items',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                }
                else if (STEP_SINCRONIZACION[i] == ENTIDAD_ITEMS_PRECIOS) {
                    CRUD.insert('erp_items_precios',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                }
                else if (STEP_SINCRONIZACION[i] == ENTIDAD_ACTIVIDADES) {
                    CRUD.insert('crm_actividades',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                }
                else if (STEP_SINCRONIZACION[i] == ENTIDAD_METACLASS) {
                    CRUD.insert('m_metaclass',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                }
                else if (STEP_SINCRONIZACION[i] == ENTIDAD_ESTADOS) {
                    CRUD.insert('m_estados',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                }
                else if (STEP_SINCRONIZACION[i] == ENTIDAD_CONTACTOS) {
                    CRUD.insert('crm_contactos',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                }

                
                
            }
        }
        
        window.setTimeout(function(){
            Mensajes('Sincronizado Con Exito','success','')
            ProcesadoHiden();
        },5000)
    }

}]);


app_angular.controller('appController',['Conexion','$scope','$location','$http', '$routeParams', 'Factory' ,function (Conexion, $scope, $location, $http, $routeParams, Factory) {
	
    if (window.localStorage.getItem("CUR_USER") == null || window.localStorage.getItem("CUR_USER")==undefined) {
        location.href='login.html';
        return;
    }
    
    if ($routeParams.url == undefined) {
   
    }
    else {
        console.log($routeParams);
        $scope.templateUrl = 'view/' + $routeParams.modulo + '/' + $routeParams.url + '.html';
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
        $scope.day=$scope.YearS+''+$scope.MonthS+''+$scope.DayS;
        return $scope.day;
    }

    $scope.actividadesToday=[];

    var query="select  tema,descripcion,fecha_inicial,fecha_final ,replace(fecha_inicial,'-','') as fecha_inicialF,replace(fecha_final,'-','') as fecha_finalF from crm_actividades ";
    $scope.today=$scope.CurrentDate();
    CRUD.select(query,function(elem){
        var f1 = elem.fecha_inicialF.slice(0,8);
        var f2 = elem.fecha_finalF.slice(0,8);
        f1.replace(' ','');
        f2.replace(' ','');
        if (f1<=$scope.today) {
            if (f2>=$scope.today) {
                $scope.actividadesToday.push(elem);
            }
        }
    })

    $scope.cantidadTerceros=[];
    $scope.cantidadTerceros1=[];
    $scope.cantidadPedidos=[];
    $scope.cantidadPedidos1=[];
    $scope.estadisticagrafica=[];
    $scope.enero=0;
    $scope.febrero=0;
    $scope.marzo=0;
    $scope.abril=0;
    $scope.mayo=0;
    $scope.junio=0;
    $scope.registros=[];
    $scope.validacion='';
    CRUD.select('SELECT COUNT(*) as cantidad FROM erp_terceros',function(elem){$scope.cantidadTerceros.push(elem);$scope.cantidadTerceros1=$scope.cantidadTerceros[0];})
    CRUD.select('SELECT COUNT(*) as cantidad FROM t_pedidos',function(elem){$scope.cantidadPedidos.push(elem);$scope.cantidadPedidos1=$scope.cantidadPedidos[0];})
    CRUD.select("select strftime('%m', fecha_solicitud) as mes,count(strftime('%m', fecha_solicitud)) as cantidad from t_pedidos group by mes ",
        function(elem){$scope.estadisticagrafica.push(elem);
            if (elem.mes=='01') {$scope.enero=elem.cantidad};
            if (elem.mes=='02') {$scope.febrero=elem.cantidad};
            if (elem.mes=='03') {$scope.marzo=elem.cantidad};
            if (elem.mes=='04') {$scope.abril=elem.cantidad};
            if (elem.mes=='05') {$scope.mayo=elem.cantidad};
            if (elem.mes=='06') {$scope.junio=elem.cantidad};
            $scope.registros=[[$scope.enero,$scope.febrero,$scope.marzo,$scope.abril,$scope.mayo,$scope.junio]];
            
    })
    window.setTimeout(function(){
        if ($scope.estadisticagrafica.length==0) {$scope.validacion='No fue encontrado Ningun  Pedido'}
    },2000);
    
    $scope.labels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"];
    $scope.data = [ [65, 59, 80, 81, 56, 55] ];
    $scope.colours=["#26B99A"];
    
    
	
}]);


//CONTROLADOR DE MENU
app_angular.controller('menuController', function ($scope, Factory) {
    $scope.menuList = [
        {
            nombre_opcion: 'Ventas', url: '#/', isSubmenu: true, icono: 'fa fa-bar-chart',
            submenu: [{nombre_opcion: 'Pedidos', url: '#/ventas/pedidos_ingresados'}
            ]
        },
        {
            nombre_opcion: 'Crm', url: '#/', isSubmenu: true, icono: 'icon-user',
            submenu: [{nombre_opcion: 'Clientes', url: '#/crm/terceros'}
            ]
        },
        {
            nombre_opcion: 'Configuracion', url: '#/', isSubmenu: true, icono: 'icon-cog',
            submenu: [{nombre_opcion: 'Mi Cuenta', url: '#/configuracion/mi_cuenta'}, {
                nombre_opcion: 'Cambiar Clave',
                url: '#/'
            }]
        }
    ];
});

//CONTROLADOR DEL LOGIN
app_angular.controller('loginController', function ($scope, Factory, $location, $http) {

    angular.element(document).ready(function () {
        "use strict";
        Login.init(); // Init login JavaScript
    });

    $scope.Login=function(){

        debugger;
        $http.get("https://api.github.com/users/codigofacilito/repos")
            .success(function (data) {
                debugger;
            })
            .error(function (err) {
                console.log("Error" + err);
            });

        //window.localStorage.setItem("user", "user:xxx;pass:xxxxxx;");

    }
});


//CONTROLADOR DE PANTALLA DE CALENDARIO
app_angular.controller('calendarioController', function ($scope, Factory) {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    var h = {};

    if (angular.element('#calendar').width() <= 400) {
        h = {
            left: 'title',
            center: '',
            right: 'prev,next'
        };
    } else {
        h = {
            left: 'prev,next',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        };
    }

    angular.element('#calendar').fullCalendar({
        disableDragging: false,
        header: h,
        editable: true,
        events: [{
            title: 'All Day Event',
            start: new Date(y, m, 1),
            backgroundColor: App.getLayoutColorCode('yellow')
        }, {
            title: 'Long Event',
            start: new Date(y, m, d - 5),
            end: new Date(y, m, d - 2),
            backgroundColor: App.getLayoutColorCode('green')
        }, {
            title: 'Repeating Event',
            start: new Date(y, m, d - 3, 16, 0),
            allDay: false,
            backgroundColor: App.getLayoutColorCode('red')
        }, {
            title: 'Repeating Event',
            start: new Date(y, m, d + 4, 16, 0),
            allDay: false,
            backgroundColor: App.getLayoutColorCode('green')
        }, {
            title: 'Meeting',
            start: new Date(y, m, d, 10, 30),
            allDay: false,
        }, {
            title: 'Lunch',
            start: new Date(y, m, d, 12, 0),
            end: new Date(y, m, d, 14, 0),
            backgroundColor: App.getLayoutColorCode('grey'),
            allDay: false,
        }, {
            title: 'Birthday Party',
            start: new Date(y, m, d + 1, 19, 0),
            end: new Date(y, m, d + 1, 22, 30),
            backgroundColor: App.getLayoutColorCode('purple'),
            allDay: false,
        }, {
            title: 'Click for Google',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            backgroundColor: App.getLayoutColorCode('yellow'),
            url: 'http://google.com/',
        }
        ]
    });
});