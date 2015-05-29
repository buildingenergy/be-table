/**
* Demo of be-table
*/


angular.module('app', ['react'])
.controller('beCtrl', ['$scope', '$log', '$filter', function ($scope, $log, $filter) {
  $scope.data = {};
  $scope.data.columns = [
    {key: 'price', title: 'Price', subtitle: '$', type: 'price'},
    {key: 'item', title: 'Item', type: 'string'},
    {key: 'label', title: 'Label', type: 'label'}
  ];
  $scope.data.rows = [
    {id: 1, item: 'kale', price: 4.34, label: {text: 'Leafy'}},
    {id: 2, item: 'almonds', price: 5.44, label: {text: 'Nutty'}},
    {id: 3, item: 'strawberries', price: 3.50, label: {text: 'Ripe'}},
    {id: 4, item: 'apples', price: 14, label: {text: 'Pucker'}},
    {id: 5, item: 'grapes', price: 1.00, label: {text: 'Red'}},
    {id: 6, item: 'grapes', price: 1.20, label: {text: 'Green'}},
    {id: 7, item: 'oranges', price: 2.10, label: {text: 'Cali'}},
    {id: 8, item: 'oats', price: .20, label: {text: 'Steel'}},
    {id: 9, item: 'dates', price: 13.20},
    {id: 10, item: 'granola', price: 7.40, label: {text: 'Honey'}}
  ];
  $scope.tableCallback = function (state, tableEvent) {
    $log.info(state, tableEvent);
    if (tableEvent && tableEvent.eventType && tableEvent.eventType === 'columnSorted') {
      // _.sortBy breaks the angular reference to `rows`
      $scope.data.rows.sort(sortBy(state.sorting.column.key, state.sorting.ascending));
    }
  };
  $scope.paginationInfo = {totalMatchCount: 11};


  /**
   * react custom renderer for the 'label' type
   */
  $scope.customTypes = {
    label: {
      cell: {
        className: 'scroll_columns',
        renderer: function(value, row, col, state) {
          if (_.isEmpty(value)){
            return "";
          } else {
            return React.createElement(Label, {}, [value.text]);
          }
        }
      }
    },
    price: {
      cell: {
        className: 'scroll_columns text-right',
        renderer: function (value, row, col, state) {
          return window.formatters.numberRenderer(value, 2, true);
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


//http://stackoverflow.com/questions/1129216/sort-array-of-objects-by-property-value-in-javascript
function sortBy(key, reverse) {
  // Move smaller items towards the front
  // or back of the array depending on if
  // we want to sort the array in reverse
  // order or not.
  var moveSmaller = reverse ? 1 : -1;

  // Move larger items towards the front
  // or back of the array depending on if
  // we want to sort the array in reverse
  // order or not.
  var moveLarger = reverse ? -1 : 1;

  /**
   * @param  {*} a
   * @param  {*} b
   * @return {Number}
   */
  return function(a, b) {
    if (a[key] < b[key]) {
      return moveSmaller;
    }
    if (a[key] > b[key]) {
      return moveLarger;
    }
    return 0;
  };
};
