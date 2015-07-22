/*jshint esnext: true */
/**
 * BETable react component and table library
 */
let ns = getNamespace('BE', 'Table');

let BETable = React.createClass({
  propTypes: {
    columns: React.PropTypes.array.isRequired,
    rows: React.PropTypes.array.isRequired,
    callback: React.PropTypes.func,
    searchmeta: React.PropTypes.object,
    objectname: React.PropTypes.string,
    customTypes: React.PropTypes.object
  },

  getDefaultProps: function () {
    return {
      objectname: 'rows',
      customTypes: {}
    };
  },

  buildTypes: function() {
    return getTableTypes(this);
  },

  getType: function (type) {
    let types = this.buildTypes();
    return types[type] || types.hidden;
  },

  getInitialState: function () {
    return {
      sorting: {
        column: {},
        ascending: true,
      },
      searchFilters: {},
      currentPage: 1,
      numberPerPage: 10,
      selectedRows: {},
      selectAll: false,
    };
  },

  sortingCallback: function (obj) {
    if (obj.sortable === false) {
      return;
    }
    let ascending = (this.state.sorting.column === obj) ? !this.state.sorting.ascending : false;
    this.setState({
      sorting: {
        column: obj,
        ascending: ascending,
      },
      currentPage: 1
    }, function () {
      this.props.callback(this.state, {eventType: 'columnSorted'});
    });
  },

  filterCallback: function (key, val) {
    this.setState(function (previousState, currentProps) {
      previousState.searchFilters[key] = val;
      return {searchFilters: previousState.searchFilters, currentPage: 1};
    }, function () {
      this.props.callback(this.state, {eventType: 'filterChanged'});
    });
  },

  paginationCallback: function (state) {
    this.setState(state, function () {
      this.props.callback(this.state, {eventType: 'pagination'});
    });
  },

  rowCallback: function (row, insert) {
    this.setState(function (previousState, currentProps) {
      let rows = previousState.selectedRows;
      if (previousState.selectAll) {
        insert = !insert;
      }

      if (insert) {
        rows[row.id] = row;
      } else {
        delete(rows[row.id]);
      }

      return {
        selectedRows: rows
      };
    }, function () {
      this.props.callback(this.state, {eventType: 'rowClicked'});
    });
  },

  selectAllCallback: function () {
    this.setState((prevState) => {
      let selectAll = !prevState.selectAll;
      return {
        selectedRows: {},
        selectAll: !prevState.selectAll
      };
    }, function () {
      this.props.callback(this.state, {eventType: 'selectAllToggled'});
    });
  },

  isSelectedRow: function (row) {
    let selected = _.has(this.state.selectedRows, row.id);
    if (this.state.selectAll) {
      selected = !selected;
    }
    return selected;
  },

  render: function() {
    let self = this,
        columnDefs = this.props.columns,
        types = this.buildTypes(),
        searchFilters = _.map(columnDefs, function (col) {
          let builder = self.getType(col.type).filter;
          return (
            <SearchFilter className={getOrCall(builder.className, col)} key={col.key}>
              {getOrCall(builder.renderer, col)}
            </SearchFilter>
          );
        });

    let numberOfObjects = this.props.searchmeta.totalMatchCount || this.props.searchmeta.number_matching_search;

    let basicTableProps = {
      columns: columnDefs,
      rows: self.props.rows,
      subHeaderRows: [_.map(columnDefs, function (column) {
        return {
          type: 'search-filter',
          headerColumn: column
        }
      })],
      tableClasses: 'table table-striped sortable',
      dispatchers: {
        header: function (column, context) {
          if (column.type === 'search-filter') {
            return 'filter';
          } else {
            return 'base';
          }
        }
      },
      renderers: {
        header: {
          base: function (column, context) {
            let builder = self.getType(column.type).header,
                content = getOrCall(builder.renderer, column, self.state),
                className = getOrCall(builder.className, column),
                callback = () => self.sortingCallback(column);
            return (
              <th className={className}
                  onClick={callback}>
                {content}
              </th>
            );
          },
          filter: function (column, context) {
            let builder = self.getType(column.headerColumn.type).filter,
                content = getOrCall(builder.renderer, column.headerColumn);
            return (
              <th className="sub_head scroll_columns">
                {content}
              </th>
            );
          }
        },
        row: {
          base: function (columns, data, context, renderedCells) {
            let isSelectedRow = self.isSelectedRow(data),
                className = isSelectedRow ? 'selected-row' : '';
            return (
              <tr className={className}>
                {renderedCells}
              </tr>
            );
          }
        },
        cell: {
          base: function (column, data, context) {
            let cellValue = data[column.key],
                isSorted = (column === self.state.sorting.column),
                isSelectedRow = self.isSelectedRow(data),
                builder = self.getType(column.type).cell,
                content = getOrCall(builder.renderer,
                                    cellValue,
                                    data,
                                    column,
                                    {isSelectedRow: self.isSelectedRow(data)}),
                baseClassName = getOrCall(builder.className, column),
                className = isSorted ? baseClassName + ' sorted' : baseClassName;
            // TODO: need facility to add classes to a tr.
            return <td className={className}>{content}</td>
          }
        }
      }
    },
    basicTable = ns.basicTable(basicTableProps);

    return (
      <div>
        <div className="vert_table_scroll_container">
          {basicTable}
        </div>
        <TableFooter objectName={this.props.objectname}
                     currentPage={this.state.currentPage}
                     numberPerPage={this.state.numberPerPage}
                     numberOfObjects={numberOfObjects}
                     paginationCallback={this.paginationCallback}> </TableFooter>
      </div>
    );
  }
});


