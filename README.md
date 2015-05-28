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
**from: http://stackoverflow.com/questions/25142173/debugging-jest-test-cases-using-node-inspector/26415442#26415442**

comment out `harmonize()` in `node_modules/jest-cli/jest.js`

```console
npm install node-debug
npm install node-inspector
node-debug --nodejs --harmony ./node_modules/jest-cli/bin/jest.js --runInBand
```

### usage

```js
cols = [
  {key: 'price', title: 'Price', subtitle: '$', type: 'number'},
  {key: 'item', title: 'Item', type: 'string'},
  {key: 'label', title: 'Label', type: 'label'},
];
rows = [
    {item: 'kale', price: 4.34, label: {color: 'green', text: 'Leafy'}},
    {item: 'almonds', price: 5.44, label: {color: 'blue', text: 'Nutty'}},
];
tableCallback = function (state) {console.log (state);};
paginationInfo = {totalMatchCount: 2000};
customTypes = {
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
        filter: { /* similar format to "cell" definition */ },
    },
};

React.createElement(BETable, {
    columns: cols,
    rows: rows,
    callback: tableCallback,
    objectname: "items",
    customTypes: customTypes,
})
```
