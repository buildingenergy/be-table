
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
  callback: _.noop,
  searchmeta: {},
};

var renderTable = function(attrs) {
  return TU.renderIntoDocument(
    React.createElement(BE.BETable, attrs)
  );
};

describe('BETable headers', function () {
  it('renders headers', function () {
    var table = renderTable(tableAttrs);
    var thead = TU.findRenderedDOMComponentWithTag(table, 'thead');
    var headers = TU.scryRenderedDOMComponentsWithTag(table, 'th');
    headers = _.map(headers, function (h) {
      return h.getDOMNode().textContent;
    });
    expect(headers[0]).toBe(tableAttrs.columns[0].title);
    expect(headers[1]).toBe(tableAttrs.columns[1].title);
  });
});