/**
 * SearchFilter: the filter sub header
 */
let SearchFilter = React.createClass({
  render: function () {
    let thClassString = "sub_head scroll_columns" + " " + this.props.className;

    return (
      <th className={thClassString}>
        {this.props.children}
      </th>
    );
  }
});


/**
 * pagination footer
 */
let TableFooter = React.createClass({
  propTypes: {
    numberPerPageOptions: React.PropTypes.array,
    numberPerPage: React.PropTypes.number,
    currentPage: React.PropTypes.number,
    numberOfObjects: React.PropTypes.number,
    paginationCallback: React.PropTypes.func
  },
  getDefaultProps: function () {
    return {
      numberPerPageOptions: [10, 25, 50, 100],
      enableFirstLast: true
    };
  },
  changePagination: function (r) {
    this.props.paginationCallback({numberPerPage: +r.target.value, currentPage: 1});
  },
  numberOfPages: function () {
    return Math.ceil(this.props.numberOfObjects / this.props.numberPerPage);
  },
  firstPage: function() {
    this.props.paginationCallback({currentPage: 1});
  },
  lastPage: function() {
    this.props.paginationCallback({currentPage: this.numberOfPages()});
  },
  nextPage: function () {
    if (this.props.currentPage < this.numberOfPages()) {
      this.props.paginationCallback({currentPage: this.props.currentPage + 1});
    }
  },
  prevPage: function () {
    if (this.props.currentPage > 1) {
      this.props.paginationCallback({currentPage: this.props.currentPage - 1});
    }
  },
  render: function () {
    let options = this.props.numberPerPageOptions.map(function (opt) {
      return <option key={opt} value={opt}>{opt}</option>;
    }.bind(this));
    let numberOfPages = this.numberOfPages();
    let pageStart = ((this.props.currentPage - 1) * this.props.numberPerPage) + 1;
    let pageEnd = (this.props.currentPage === numberOfPages) ? this.props.numberOfObjects : this.props.currentPage * this.props.numberPerPage;
    let prevDisabled = this.props.currentPage <= 1 ? "disabled" : "";
    let prevStyle = this.props.currentPage <= 1 ? {} : {cursor: "pointer"};
    let nextDisabled = this.props.currentPage === numberOfPages ? "disabled" : "";
    let nextStyle = this.props.currentPage === numberOfPages ? {} : {cursor: "pointer"};
    let firstButton;
    let lastButton;
    if (this.props.enableFirstLast) {
        firstButton = (<li className={prevDisabled}><a style={prevStyle} onClick={this.firstPage}><i className="fa fa-angle-double-left"></i><i className="fa fa-angle-double-left"></i> First</a></li>);
        lastButton = (<li className={nextDisabled}><a style={nextStyle} onClick={this.lastPage}>Last <i className="fa fa-angle-double-right"></i><i className="fa fa-angle-double-right"></i></a></li>);
    }

    return (
      <div className="table_footer">
        <div className="display_number_entries col-sm-3 col-md-3">
          <div className="display_number_entries_text">Display:</div>
          <div className="display_number_entries_select">
            <select className="form-control input-sm col-xs-2" onChange={this.changePagination}>
              {options}
            </select>
          </div>
          <div className="display_number_entries_text">{this.props.objectName}</div>
        </div>
        <div className="counts col-sm-6 col-md-6">
          <span>Showing {pageStart} to {pageEnd} of {this.props.numberOfObjects} {this.props.objectName}</span>
        </div>
        <div className="pager_container col-sm-3 col-md-3">
          <ul className="pager">
            {firstButton}
            <li className={prevDisabled}><a style={prevStyle} onClick={this.prevPage}><i className="fa fa-angle-double-left"></i> Previous</a></li>
            <li className={nextDisabled}><a style={nextStyle} onClick={this.nextPage}>Next <i className="fa fa-angle-double-right"></i></a></li>
            {lastButton}
          </ul>
        </div>
      </div>
    );
  }
});

// last step add the react component to the mix
ns.BETable = BETable;
ns.SearchFilter = SearchFilter;

try {
  module.exports = {
    BETable: BETable,
    SearchFilter: SearchFilter
  };
} catch (e) {

}
