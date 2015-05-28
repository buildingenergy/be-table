/**
* Demo of be-table
*/


angular.module('app', ['react'])
.controller('beCtrl', ['$scope', '$log', function ($scope, $log) {
  $scope.columns = [
    {key: 'price', title: 'Price', subtitle: '$', type: 'number'},
    {key: 'item', title: 'Item', type: 'string'},
    {key: 'label', title: 'Label', type: 'label'},
  ];
  $scope.rows = [
    {item: 'kale', price: 4.34, label: {color: 'green', text: 'Leafy'}},
    {item: 'almonds', price: 5.44, label: {color: 'blue', text: 'Nutty'}},
  ];
  $scope.tableCallback = function (state) {
    $log.info(state);
  };
  $scope.paginationInfo = {totalMatchCount: 2000};
  $scope.customTypes = {
    label: {
      cell: {
        className: 'scroll_columns',
        renderer: function(value, row, col, state) {
          return React.createElement(Label, {}, [value.text]);
        }
      }
    }
  };
  var Label = React.createClass(
    {
      displayName: "Label",
      render: function () {
        return React.createElement("span", {className: "label label-success"}, this.props.children);
      }
    }
  );
}])
.directive('betable', function(reactDirective) {
  return reactDirective(window.BE.Table.BETable);
});
