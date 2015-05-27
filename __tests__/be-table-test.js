
var srcFile = '../build/js/be-table';
jest.dontMock(srcFile + '.js');
jest.dontMock('lodash');

var React = window.React = require('react/addons');
var _ = window._ = require('lodash');
var BE = require(srcFile);
var TU = React.addons.TestUtils;

var columns = [
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
];

var rows = [
  {'city': 'San Francisco', 'gfa': 1000},
  {'city': 'San Francisco', 'gfa': 2000},
  {'city': 'San Francisco', 'gfa': 3000},
  {'city': 'Portland', 'gfa': 1000},
  {'city': 'Portland', 'gfa': 2000},
];

var callback = function() {

};

describe('BETable', function () {
  it('works', function () {
    var table = TU.renderIntoDocument(
      React.createElement(BE.BETable, {
        columns: columns,
        rows: rows,
        searchmeta: {},
        callback: callback,
        // customTypes: {},
      })
    );
    var thead = TU.findRenderedDOMComponentWithTag(table, 'thead')
    var tbody = TU.findRenderedDOMComponentWithTag(table, 'tbody')
    var headRows = TU.scryRenderedDOMComponentsWithTag(thead, 'tr');
    var bodyRows = TU.scryRenderedDOMComponentsWithTag(tbody, 'tr');
    expect(headRows.length).toBe(2);
    expect(bodyRows.length).toBe(5);
  });
})