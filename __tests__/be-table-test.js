
var srcFile = '../build/js/be-table';
jest.dontMock(srcFile + '.js');
jest.dontMock('lodash');

var React = window.React = require('react/addons');
var _ = window._ = require('lodash');
var classNames = window.classNames = require('classnames');

var BE = require(srcFile);
var TU = React.addons.TestUtils;

var tableAttrs = {
  columns: [
    {
      key: 'city',
      title: 'City',
      sortable: true,
      type: 'string',
    },
    {
      key: 'gfa',
      title: 'Gross Floor Area (ft2)',
      sortable: true,
      type: 'number',
    },
  ],
  rows: [
    {'id': 1, 'city': 'Portland', 'gfa': 1000},
    {'id': 2, 'city': 'Portland', 'gfa': 2000},
    {'id': 3, 'city': 'Seattle', 'gfa': 1000},
    {'id': 4, 'city': 'Seattle', 'gfa': 2000},
    {'id': 5, 'city': 'Seattle', 'gfa': 3000},
  ],
  callback: function () {},
  searchmeta: {},
};

var renderTable = function(attrs) {
  return TU.renderIntoDocument(
    React.createElement(BE.BETable, attrs)
  );
};

describe('BETable', function () {
  it('renders rows', function () {
    var table = renderTable(tableAttrs);
    var thead = TU.findRenderedDOMComponentWithTag(table, 'thead');
    var tbody = TU.findRenderedDOMComponentWithTag(table, 'tbody');
    var headRows = TU.scryRenderedDOMComponentsWithTag(thead, 'tr');
    var bodyRows = TU.scryRenderedDOMComponentsWithTag(tbody, 'tr');
    expect(headRows.length).toBe(2);
    expect(bodyRows.length).toBe(5);
  });

  it('sorts', function () {
    var table = renderTable(tableAttrs);
    var thead, tbody, headerRows, headersRow, headers, tableRows, first;

    thead =TU.findRenderedDOMComponentWithTag(table, 'thead');
    tbody = TU.findRenderedDOMComponentWithTag(table, 'tbody');
    headerRows = TU.scryRenderedDOMComponentsWithTag(thead, 'tr');
    headersRow = headerRows[0];
    headers = TU.scryRenderedDOMComponentsWithTag(headersRow, 'th');

    expect(headers.length).toBe(2);


    TU.Simulate.click(React.findDOMNode(headers[0]));
    expect(table.state.sorting.column).toBe(tableAttrs.columns[0]);
    expect(table.state.sorting.ascending).toBe(false);

    TU.Simulate.click(React.findDOMNode(headers[0]));
    expect(table.state.sorting.column).toBe(tableAttrs.columns[0]);
    expect(table.state.sorting.ascending).toBe(true);

    TU.Simulate.click(React.findDOMNode(headers[1]));
    expect(table.state.sorting.column).toBe(tableAttrs.columns[1]);
    expect(table.state.sorting.ascending).toBe(false);
  });
});
