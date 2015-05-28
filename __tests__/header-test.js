
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
    {'city': 'Portland', 'gfa': 1000},
    {'city': 'Portland', 'gfa': 2000},
    {'city': 'Seattle', 'gfa': 1000},
    {'city': 'Seattle', 'gfa': 2000},
    {'city': 'Seattle', 'gfa': 3000},
  ],
  callback: _.noop,
  searchmeta: {},
};

var renderTable = function(attrs) {
  return TU.renderIntoDocument(
    React.createElement(BE.BETable, attrs)
  );
};

var renderHeader = function(attrs, content) {
  return TU.renderIntoDocument(
    React.createElement(BE.Header, attrs, content)
  );
};

describe('BETable', function () {
  it('renders headers', function () {
    var table = renderTable(tableAttrs);
    var thead = TU.findRenderedDOMComponentWithTag(table, 'thead')
    var headers = thead.props.children[0].props.children;
    expect(headers[0].key).toBe('city');
    expect(headers[0].props.column.title).toBe('City');
    expect(headers[0].props.column.type).toBe('string');
    expect(headers[0].props.column.key).toBe('city');
    expect(headers[0].props.className).toBe('column_head scroll_columns');

    expect(headers[1].key).toBe('gfa');
  });
});

describe('Headers', function () {
  it('standard display', function () {
    var content = "City";
    var header = renderHeader({
      column: tableAttrs.columns[0],
      handleClick: _.noop,
      sorting: {column: tableAttrs.columns[0]}
    }, content);
    expect(header.getDOMNode().textContent).toBe(content);
    expect(header.getDOMNode().className).toBe(" sorted sort_desc");
  });
  it('should take a className', function () {
    var content = "City";
    var header = renderHeader({
      column: tableAttrs.columns[0],
      handleClick: _.noop,
      sorting: {column: tableAttrs.columns[0]},
      className: "happy"
    }, content);
    expect(header.getDOMNode().textContent).toBe(content);
    expect(header.getDOMNode().className).toBe("happy sorted sort_desc");
  });
});

