# be-table

the table you've been waiting for http://buildingenergy.github.io/be-table/

## overview

The table takes at least:
- a list of columns
- a list of rows
- a callback for table events
- an object describing pagination behavior
- (optional) a list of custom column types

### Rows

A row is simply an key-value object describing the table data

### Columns

A column definitions has the following members:
- `key` *string*: the key into the row
- `title` *string*: the value to display in the header
- `sortable` *boolean*: enable/disable column sorting
- `type` *object*: see *Types*

### Types

A column type is a description of how a column of data should render.

Each column consists of three sub-objects:
- `header`: for the table header
- `filter`: for the search filters
- `cell`: for each cell of data in this column

Each of these sub-objects has two members:
- `className` *string*|*function*:
- `renderer` *string*|*function*:

BE-Table comes with several default types:
- `"hidden"` (completely suppresses the column)
- `"string"` (no special formatting)
- `"number"` (uses a range filter, right-aligns data)
- `"date"` (similar to number, but uses a date-picker for filtering)

These default types can be extended with custom types through the `customType`
table property (see usage example)


## dev

```console
git clone git@github.com:buildingenergy/be-table.git
cd be-table
npm install
gulp watch
```

## test

```console
gulp test
gulp watchtest  # for live reload of tests
```

##### debugging tests
*from: http://stackoverflow.com/questions/25142173/debugging-jest-test-cases-using-node-inspector/26415442#26415442*

comment out `harmonize()` in `node_modules/jest-cli/bin/jest.js`

```console
npm install node-debug
npm install node-inspector
node-debug --nodejs --harmony ./node_modules/jest-cli/bin/jest.js --runInBand
```

## usage

Requires: React and lodash

See the demo: index.html

```js
var data = {};
data.columns = [
    {key: 'price', title: 'Price', subtitle: '$', type: 'price'},
    {key: 'item', title: 'Item', type: 'string'},
    {key: 'label', title: 'Label', type: 'label'}
];
data.rows = [
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
var tableCallback = function (state, tableEvent) {
    console.log(state, tableEvent);
};
var paginationInfo = {totalMatchCount: 10};

var customTypes = {
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
var Label = React.createClass({
  displayName: "Label",
  render: function () {
    return React.createElement("span", {className: "label label-success"}, this.props.children);
  }
});


React.createElement(BE.Table.BETable, {
    columns: data.columns,
    rows: data.rows,
    callback: tableCallback,
    objectname: "items",
    customTypes: customTypes,
})
```
