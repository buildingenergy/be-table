
var srcFile = '../build/js/be-table';
jest.dontMock(srcFile + '.js');
jest.dontMock('lodash');

var React = window.React = require('react/addons');
var _ = window._ = require('lodash');
var classNames = window.classNames = require('classNames');

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

describe('BETable headers', function () {
  it('renders headers', function () {
    var table = renderTable(tableAttrs);
    var thead = TU.findRenderedDOMComponentWithTag(table, 'thead');
    var headers = thead.props.children[0].props.children;
    expect(headers[0].key).toBe('city');
    expect(headers[0].props.column.title).toBe('City');
    expect(headers[0].props.column.type).toBe('string');
    expect(headers[0].props.column.key).toBe('city');
    expect(headers[0].props.className).toBe('column_head scroll_columns');

    expect(headers[1].key).toBe('gfa');
  });
});

describe('Header', function () {
  it('displays a header!', function () {
    var content = "City";
    var header = renderHeader({
      column: tableAttrs.columns[0],
      handleClick: _.noop,
      sorting: {column: tableAttrs.columns[0]}
    }, content);
    expect(React.findDOMNode(header).textContent).toBe(content);
    expect(React.findDOMNode(header).className).toBe("sorted sort_desc");
    expect(React.findDOMNode(header).tagName).toBe('TH');
  });

  it('should take a className', function () {
    var content = "City";
    var header = renderHeader({
      column: tableAttrs.columns[0],
      handleClick: _.noop,
      sorting: {column: tableAttrs.columns[0]},
      className: "happy"
    }, content);
    expect(React.findDOMNode(header).textContent).toBe(content);
    expect(React.findDOMNode(header).className).toBe("happy sorted sort_desc");
  });

  it('should show the desc sort class when selected and not ascending', function () {
    var content = "City";
    var header = renderHeader({
      column: tableAttrs.columns[0],
      handleClick: _.noop,
      sorting: {
        column: tableAttrs.columns[0],
        ascending: false
      },
      className: "happy"
    }, content);
    expect(React.findDOMNode(header).textContent).toBe(content);
    expect(React.findDOMNode(header).className).toBe("happy sorted sort_desc");
  });

  it('should show the asc sort class when selected and ascending', function () {
    var content = "City";
    var header = renderHeader({
      column: tableAttrs.columns[0],
      handleClick: _.noop,
      sorting: {
        column: tableAttrs.columns[0],
        ascending: true
      },
      className: "happy"
    }, content);
    expect(React.findDOMNode(header).textContent).toBe(content);
    expect(React.findDOMNode(header).className).toBe("happy sorted sort_asc");
  });

  it('should show no sorting classes when not selected', function () {
    var content = "City";
    var header = renderHeader({
      column: tableAttrs.columns[0],
      handleClick: _.noop,
      sorting: {
        column: tableAttrs.columns[1],
        ascending: true
      },
      className: "happy"
    }, content);
    expect(React.findDOMNode(header).textContent).toBe(content);
    expect(React.findDOMNode(header).className).toBe("happy");
  });

  it('should call the callback with the column when clicked', function () {
    // arrange
    var content = "City";
    var mockCallback = jest.genMockFunction();
    var header = renderHeader({
      column: tableAttrs.columns[0],
      handleClick: mockCallback,
      sorting: {
        column: tableAttrs.columns[1],
        ascending: true
      },
      className: "happy"
    }, content);
    // act
    TU.Simulate.click(React.findDOMNode(header));
    // assert
    expect(mockCallback.mock.calls.length).toBe(1);
    expect(mockCallback.mock.calls[0][1]).toBe(tableAttrs.columns[0]);
  });

});
