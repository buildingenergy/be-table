/**
* Demo of be-table
*/


angular.module('app', ['react'])
.controller('beCtrl', ['$scope', '$log', '$filter', function ($scope, $log, $filter) {
  $scope.data = {};
  $scope.data.columns = [
    {key: 'price', title: 'Price', subtitle: '$', type: 'number'},
    {key: 'item', title: 'Item', type: 'string'},
    {key: 'label', title: 'Label', type: 'label'}
  ];
  $scope.data.rows = [
    {id: 1, item: 'kale', price: 4.34, label: {text: 'Leafy'}},
    {id: 2, item: 'almonds', price: 5.44, label: {text: 'Nutty'}},
    {id: 3, item: 'strawberries', price: 3.20, label: {text: 'Ripe'}}
  ];
  $scope.tableCallback = function (state, tableEvent) {
    $log.info(state, tableEvent);
    if (tableEvent && tableEvent.eventType && tableEvent.eventType === 'columnSorted') {
      var temp = _.cloneDeep($scope.data.rows);
      $scope.data.rows = _.sortBy(temp, state.sorting.column.key);
      if (state.sorting.ascending) {
        $scope.data.rows.reverse();
      }
      $log.info(_.pluck($scope.data.rows, state.sorting.column.key));
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
