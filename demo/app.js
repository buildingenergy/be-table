/**
* Demo of be-table
*/


angular.module('app', ['react'])
.controller('beCtrl', ['$scope', '$log', '$filter', function ($scope, $log, $filter) {
  $scope.columns = [
    {key: 'price', title: 'Price', subtitle: '$', type: 'number'},
    {key: 'item', title: 'Item', type: 'string'},
    {key: 'label', title: 'Label', type: 'label'}
  ];
  $scope.rows = [
    {item: 'kale', price: 4.34, label: {text: 'Leafy'}},
    {item: 'almonds', price: 5.44, label: {text: 'Nutty'}},
    {item: 'strawberries', price: 3.20, label: {text: 'Ripe'}}
  ];
  $scope.tableCallback = function (state, tableEvent) {
    $log.info(state, tableEvent);
    if (tableEvent && tableEvent.eventType && tableEvent.eventType === 'columnSorted') {
      $scope.rows = _.sortBy($scope.rows, state.sorting.column.key);
    }
  };
  $scope.paginationInfo = {totalMatchCount: 3};


  /**
   * react custom renderer for the 'label' type
   */
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
