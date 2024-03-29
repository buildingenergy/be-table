/*jshint esnext: true */

let makeNormalFilter = (filterCallback) => (col) => {
  let classes = classNames("form-control input-sm show", {
    disabled: col.filterable === false
  });

  return (
    <input type="text"
           name={col.key}
           onChange={(ev) => filterCallback(col.key, ev.target.value)}
           className={classes}
           disabled={col.filterable === false ? 'disabled' : ''}
           required="true"
           placeholder={col.title} />
    );
};

/** Convenience function that, given an input type, returns a function
 *  that takes a col and renders a range filter
 */
let makeRangeFilter = (type, filterCallback) => (col) => {
  let minKey = col.key + "__gte";
  let maxKey = col.key + "__lte";

  let classes = classNames("form-control input-sm show", {
    disabled: col.filterable === false
  });

  return (
    <div>
      <div className="col-xs-6">
        <input type={type}
               name={minKey}
               onChange={(ev) => filterCallback(minKey, ev.target.value)}
               className={classes}
               disabled={col.filterable === false ? 'disabled' : ''}
               required="true"
               placeholder="Min" />
      </div>
      <div className="col-xs-6">
        <input type={type}
               name={maxKey}
               onChange={(ev) => filterCallback(maxKey, ev.target.value)}
               className={classes}
               disabled={col.filterable === false ? 'disabled' : ''}
               required="true"
               placeholder="Max" />
      </div>
    </div>
  );
};

let defaultTypes = function (table) {
  return {
    hidden: {
      header: {className: 'hidden'},
      filter: {className: 'hidden'},
      cell: {className: 'hidden'},
    },
    string: {},
    number: {
      filter: {
        renderer: makeRangeFilter('number', table.filterCallback)
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
        renderer: makeRangeFilter('number', table.filterCallback)
      },
      cell: {
        renderer: function(val) {
          return formatters.numberRenderer(val, 0, true);
        },
      }
    },
    date: {
      filter: {
        renderer: makeRangeFilter('date', table.filterCallback)
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
            table.selectAllCallback(node.checked);
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
            table.rowCallback(row, node.checked);
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
};

/**
 * add defaults to unspecified properties of incomplete types
 * @param  {object} type The type definition object
 * @return {object}      The fleshed-out type definition
 */
let completeType = (filterRenderer) => (type) => {
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
      renderer: filterRenderer,
    },
  });
};


/** Get default and custom types merged, with missing values filled with defaults */
let getTableTypes = function (table) {
  let completer = completeType(makeNormalFilter(table.filterCallback));
  let mergedTypes = _.assign({}, defaultTypes(table), table.props.customTypes);
  let allTypes = _.mapValues(mergedTypes, completer);
  return allTypes;
};
