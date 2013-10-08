angular.module('tabs', []).
directive('angularTabs', function() {
  return {
    restrict: 'E',
    transclude: true,
    scope: { heading: '@' },
    controller: function($scope, $element) {
      var panels = $scope.panels = [];

      $scope.select = function(panel) {
        [].forEach.call(panels, function(panel) {
          panel.selected = false;
        });
        panel.selected = true;
      }

      this.addPanel = function(panel) {
        if (panels.length == 0) {
          $scope.select(panel);
        }
        panels.push(panel);
      }
    },
    template:
 '<div id="container">' +
   '<aside>{{heading}}</aside>' + 
   '<div class="tab-wrapper">' +
     '<h2 ng-repeat="panel in panels" ng-click="select(panel)" ng-class="{active:panel.selected}">{{panel.heading}}</h2>' +
   '</div>' +
   '<div class="contents" ng-transclude></div>' +
 '</div>',
    replace: false
  };
}).
directive('panel', function() {
  return {
    require: '^angularTabs',
    restrict: 'E',
    transclude: true,
    scope: { heading: '@' },
    link: function(scope, element, attrs, tabsCtrl) {
      tabsCtrl.addPanel(scope);
    },
    template:
   '<div ng-show="selected" ng-transclude>' +
     '</div>',
    replace: false
  };
});