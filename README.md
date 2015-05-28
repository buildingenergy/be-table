# be-table

the table you've been waiting for

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

    git clone git@github.com:buildingenergy/be-table.git
    cd be-table
    npm install
    gulp dev


## test

    gulp test
    gulp watchtest  # for live reload of tests


## usage

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
