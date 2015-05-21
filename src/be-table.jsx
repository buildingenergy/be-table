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
 *     {sort_column: 'price', title: 'Price', subtitle: '$', type: 'number'},
 *     {sort_column: 'item', title: 'Item', type: 'string'}
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
 *            custom-renderers="customRenderers"
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
 *   var customRenderers = {};
 *   customRenderers.year_built = {
 *     renderer: formatters.numberRenderer,
 *     rendererArgs: [0, false]  // no decimals, no commas
 *   };
 *
 *   // custom React components cells
 *   var Label = React.createClass({displayName: "Label", render: function () {
 *    return React.createElement("span", {className: "label label-success"}, this.props.labelText);
 *    }
 *   });
 *   var customRenderers = {};
 *   customRenderers.label = {
 *     renderer: function (val) {
 *       return React.createElement(Label, {labelText: val});
 *     }
 *   };
 */

var React = window.React;

/** @jsx React.DOM */
var BETable = React.createClass({
  propTypes: {
    columns: React.PropTypes.array.isRequired,
    rows: React.PropTypes.array.isRequired,
    callback: React.PropTypes.func,
    searchmeta: React.PropTypes.object,
    objectname: React.PropTypes.string,
    customRenderers: React.PropTypes.object
  },
  getDefaultProps: function () {
      return {
          objectname: 'rows',
          customRenderers: {}
      };
  },
  getRenderers: function () {
    var rendererDefaults = {
      number: {
        renderer: formatters.numberRenderer,
        rendererArgs: [0]
      },
      date: {
        renderer: formatters.dateRenderer
      }
    };
    return _.assign({}, rendererDefaults, this.props.customRenderers);
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
      selectedRows: []
    };
  },
  handleColumnClick: function (e, obj) {
    var ascending = (this.state.sorting.column === obj) ? !this.state.sorting.ascending : false;
    this.setState({
      sorting: {
        column: obj,
        ascending: ascending,
      },
      currentPage: 1
    }, function () {
      this.props.callback(this.state, {eventType: 'columnClicked'});
    });
  },
  handleFilterChange: function (val, column) {
    this.setState(function (previousState, currentProps) {
      previousState.searchFilters[column.sort_column] = val;
      return {searchFilters: previousState.searchFilters, currentPage: 1};
    }, function () {
      this.props.callback(this.state);
    });
  },
  paginationCallback: function (state) {
    this.setState(state, function () {
      this.props.callback(this.state);
    });
  },
  rowCallback: function (row) {
    this.setState(function (previousState, currentProps) {

      return {};
    }, function () {
      this.props.callback(this.state, {eventType: 'rowClicked'});
    });
  },
  render: function() {
    var columns = this.props.columns.map(function (c) {
        return <Column key={c.sort_column} column={c} handleClick={this.handleColumnClick} sorting={this.state.sorting}></Column>;
    }.bind(this));

    var searchFilters = this.props.columns.map(function (c) {
        return <SearchFilter key={c.sort_column} column={c} handleChange={this.handleFilterChange} sorting={this.state.sorting}></SearchFilter>;
    }.bind(this));

    var rows = this.props.rows.map(function (r) {
      return <Row row={r} columns={this.props.columns} sorting={this.state.sorting} renderers={this.getRenderers()}key={r.id}></Row>;
    }.bind(this));

    var numberOfObjects = this.props.searchmeta.totalMatchCount || this.props.searchmeta.number_matching_search;

    return (
      <div>
        <div className="vert_table_scroll_container">
          <table className="table table-striped sortable">
            <thead>
              <tr>
                {columns}
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


var Column = React.createClass({
  propTypes: {
    column : React.PropTypes.object.isRequired,
    handleClick: React.PropTypes.func,
    sorting: React.PropTypes.object.isRequired
  },
  handleClick: function (e) {
    this.props.handleClick(e, this.props.column);
  },
  render: function() {
    var classString = "column_head scroll_columns";
    if (this.props.column === this.props.sorting.column) {
      classString += " sorted";
      if (this.props.sorting.ascending) {
        classString += " sort_asc";
      } else {
        classString += " sort_desc";
      }
    }
    return (
      <th className={classString} onClick={this.handleClick}>
        {this.props.column.title}
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
  propTypes: {
    column : React.PropTypes.object.isRequired,
    handleChange: React.PropTypes.func,
    sorting: React.PropTypes.object.isRequired
  },
  getDefaultProps: function () {
      return {
        handleChange: _.noop
      };
  },
  getInitialState: function() {
    return {input: ""};
  },
  handleChange: function (e) {
    this.setState({
      input: e.target.value
    });
    this.props.handleChange(e.target.value, this.props.column);
  },
  render: function() {
    var thClassString = "sub_head scroll_columns";
    var inputClassString = "form-control input-sm show";
    if (this.props.column === this.props.sorting.column) {
      thClassString += " sorted";
    }
    if (this.state.input !== "") {
      inputClassString += " active";
    }
    return (
      <th className={thClassString}>
        <input type="text" className={inputClassString}  placeholder={this.props.column.title} onChange={this.handleChange} />
      </th>
    );
  }
});

var Row = React.createClass({
  propTypes: {
    row: React.PropTypes.object.isRequired,
    columns: React.PropTypes.array.isRequired,
    sorting: React.PropTypes.object.isRequired,
    renderers: React.PropTypes.object.isRequired
  },
  render: function() {
    var row = this.props.columns.map(function (c) {
      var isSorted = c === this.props.sorting.column;
      return <Cell column={c} row={this.props.row} isSorted={isSorted} renderers={this.props.renderers}/>;
    }.bind(this));
    return (
      <tr>
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
    renderers: React.PropTypes.object.isRequired
  },
  render: function () {
    var renderer, rendererArgs;
    var classString = "scroll_columns is_aligned_left";
    if (this.props.isSorted) {
      classString += " sorted";
    }
    var cellValue = this.props.row[this.props.column.sort_column];
    var type = this.props.column.type || "string";

    /// REMOVE BELOW HERE IN PRODUCTION (comment in with label demo and a colunn of Property Id to see in action)
    // if (this.props.column.sort_column === "Audit Group") {
    //   type = "label";
    // }
    /// REMOVE ABOVE HERE

    // this is a magical 3 lines of code
    if (_.has(this.props.renderers, type)) {
      renderer = this.props.renderers[type].renderer;
      rendererArgs = [].concat([cellValue], this.props.renderers[type].rendererArgs || []);
      cellValue = renderer.apply(null, rendererArgs);
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

