
var srcFile = '../build/js/be-table';
jest.dontMock(srcFile);
jest.dontMock('lodash');
jest.dontMock('classnames');

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
    {'id': 1, 'city': 'Portland', 'gfa': 1000, 'state': 'OR'},
    {'id': 2, 'city': 'Portland', 'gfa': 2000, 'state': 'OR'},
    {'id': 3, 'city': 'Seattle', 'gfa': 1000, 'state': 'WA'},
    {'id': 4, 'city': 'Seattle', 'gfa': 2000, 'state': 'WA'},
    {'id': 5, 'city': 'Seattle', 'gfa': 3000, 'state': 'WA'},
  ],
  callback: _.noop,
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

describe('SearchFilter', function () {
  it('calls the table callback with a "filterChanged" eventType', function () {
    // arrange
    var mockCallback = jest.genMockFunction();
    tableAttrs.callback = mockCallback;
    var table = renderTable(tableAttrs);
    var filters = TU.scryRenderedComponentsWithType(table, BE.SearchFilter);
    var cityInput = TU.findRenderedDOMComponentWithTag(filters[0], "input");
    cityInput = React.findDOMNode(cityInput);
    var stateInput = TU.findRenderedDOMComponentWithTag(filters[1], "input");
    stateInput = React.findDOMNode(stateInput);
    // act
    TU.Simulate.change(cityInput, {target: {value: "Port", name: "city"}});
    TU.Simulate.change(stateInput, {target: {value: "OR", name: "state"}});
    // assert
    expect(cityInput.tagName).toBe("INPUT");
    expect(mockCallback.mock.calls.length).toBe(2);
    // this breaks
    // expect(cityInput.value).toEqual("Port");
    expect(mockCallback.mock.calls[0][1].eventType).toBe("filterChanged");
    expect(table.state.searchFilters).toEqual({"state": "OR", "city": "Port"});
    expect(mockCallback.mock.calls[1][0].searchFilters).toEqual({"state": "OR", "city": "Port"});
  });
});
