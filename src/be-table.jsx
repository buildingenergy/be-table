/**
 * BETable react component and table library
 */

var React = window.React;
var _ = window._;  // lodash


var BETable = React.createClass({
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
  /** Get default and custom types merged, with missing values filled with defaults */
  getTypes: function () {

    let normalFilter = (col) => {
      return (
        <input type="text"
               name={col.key}
               onChange={(ev) => this.filterCallback(ev.target.name, ev.target.value)}
               className="form-control input-sm show"
               required="true"
               placeholder={col.title} />
        )
    };

    /** Convenience function that, given an input type, returns a function
     *  that takes a col and renders a range filter
     */
    let makeRangeFilter = (type) => (col) => {
      let minKey = col.key + "__gte";
      let maxKey = col.key + "__lte";

      return (
        <div>
          <div className="col-xs-6">
            <input type={type}
                   name={minKey}
                   onChange={(ev) => this.filterCallback(ev.target.name, ev.target.value)}
                   className="form-control input-sm"
                   required="true"
                   placeholder="Min" />
          </div>
          <div className="col-xs-6">
            <input type={type}
                   name={maxKey}
                   onChange={(ev) => this.filterCallback(ev.target.name, ev.target.value)}
                   className="form-control input-sm"
                   required="true"
                   placeholder="Max" />
          </div>
        </div>
      );
    };

    let defaultTypes = {
      hidden: {
        header: {className: 'hidden'},
        filter: {className: 'hidden'},
        cell: {className: 'hidden'},
      },
      string: {},
      number: {
        filter: {
          renderer: makeRangeFilter('number')
        },
        cell: {
          className: "scroll_columns is_aligned_right",
          renderer: function(val) {
            return formatters.numberRenderer(val, 0);
          },
        }
      },
      year: {
        filter: {
          renderer: makeRangeFilter('number')
        },
        cell: {
          renderer: function(val) {
            return formatters.numberRenderer(val, 0, true);
          },
        }
      },
      date: {
        filter: {
          renderer: makeRangeFilter('date')
        },
        cell: {
          renderer: function(val) {
            return formatters.dateRenderer(val);
          }
        }
      },
      multiselector: {
        header: {
          className: "check",
          renderer: (col, state) => {
            let checked = state.selectAll;
            let handler = (ev) => {
              let node = ev.target;
              this.selectAllCallback(node.checked);
              return false;
            };
            return (
              <input type="checkbox"
                     onChange={handler}
                     checked={checked}/>
            );
          }
        },
        filter: {
          className: "check",
        },
        cell: {
          className: "check",
          renderer: (val, row, col, opts) => {
            let checked = opts.isSelectedRow;
            let handler = (ev) => {
              let node = ev.target;
              this.rowCallback(row, node.checked);
              return false;
            };
            return (
              <input type="checkbox"
                     onChange={handler}
                     checked={checked}/>
            );
          }
        }
      }
    };

    var mergedTypes = _.assign({}, defaultTypes, this.props.customTypes);

    // TODO: move className out
    var completeType = function(type) {
      return _.defaults(type, {
        cell: {
          className: "scroll_columns",
          renderer: (val) => val,
        },
        header: {
          className: "column_head scroll_columns",
          renderer: (col) => col.title,
        },
        filter: {
          className: "sub_head scroll_columns",
          renderer: normalFilter,
        },
      });
    };

    let allTypes = _.mapValues(mergedTypes, completeType);

    return allTypes;
  },

  getType: function (type) {
    var types = this.getTypes();
    return types[type] || types['hidden'];
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
    if (!obj.sortable) {
      return;
    }
    var ascending = (this.state.sorting.column === obj) ? !this.state.sorting.ascending : false;
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
      var rows = previousState.selectedRows;
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
      }
    }, function () {
      this.props.callback(this.state, {eventType: 'selectAllToggled'});
    });
  },

  isSelectedRow: function (row) {
    let selected = _.has(this.state.selectedRows, row.id)
    if (this.state.selectAll) {
      selected = !selected;
    }
    return selected;
  },

  render: function() {
    let columnDefs = this.props.columns;
    var types = this.getTypes();

    var headers = columnDefs.map(function (col) {
      let builder = this.getType(col.type).header;
      let className = getOrCall(builder.className, col);
      let content = getOrCall(builder.renderer, col, this.state);
      return (
        <Header key={col.key}
                column={col}
                className={className}
                handleClick={() => this.sortingCallback(col)}
                sorting={this.state.sorting}>
          {content}
        </Header>
      );
    }.bind(this));

    var searchFilters = columnDefs.map(function (col) {
      let builder = this.getType(col.type).filter;
      return (
        <SearchFilter className={getOrCall(builder.className, col)}>
          {getOrCall(builder.renderer, col)}
        </SearchFilter>
        );
    }.bind(this));

    var rows = this.props.rows.map(function (row) {
      return <Row row={row} isSelectedRow={this.isSelectedRow(row)} columns={columnDefs} sorting={this.state.sorting} getType={this.getType} key={row.id}></Row>;
    }.bind(this));

    var numberOfObjects = this.props.searchmeta.totalMatchCount || this.props.searchmeta.number_matching_search;

    return (
      <div>
        <div className="vert_table_scroll_container">
          <table className="table table-striped sortable">
            <thead>
              <tr>
                {headers}
              </tr>
              <tr className="sub_head">
                {searchFilters}
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
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


var Header = React.createClass({
  propTypes: {
    column : React.PropTypes.object.isRequired,
    handleClick: React.PropTypes.func,
    sorting: React.PropTypes.object.isRequired,
    className: React.PropTypes.string
  },
  getDefaultProps: function () {
    return {
      className: ""
    };
  },
  handleClick: function (e) {
    this.props.handleClick(e, this.props.column);
  },
  render: function() {
    let classString = this.props.className;
    let column = this.props.column;
    if (column === this.props.sorting.column) {
      classString += " sorted";
      if (this.props.sorting.ascending) {
        classString += " sort_asc";
      } else {
        classString += " sort_desc";
      }
    }

    return (
      <th className={classString} onClick={this.handleClick}>
        {this.props.children}
      </th>
    );
  }
});


/**
 * SearchFilter: the filter sub header
 * TODO:
 *  - add range filter if column type is date or number or custom
 *  - add date picker to date filter
 *  - add checkbox and checkbox logic (involves checkbox header)
 *  - prevent searching on checkbox column?
 *  - add blank and protected filters
 */
var SearchFilter = React.createClass({

  render: function() {
    let content;
    var thClassString = "sub_head scroll_columns";

    return (
      <th className={thClassString + " " + this.props.className}>
        {this.props.children}
      </th>
    );
  }
});

var Row = React.createClass({
  propTypes: {
    row: React.PropTypes.object.isRequired,
    columns: React.PropTypes.array.isRequired,
    sorting: React.PropTypes.object.isRequired,
    getType: React.PropTypes.func.isRequired
  },
  render: function() {
    var row = this.props.columns.map(function (col) {
      var isSorted = col === this.props.sorting.column;
      let cellValue = this.props.row[col.key];
      let cellBuilder = this.props.getType(col.type).cell;
      let content = getOrCall(cellBuilder.renderer, cellValue, this.props.row, col, {isSelectedRow: this.props.isSelectedRow});
      let className = getOrCall(cellBuilder.className, col);
      return (
        <Cell isSorted={isSorted}
              isSelectedRow={this.props.isSelectedRow}
              className={className}>
          {content}
        </Cell>
      );
    }.bind(this));
    return (
      <tr className={this.props.isSelectedRow ? 'selected-row' : ''}>
        {row}
      </tr>
    );
  }
});

/**
 * Cell: table row cell: `td`
 *   Allows custom React elements to be returned if set in BETable.types
 */
var Cell = React.createClass({
  propTypes: {
    className: React.PropTypes.string.isRequired,
    isSorted: React.PropTypes.bool,
    isSelectedRow: React.PropTypes.bool
  },
  render: function () {
    let classString = this.props.className;
    if (this.props.isSorted) {
      classString += " sorted";
    }
    return (
      <td className={classString}>{this.props.children}</td>
    );
  }
});

/**
 * pagination footer
 */
var TableFooter = React.createClass({
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
    var options = this.props.numberPerPageOptions.map(function (opt) {
      return <option value={opt}>{opt}</option>;
    }.bind(this));
    var numberOfPages = this.numberOfPages();
    var pageStart = ((this.props.currentPage - 1) * this.props.numberPerPage) + 1;
    var pageEnd = (this.props.currentPage === numberOfPages) ? this.props.numberOfObjects : this.props.currentPage * this.props.numberPerPage;
    var prevDisabled = this.props.currentPage <= 1 ? "disabled" : "";
    var prevStyle = this.props.currentPage <= 1 ? {} : {cursor: "pointer"};
    var nextDisabled = this.props.currentPage === numberOfPages ? "disabled" : "";
    var nextStyle = this.props.currentPage === numberOfPages ? {} : {cursor: "pointer"};
    var firstButton;
    var lastButton;
    if (this.props.enableFirstLast) {
        firstButton = (<li className={prevDisabled}><a style={prevStyle} onClick={this.firstPage}><i className="fa fa-angle-double-left"></i><i className="fa fa-angle-double-left"></i> First</a></li>);
        lastButton = (<li className={nextDisabled}><a style={nextStyle} onClick={this.lastPage}>Last <i className="fa fa-angle-double-right"></i><i className="fa fa-angle-double-right"></i></a></li>)
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
var ns = getNamespace('BE', 'Table');
ns.BETable = BETable;
ns.Header = Header;
ns.Row = Row;
ns.Cell = Cell;

try {
  module.exports = {
    BETable: BETable,
    Header: Header,
    Row: Row,
    Cell: Cell,
  };
} catch (e) {

}
