'use strict';


var app_angular= angular.module('PedidosOnline');

app_angular.controller("actividadesController",['Conexion','$scope',function (Conexion,$scope) {
	$scope.events=[];
	$scope.actividades=[];
	$scope.eventSources=[];
	$scope.fechainicial;
	$scope.fechafinal;
	$scope.NuevoEvento=[];
	CRUD.select('select  substr( fecha_inicial, 7,13 ) as fecha_inicial,substr( fecha_final, 7,13 ) as fecha_final,tema,ind_prioridad from crm_Actividades',
	function(elem){
		$scope.actividades.push(elem);
		//hora Inicial
		$scope.fechainicial=new Date(+elem.fecha_inicial);
		//Hora Final
		$scope.fechafinal=new Date(+elem.fecha_final);
		
		if (elem.ind_prioridad=='Alta') {
			$scope.events.push({title:elem.tema,start:new Date($scope.fechainicial),color:'red'})	
		}
		else if (elem.ind_prioridad=='Media') {
			$scope.events.push({title:elem.tema,start:new Date($scope.fechainicial),color:'orange'})	
		}
		else{
			$scope.events.push({title:elem.tema,start:new Date($scope.fechainicial),color:'blue'})	
		}
		$scope.eventSources=$scope.events;
		angular.element('#calendar1').fullCalendar('removeEvents');
		angular.element('#calendar1').fullCalendar( 'addEventSource', $scope.eventSources )
		angular.element('#calendar1').fullCalendar('rerenderEvents');
	})
	var started;
    var categoryClass;
    var ended;
	$scope.eventSources=$scope.events;
	$scope.calOptions={
		editable:true,
		selectable: true,
		selectHelper: true,
		header:{
			left:'prev,next today',
			center:'title',
			right:'month,agendaWeek,agendaDay',
			
		},
		select: function (start, end, allDay) {
            $('#fc_create').click();

            started = start;
            ended = end

            $(".antosubmit").on("click", function () {
                var title = $("#title").val();
                if (end) {
                    ended = end
                }
                categoryClass = $("#event_type").val();

                if (title) {
                    angular.element('#calendar1').fullCalendar('renderEvent', {
                            title: title,
                            start: started,
                            end: end,
                            allDay: allDay
                        },
                        true // make the event "stick"
                    );
                }
                $('#title').val('');
                angular.element('#calendar1').fullCalendar('unselect');
				//Agregar Evento a Base de Datos

                $('.antoclose').click();
                

                return false;
            });
        },
        eventClick: function (calEvent, jsEvent, view) {
            //alert(calEvent.title, jsEvent, view);

            $('#fc_edit').click();
            $('#title2').val(calEvent.title);
            categoryClass = $("#event_type").val();

            $(".antosubmit2").on("click", function () {
                calEvent.title = $("#title2").val();

                ngular.element('#calendar1').fullCalendar('updateEvent', calEvent);
                $('.antoclose2').click();
            });
            angular.element('#calendar1').fullCalendar('unselect');
        }
	}

	$scope.AgregarActividad=function(){

	}
	
	
}]);

