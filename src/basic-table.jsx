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
    let result =  _.merge(obj0, obj1, (subObj0, subObj1) => {
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
      numHeaderRows: React.PropTypes.number,  // defaults to 1
      columns: React.PropTypes.array.isRequired,
      rows: React.PropTypes.array.isRequired,
      dispatchers: React.PropTypes.object,
      renderers: React.PropTypes.object,
      callback: React.PropTypes.func,
      tableClasses: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.func,
        React.PropTypes.array,
      ]),
    },

    getDefaultProps: () => {
      return {
        context: {},
        numHeaderRows: 1,
        tableClasses: '',
      };
    },

    defaultDispatchers: {
      row: (columns, rowData, context) => 'base',
      cell: (column, rowData, context) => 'base',
    },

    defaultRenderers: {
      row: {
        base: (columns, rowData, content, context) => {
          return (
            <tr>{content}</tr>
          );
        }
      },
      cell: {
        base: (column, rowData, context) => {
          let content = _.get(rowData, column);
          return <td>{content}</td>;
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

    getDispatchValue: function (type, columnOrColumns, rowData, context) {
      let dispatchers = this.getDispatchers(),
          dispatch = _.get(dispatchers, type),
          dispatchValue = dispatch(columnOrColumns, rowData, context);
      return dispatchValue;
    },

    getRenderer: function (type, dispatchValue) {
      let renderers = this.getRenderers(),
          renderer = (_.get(renderers, [type, dispatchValue]) ||
                      _.get(renderers, [type, 'base']));
      return renderer;
    },

    lookupRenderer: function (type, columnOrColumns, rowData, context) {
      let dispatchValue = this.getDispatchValue(type, columnOrColumns, rowData, context);
      return this.getRenderer(type, dispatchValue);
    },

    renderRow: function (columns, rowData, content, context) {
      let render = this.lookupRenderer('row', columns, rowData, context);
      return render(columns, rowData, content, context);
    },

    renderCell: function (column, rowData, context) {
      let render = this.lookupRenderer('cell', column, rowData, context);
      return render(column, rowData, context);
    },

    render: function () {
      let context = this.props.context,
          numHeaderRows = this.props.numHeaderRows,
          columns = this.props.columns,
          rows = this.props.rows,
          renderRow = this.renderRow,
          renderCell = this.renderCell,
          renderedRows = _.map(rows, (rowData) => {
            let renderedCells = _.map(columns, (column) => {
              return renderCell(column, rowData, context);
            });
            return renderRow(columns, rowData, renderedCells, context);
          }),
          renderedHeaderRows = _.take(renderedRows, numHeaderRows),
          renderedBodyRows = _.drop(renderedRows, numHeaderRows);

      return (
        <table className={this.computeTableClasses()}>
          <thead>
            {renderedHeaderRows}
          </thead>
          <tbody>
            {renderedBodyRows}
          </tbody>
        </table>
      );
    }

  });

  // last step add the react component to the mix
  let ns = getNamespace('BE', 'Table');

  ns.BasicTable = BasicTable;
  ns.basicTable = React.createFactory(BasicTable);

  try {
    module.exports = {
      BasicTable: BasicTable,
      basicTable: ns.basicTable,
    };
  } catch (e) {

  }

})(window._);
