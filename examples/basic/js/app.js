(function (_, React, BE) {
  'use strict';

  var rows = [
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

  var columns = [
    {key: 'price', title: 'Price', subtitle: '$', type: 'price'},
    {key: 'item', title: 'Item', type: 'string'},
    {key: 'label', title: 'Label', type: 'label'}
  ];

  var paginationInfo = { totalMatchCount: 11 };

  var Label = React.createClass({
    displayName: "Label",
    render: function () {
      return React.createElement("span", {className: "label label-success"}, this.props.children);
    }
  });

  var customTypes = {
    label: {
      cell: {
        className: 'scroll_columns',
        renderer: function(value, row, col, state) {
          if (_.isEmpty(value)) {
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
          return BE.Table.formatters.numberRenderer(value, 2, true);
        }
      }
    }
  };

  function render() {
    console.log('rendered table ' + String(Date.now()));
    var props = {
      columns: columns,
      rows: rows,
      searchmeta: paginationInfo,
      objectname: 'items',
      customTypes: customTypes,
      callback: tableCallback
    };
    return React.render(React.createElement(BE.Table.BETable, props),
                        document.getElementById('app'));
  }

  function tableCallback (state, tableEvent) {
    var sortKey = _.get(state, 'sorting.column.key');
    var comparator = _.lt;
    var temp;
    if (tableEvent && tableEvent.eventType && tableEvent.eventType === 'columnSorted') {
      if (!_.get(state, 'sorting.ascending')) {
        comparator = _.gt;
      }

      // sorting in place works, but you need to re-render the element
      // if you are changing a variable reference so using a temp
      // variable to demonstrate that
      temp = _.clone(rows);
      rows = temp.sort(function (a, b) {
        var valA = _.get(a, sortKey);
        var valB = _.get(b, sortKey);
        return comparator(valA, valB);
      });

      // only need to re-render if the data model changes
      // e.g. we don't rerender when the number per page changes in this example
      // because we are not modifying our data in response to that event
      render();
    }
  };

  // kickoff rendering
  render();

})(window._, window.React, window.BE);
