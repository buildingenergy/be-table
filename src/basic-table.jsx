/*jshint esnext: true */
/**
 * BE BasicTable react component. BETable delegates to this simpler
 * table component.
 */
(function (_) {

  /**
   * Recusrive merge of two nested objects. Arrays values are not supported.
   */
  function mergeObjects(obj0, obj1) {
    let result =  _.merge(obj0, obj1, function (subObj0, subObj1) {
      if (_.isPlainObject(subObj0)) {
        return mergeObjects(subObj0, subObj1);
      } else {
        return subObj1;
      }
    });
    return result;
  }

  let BasicTable = React.createClass({

    propTypes: {
      // arbitrary context to be passed to renderers
      context: React.PropTypes.object,
      columns: React.PropTypes.array.isRequired,
      rows: React.PropTypes.array.isRequired,
      subHeaderRows: React.PropTypes.array,
      callback: React.PropTypes.func,
      dispatchers: React.PropTypes.object,
      renderers: React.PropTypes.object,
      tableClasses: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.func,
        React.PropTypes.array,
      ]),
    },

    getDefaultProps: function () {
      return {
        tableClasses: ''
      };
    },

    defaultDispatchers: {
      header: function (column, context) {
        return column.type;
      },
      cell: function (column, data, context) {
        return column.type;
      },
      headerRow: function (columns, context) {
        return 'base';
      },
      row: function (columns, data, context) {
        return 'base';
      },
    },

    defaultRenderers: {
      header: {
        base: function (column, context) {
          return (
            <th>A header!</th>
          );
        }
      },
      headerRow: {
        base: function (columns, context, renderedHeaders) {
          return (
            <tr>{renderedHeaders}</tr>
          );
        }
      },
      row: {
        base: function (columns, rowData, context, renderedColumns) {
          return (
            <tr>{renderedColumns}</tr>
          );
        }
      },
      cell: {
        base: function (column, data, context) {
          return <td>A cell!</td>;
        }
      }
    },

    getDispatchers: function () {
      return mergeObjects(this.defaultDispatchers, this.props.dispatchers);
    },

    getRenderers: function () {
      return mergeObjects(this.defaultRenderers, this.props.renderers);
    },

   computeTableClasses: function () {
      // TODO: extend to support a function or an array
      if (_.isString(this.props.tableClasses)) {
        return this.props.tableClasses;
      } else {
        return '';
      }
    },

    getDispatchValue: function (type, args) {
      let dispatchers = this.getDispatchers(),
          dispatch = _.get(dispatchers, type),
          dispatchValue = dispatch.apply(null, args);
      return dispatchValue;
    },

    getRenderer: function (type, dispatchValue) {
      let renderers = this.getRenderers(),
          renderer = (_.get(renderers, [type, dispatchValue]) ||
                      _.get(renderers, [type, 'base']));
      return renderer;
    },

    lookupRenderer: function (type, args) {
      return this.getRenderer(type, this.getDispatchValue(type, args));
    },

    renderHeader: function (column, context) {
      let render = this.lookupRenderer('header', [column, context]);
      return render(column, context);
    },

    renderHeaderRow: function (columns, context, renderedHeaders) {
      let render = this.lookupRenderer('headerRow', [columns, context]);
      return render(columns, context, renderedHeaders);
    },

    renderRow: function (columns, data, context, renderedCells) {
      let render = this.lookupRenderer('row', [columns, data, context, renderedCells]);
      return render(columns, data, context, renderedCells);
    },

    renderCell: function (column, data, context) {
      let render = this.lookupRenderer('cell', [column, data, context]);
      return render(column, data, context);
    },

    render: function() {

      let context = this.props.context,
          columns = this.props.columns,
          rows = this.props.rows,
          subHeaderRows = this.props.subHeaderRows,
          renderHeader = this.renderHeader,
          renderCell = this.renderCell,
          renderHeaderRow = this.renderHeaderRow,
          renderRow = this.renderRow,
          renderedHeaders = _.map(columns, function (column) {
            return renderHeader(column, context);
          }),
          renderedHeadersRow = renderHeaderRow(columns, context, renderedHeaders),
          renderedSubheaders = _.map(subHeaderRows, function (subHeaders) {
            return _.map(subHeaders, function (column) {
              return renderHeader(column, context);
            })
          }),
          renderedSubheadersRows = renderHeaderRow(columns, context, renderedHeaders),
          renderedRows = _.map(rows, function (data) {
            let renderedCells = _.map(columns, function (column) {
              return renderCell(column, data, context);
            });
            return renderRow(columns, data, context, renderedCells);
          });

      return (
        <table className={this.computeTableClasses()}>
          <thead>
            {renderedHeadersRow}
            {renderedSubheadersRows}
            </thead>
            <tbody>
                {renderedRows}
            </tbody>
          </table>
        );

    }

  });

  // last step add the react component to the mix
  let ns = getNamespace('BE', 'Table');

  ns.BasicTable = BasicTable;
  ns.basicTable = (props) => {
    return React.createElement(BasicTable, props);
  };

  try {
    module.exports = {
      BasicTable: BasicTable,
      basicTable: ns.basicTable,
    };
  } catch (e) {

  }

})(window._);
