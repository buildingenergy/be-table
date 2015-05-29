# be-table

the table you've been waiting for

### dev

```console
git clone git@github.com:buildingenergy/be-table.git
cd be-table
npm install
gulp watch
```

### test

```console
gulp test
gulp watchtest  # for live reload of tests
```

##### debugging tests
*from: http://stackoverflow.com/questions/25142173/debugging-jest-test-cases-using-node-inspector/26415442#26415442*

comment out `harmonize()` in `node_modules/jest-cli/jest.js`

```console
npm install node-debug
npm install node-inspector
node-debug --nodejs --harmony ./node_modules/jest-cli/bin/jest.js --runInBand
```

### usage

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
tableCallback = function (state, tableEvent) {
    console.log(state, tableEvent);
    if (tableEvent && tableEvent.eventType && tableEvent.eventType === 'columnSorted') {
        // _.sortBy breaks the angular reference to `rows`
        data.rows.sort(sortBy(state.sorting.column.key, state.sorting.ascending));
    }
};
paginationInfo = {totalMatchCount: 3};

React.createElement(BETable, {
    columns: cols,
    rows: rows,
    callback: tableCallback,
    objectname: "items",
    customTypes: customTypes,
})
```
