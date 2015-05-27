
var srcFile = '../build/js/be-table';
jest.dontMock(srcFile + '.js');
jest.dontMock('lodash');

var React = window.React = require('react/addons');
var _ = window._ = require('lodash');
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
    {'city': 'San Francisco', 'gfa': 1000},
    {'city': 'San Francisco', 'gfa': 2000},
    {'city': 'San Francisco', 'gfa': 3000},
    {'city': 'Portland', 'gfa': 1000},
    {'city': 'Portland', 'gfa': 2000},
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
    var thead = TU.findRenderedDOMComponentWithTag(table, 'thead')
    var tbody = TU.findRenderedDOMComponentWithTag(table, 'tbody')
    var headRows = TU.scryRenderedDOMComponentsWithTag(thead, 'tr');
    var bodyRows = TU.scryRenderedDOMComponentsWithTag(tbody, 'tr');
    expect(headRows.length).toBe(2);
    expect(bodyRows.length).toBe(5);
  });

  it('sorts', function () {
    var table = renderTable(tableAttrs);
    var headers = TU.scryRenderedDOMComponentsWithClass(table, 'column_head');
    var tbody = TU.findRenderedDOMComponentWithTag(table, 'tbody')
    var tableRows, first;
    expect(headers.length).toBe(2);

    TU.Simulate.click(headers[0]);
    tableRows = TU.scryRenderedDOMComponentsWithTag(tbody, 'tr');
    first = TU.scryRenderedDOMComponentsWithTag(tableRows[0], 'td')[0];
    expect(first.props.children).toEqual('San Francisco');

    TU.Simulate.click(headers[0]);
    tableRows = TU.scryRenderedDOMComponentsWithTag(tbody, 'tr');
    first = TU.scryRenderedDOMComponentsWithTag(tableRows[0], 'td')[0];
    expect(first.props.children).toEqual('Portland');
  });
})