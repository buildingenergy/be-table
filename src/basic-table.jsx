/*jshint esnext: true */
/**
 * BETable react component and table library
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
      }
    },

    defaultRenderers: {
      header: {
        base: function (column, context) {
          return (
            <th>A header!</th>
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

    headerRenderer: function (column, context) {
      let dispatchers = this.getDispatchers(),
          renderers = this.getRenderers(),
          dispatch = dispatchers.header,
          dispatchValue = dispatch(column, context),
          renderer = (_.get(renderers, ['header', dispatchValue]) ||
                      _.get(renderers, ['header', 'base']));
      return renderer;
    },

    renderHeader: function (column, context) {
      let render = this.headerRenderer(column, context);
      return render(column, context);
    },

    cellRenderer: function (column, data, context) {
      let dispatchers = this.getDispatchers(),
          renderers = this.getRenderers(),
          dispatch = dispatchers.cell,
          dispatchValue = dispatch(column, data, context),
          renderer = (_.get(renderers, ['cell', dispatchValue]) ||
                      _.get(renderers, ['cell', 'base']));
      return renderer;
    },

    renderCell: function (column, data, context) {
      let render = this.cellRenderer(column, data, context);
      return render(column, data, context);
    },

    render: function() {

      let columns = this.props.columns,
          rows = this.props.rows,
          subHeaderRows = this.props.subHeaderRows,
          renderHeader = this.renderHeader,
          renderCell = this.renderCell,
          renderedHeaders = _.map(columns, function (column) {
            return renderHeader(column, null);
          }),
          renderedSubheaders = _.map(subHeaderRows, function (subHeaders) {
            return (
              <tr>
                {
                  _.map(subHeaders, function (column) {
                    return renderHeader(column, null);
                  })
                 }
              </tr>
            );
          }),
          renderedRows = _.map(rows, function (data) {
            return (
              <tr>
                {_.map(columns, function (column) {
                  return renderCell(column, data, null);
                 })}
              </tr>
            );
          });

      return (
        <table className={this.computeTableClasses()}>
          <thead>
            <tr>{renderedHeaders}</tr>
            {renderedSubheaders}
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
