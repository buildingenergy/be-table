/**
 * BETable react component and table library
 *
 * Developer QuickStart:
 *   # install react-tools to compile be-table.jsx to be-table.js
 *   npm install -g react-tools
 *   jsx --watch --extension jsx seed/static/seed/js/jsx/ seed/static/seed/js/jsx/
 *
 * TODO:
 *   - add tests
 *   - implement rowCallback
 *   - implement selectedRows state managment
 *   - implemenet select all???
 *   - move tableCallback into search_service for ease of reuse on the seed app
 *   - extend to handle multiple types for table filter and cells: labels, ranges, year_built, extra_data!, checkbox, date, map pin icon
 *   - range filters
 *   - allow filters to be extended just like cells
 *   - move into its beFrontEndComponents
 *   - conformatters into this code at build time, i.e. make the closure at build time and put the pieces into a src dir, like d3, etc.
 *
 * Usage:
 * JS:
 *   cols = [
 *     {key: 'price', title: 'Price', subtitle: '$', type: 'number'},
 *     {key: 'item', title: 'Item', type: 'string'}
 *   ];
 *   rows = [{item: 'kale', price: 4.34}, {item: 'almonds', price: 5.44}];
 *   tableCallback = function (state) {console.log (state);};
 *   paginationInfo = {totalMatchCount: 2000};
 *
 * HTML:
 *   <BETable columns="cols"
 *            rows="rows"
 *            searchmeta="paginationInfo"
 *            callback="tableCallback"
 *            objectname="'items'"
 *            custom-types="customTypes"
 *            watch-depth="reference"></BETable>
 */


/**
 * EXPERIMENTAL, but mostly working!
 * global types that can be extended via plugin
 *
 * renderer can be either a string or function to be called as a renderer.
 *
 * usage:
 *   // basic example
 *   var customTypes = {};
 *   customTypes.year_built = {
 *     renderer: formatters.numberRenderer,
 *     rendererArgs: [0, false]  // no decimals, no commas
 *   };
 *
 *   // custom React components cells
 *   var Label = React.createClass({displayName: "Label", render: function () {
 *    return React.createElement("span", {className: "label label-success"}, this.props.labelText);
 *    }
 *   });
 *   var customTypes = {};
 *   customTypes.label = {
 *     renderer: function (val) {
 *       return React.createElement(Label, {labelText: val});
 *     }
 *   };
 */


var React = window.React;


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

    let normalFilter = (col, xaxhz) => {
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
      string: {},
      number: {
        filter: {
          renderer: makeRangeFilter('number')
        },
        cell: {
          className: "column_head scroll_columns is_aligned_right",
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

    var completeType = function(type) {
      return _.defaults(type, {
        cell: {
          className: "column_head scroll_columns",
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
        selectedRows: [],
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
      let builder = types[col.type].header;
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
      let builder = types[col.type].filter;
      return (
        <SearchFilter className={getOrCall(builder.className, col)}>
          {getOrCall(builder.renderer, col, 'booboo')}
        </SearchFilter>
        );
    }.bind(this));

    var rows = this.props.rows.map(function (row) {
      return <Row row={row} isSelectedRow={this.isSelectedRow(row)} columns={columnDefs} sorting={this.state.sorting} dataTypes={this.getTypes()} key={row.id}></Row>;
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
    sorting: React.PropTypes.object.isRequired
  },
  handleClick: function (e) {
    this.props.handleClick(e, this.props.column);
  },
  render: function() {
    let classString = this.props.className;
    let content;
    let column = this.props.column;
    if (column === this.props.sorting.column) {
      classString += " sorted";
      if (this.props.sorting.ascending) {
        classString += " sort_asc";
      } else {
        classString += " sort_desc";
      }
    }

    if (column.type == 'multiselector') {
      classString += " check";
      content = (
        <input type="checkbox" />
      );
    } else {
      classString += " column_head scroll_columns";
      content = this.props.column.title;
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
    dataTypes: React.PropTypes.object.isRequired
  },
  render: function() {
    var row = this.props.columns.map(function (c) {
      var isSorted = c === this.props.sorting.column;
      return (
        <Cell column={c}
              row={this.props.row}
              isSorted={isSorted}
              isSelectedRow={this.props.isSelectedRow}
              dataTypes={this.props.dataTypes}/>
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
    column: React.PropTypes.object.isRequired,
    row: React.PropTypes.object.isRequired,
    isSorted: React.PropTypes.bool,
    isSelectedRow: React.PropTypes.bool,
    dataTypes: React.PropTypes.object.isRequired
  },
  render: function () {
    let classString = "scroll_columns is_aligned_left";
    if (this.props.isSorted) {
      classString += " sorted";
    }
    let cellValue = this.props.row[this.props.column.key];
    let type = this.props.column.type || "string";

    if (_.has(this.props.dataTypes, type)) {
      let builder = (this.props.dataTypes[type].cell);
      classString += " " + getOrCall(builder.className, this.props.column);
      cellValue = getOrCall(builder.renderer, cellValue, this.props.row, this.props.column, {isSelectedRow: this.props.isSelectedRow});
    }
    return (
      <td className={classString}>{cellValue}</td>
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
      numberPerPageOptions: [10, 25, 50, 100]
    };
  },
  changePagination: function (r) {
    this.props.paginationCallback({numberPerPage: +r.target.value, currentPage: 1});
  },
  numberOfPages: function () {
    return Math.ceil(this.props.numberOfObjects / this.props.numberPerPage);
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
            <li className={prevDisabled}><a style={prevStyle} onClick={this.prevPage}><i className="fa fa-angle-double-left"></i> Previous</a></li>
            <li className={nextDisabled}><a style={nextStyle} onClick={this.nextPage}>Next <i className="fa fa-angle-double-right"></i></a></li>
          </ul>
        </div>
      </div>
    );
  }
});

// last step add the react component to the mix
getNamespace('BE', 'Table').BETable = BETable;

