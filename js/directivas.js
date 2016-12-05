/**
 * Created by dev10 on 1/7/2016.
 */
//interacion de jquery y angular practicoo en las directivas
//Andres AutoCompletar
var app_angular = angular.module('PedidosOnline');
app_angular.directive("myAutocomplete",function () {
    // body...
    function link(scope,element,attrs){
        $(element).autocomplete({

            source:scope[attrs.myAutocomplete],
            select: function(ev,ui){
                ev.preventDefault();
                scope.optionSelected(ui.item.value);
                if (ui.item) {
                    
                }
            },
            focus:function(ev,ui){
                ev.preventDefault();
                $(this).val(ui.item.label);
            }
             
        });
    };
    return{
        link:link
    };
})
app_angular.directive('focusMe', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      scope.$watch(attrs.focusMe, function(value) {
        if(value === true) { 
          console.log('value=',value);
          //$timeout(function() {
            element[0].focus();
            scope[attrs.focusMe] = false;
          //});
        }
      });
    }
  };
})
app_angular.directive('setFocusIf', function($timeout) {
  return {
    link: function($scope, $element, $attr) {
      $scope.$watch($attr.setFocusIf, function(value) {
        if ( value ) {
          $timeout(function() {
            // We must reevaluate the value in case it was changed by a subsequent
            // watch handler in the digest.
            if ( $scope.$eval($attr.setFocusIf) ) {
              $element[0].focus();
            }
          }, 0, false);
        }
      });
    }
  }
});

app_angular.run(function($window, $rootScope) {
      $rootScope.online = navigator.onLine;
      $window.addEventListener("offline", function() {
        $rootScope.$apply(function() {
          $rootScope.online = false;
        });
      }, false);

      $window.addEventListener("online", function() {
        $rootScope.$apply(function() {
          $rootScope.online = true;
        });
      }, false);
});

app_angular.controller('exitController', function($scope, $window) {
    $scope.onExit = function() {
      return ('bye bye');
    };

   $window.onbeforeunload =  $scope.onExit;
  });

app_angular.directive('ngTarget', function ($parse, $timeout) {
    var NON_ASSIGNABLE_MODEL_EXPRESSION = 'Non-assignable model expression: ';
    return {
        restrict: "A",
        link: function (scope, element, attr) {
            var buildGetterSetter = function (name) {
                var me = {};
                me.get = $parse(name);
                me.set = me.get.assign;
                if (!me.set) {
                    throw Error(NON_ASSIGNABLE_MODEL_EXPRESSION + name);
                }
                return me;
            };

            // *********** focus *********** 
            var focusTriggerName = attr.ngTarget + "._focusTrigger";
            var focusTrigger = buildGetterSetter(focusTriggerName);
            var focus = buildGetterSetter(attr.ngTarget + ".focus");

            focusTrigger.set(scope, 0);
            focus.set(scope, function () {
                focusTrigger.set(scope, 1);
            });

            // $watch the trigger variable for a transition
            scope.$watch(focusTriggerName, function (newValue, oldValue) {
                if (newValue > 0) {
                    $timeout(function () { // a timing workaround hack
                        element[0].focus(); // without jQuery, need [0]
                        focusTrigger.set(scope, 0);
                    }, 50);
                }
            });

            // *********** blur *********** 
            var blurTriggerName = attr.ngTarget + "._blurTrigger";
            var blurTrigger = buildGetterSetter(blurTriggerName);
            var blur = buildGetterSetter(attr.ngTarget + ".blur");

            blurTrigger.set(scope, 0);
            blur.set(scope, function () {
                blurTrigger.set(scope, 1);
            });

            // $watch the trigger variable for a transition
            scope.$watch(blurTriggerName, function (newValue, oldValue) {
                if (newValue > 0) {
                    $timeout(function () { // a timing workaround hack
                        element[0].blur(); // without jQuery, need [0]
                        blurTrigger.set(scope, 0);
                    }, 50);
                }
            });

            // *********** select *********** 
            var selectTriggerName = attr.ngTarget + "._selectTrigger";
            var selectTrigger = buildGetterSetter(selectTriggerName);
            var select = buildGetterSetter(attr.ngTarget + ".select");

            selectTrigger.set(scope, 0);
            select.set(scope, function () {
                selectTrigger.set(scope, 1);
            });

            // $watch the trigger variable for a transition
            scope.$watch(selectTriggerName, function (newValue, oldValue) {
                if (newValue > 0) {
                    $timeout(function () { // a timing workaround hack
                        element[0].select(); // without jQuery, need [0]
                        selectTrigger.set(scope, 0);
                    }, 50);
                }
            });

        }
    };

});
app_angular.directive('chosen', function($timeout) {

  var linker = function(scope, element, attr) {

    $timeout(function () {
      element.chosen();
    }, 0, false);
  };

  return {
    restrict: 'A',
    link: linker
  };
});

