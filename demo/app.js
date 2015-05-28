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
  $scope.tableCallback = function (state) {console.log (state);};
  $scope.paginationInfo = {totalMatchCount: 2000};
  $scope.customTypes = {
    label: {
      cell: {
        className: 'label',
        renderer: function(value, row, col, state) {
          return React.createElement(Label, {
            color: value.color,
          }, [value.name]);
        }
      },
      header: { /* similar format to "cell" definition */ },
      filter: { /* similar format to "cell" definition */ }
    }
  };
  var Label = React.createClass({displayName: "Label", render: function () {
    return React.createElement("span", {className: "label label-success"}, this.props.labelText);
  }});
}])
.directive('betable', function(reactDirective) {
  return reactDirective(window.BE.Table.BETable);
});
