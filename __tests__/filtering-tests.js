
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
      type: 'string'
    },
    {
      key: 'state',
      title: 'State',
      sortable: true,
      type: 'string'
    },
    {
      key: 'gfa',
      title: 'Gross Floor Area (ft2)',
      sortable: true,
      type: 'number'
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
  it('renders filters', function () {
    // arrange
    var table = renderTable(tableAttrs);
    var filters = TU.scryRenderedComponentsWithType(table, BE.SearchFilter);
    var cityFilter = React.findDOMNode(filters[0]);
    var cityFilterInput = cityFilter.children[0];
    var gfaInputFilters = React.findDOMNode(filters[2]).getElementsByTagName("INPUT");
    // assert
    expect(filters.length).toBe(3);
    expect(filters[0].props.className).toBe("sub_head scroll_columns");
    expect(filters[1].props.className).toBe("sub_head scroll_columns");
    expect(cityFilter.tagName).toBe("TH");
    expect(cityFilterInput.tagName).toBe("INPUT");
    expect(cityFilterInput.getAttribute("placeholder")).toBe("City");
    expect(gfaInputFilters[0].getAttribute("placeholder")).toBe("Min");
    expect(gfaInputFilters[1].getAttribute("placeholder")).toBe("Max");
  });
});
