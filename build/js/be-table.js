(function(){
"use strict";

function getNamespace() {
  /**
   * Recursively define a nested object on ``window`` without destroying if it exists
   *
   * e.g.:
   *   getNamespace('BE', 'utils', 'formatting') === window.BE.utils.formatting
   *   // keeps existing objects intact if extant, otherwise creates empty dicts
   */
  var o = window;
  for (var k of arguments) {
    o[k] = o[k] || {};
    o = o[k];
  }
  return o;
}

/* jshint ignore:start */

var formatters = {};

(function (ns){
  /**
   * @ngdoc filter
   * @name date
   * @kind function
   *
   * @description
   *   Formats `date` to a string based on the requested `format`.
   *
   *   `format` string can be composed of the following elements:
   *
   *   * `'yyyy'`: 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
   *   * `'yy'`: 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
   *   * `'y'`: 1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)
   *   * `'MMMM'`: Month in year (January-December)
   *   * `'MMM'`: Month in year (Jan-Dec)
   *   * `'MM'`: Month in year, padded (01-12)
   *   * `'M'`: Month in year (1-12)
   *   * `'dd'`: Day in month, padded (01-31)
   *   * `'d'`: Day in month (1-31)
   *   * `'EEEE'`: Day in Week,(Sunday-Saturday)
   *   * `'EEE'`: Day in Week, (Sun-Sat)
   *   * `'HH'`: Hour in day, padded (00-23)
   *   * `'H'`: Hour in day (0-23)
   *   * `'hh'`: Hour in am/pm, padded (01-12)
   *   * `'h'`: Hour in am/pm, (1-12)
   *   * `'mm'`: Minute in hour, padded (00-59)
   *   * `'m'`: Minute in hour (0-59)
   *   * `'ss'`: Second in minute, padded (00-59)
   *   * `'s'`: Second in minute (0-59)
   *   * `'.sss' or ',sss'`: Millisecond in second, padded (000-999)
   *   * `'a'`: am/pm marker
   *   * `'Z'`: 4 digit (+sign) representation of the timezone offset (-1200-+1200)
   *
   *   `format` string can also be one of the following predefined
   *   {@link guide/i18n localizable formats}:
   *
   *   * `'medium'`: equivalent to `'MMM d, y h:mm:ss a'` for en_US locale
   *     (e.g. Sep 3, 2010 12:05:08 pm)
   *   * `'short'`: equivalent to `'M/d/yy h:mm a'` for en_US  locale (e.g. 9/3/10 12:05 pm)
   *   * `'fullDate'`: equivalent to `'EEEE, MMMM d,y'` for en_US  locale
   *     (e.g. Friday, September 3, 2010)
   *   * `'longDate'`: equivalent to `'MMMM d, y'` for en_US  locale (e.g. September 3, 2010)
   *   * `'mediumDate'`: equivalent to `'MMM d, y'` for en_US  locale (e.g. Sep 3, 2010)
   *   * `'shortDate'`: equivalent to `'M/d/yy'` for en_US locale (e.g. 9/3/10)
   *   * `'mediumTime'`: equivalent to `'h:mm:ss a'` for en_US locale (e.g. 12:05:08 pm)
   *   * `'shortTime'`: equivalent to `'h:mm a'` for en_US locale (e.g. 12:05 pm)
   *
   *   `format` string can contain literal values. These need to be escaped by surrounding with single quotes (e.g.
   *   `"h 'in the morning'"`). In order to output a single quote, escape it - i.e., two single quotes in a sequence
   *   (e.g. `"h 'o''clock'"`).
   *
   * @param {(Date|number|string)} date Date to format either as Date object, milliseconds (string or
   *    number) or various ISO 8601 datetime string formats (e.g. yyyy-MM-ddTHH:mm:ss.sssZ and its
   *    shorter versions like yyyy-MM-ddTHH:mmZ, yyyy-MM-dd or yyyyMMddTHHmmssZ). If no timezone is
   *    specified in the string input, the time is considered to be in the local timezone.
   * @param {string=} format Formatting rules (see Description). If not specified,
   *    `mediumDate` is used.
   * @returns {string} Formatted string or the input if input is not recognized as date/millis.
   *
   * @example
     <example>
       <file name="index.html">
         <span ng-non-bindable>{{1288323623006 | date:'medium'}}</span>:
             <span>{{1288323623006 | date:'medium'}}</span><br>
         <span ng-non-bindable>{{1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'}}</span>:
            <span>{{1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'}}</span><br>
         <span ng-non-bindable>{{1288323623006 | date:'MM/dd/yyyy @ h:mma'}}</span>:
            <span>{{'1288323623006' | date:'MM/dd/yyyy @ h:mma'}}</span><br>
         <span ng-non-bindable>{{1288323623006 | date:"MM/dd/yyyy 'at' h:mma"}}</span>:
            <span>{{'1288323623006' | date:"MM/dd/yyyy 'at' h:mma"}}</span><br>
       </file>
       <file name="protractor.js" type="protractor">
         it('should format date', function() {
           expect(element(by.binding("1288323623006 | date:'medium'")).getText()).
              toMatch(/Oct 2\d, 2010 \d{1,2}:\d{2}:\d{2} (AM|PM)/);
           expect(element(by.binding("1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'")).getText()).
              toMatch(/2010\-10\-2\d \d{2}:\d{2}:\d{2} (\-|\+)?\d{4}/);
           expect(element(by.binding("'1288323623006' | date:'MM/dd/yyyy @ h:mma'")).getText()).
              toMatch(/10\/2\d\/2010 @ \d{1,2}:\d{2}(AM|PM)/);
           expect(element(by.binding("'1288323623006' | date:\"MM/dd/yyyy 'at' h:mma\"")).getText()).
              toMatch(/10\/2\d\/2010 at \d{1,2}:\d{2}(AM|PM)/);
         });
       </file>
     </example>
   */
  function dateRenderer(date, format) {
    var toString = Object.prototype.toString;
    var slice = [].slice;
    function isString(value){return typeof value === 'string';}
    function int(str) {
      return parseInt(str, 10);
    }
    function isNumber(value){return typeof value === 'number';}
    function isDate(value) {
      return toString.call(value) === '[object Date]';
    }
    function concat(array1, array2, index) {
      return array1.concat(slice.call(array2, index));
    }
    var uppercase = function(string){return isString(string) ? string.toUpperCase() : string;};
    function padNumber(num, digits, trim) {
      var neg = '';
      if (num < 0) {
        neg =  '-';
        num = -num;
      }
      num = '' + num;
      while(num.length < digits) {
        num = '0' + num;
      }
      if (trim) {
        num = num.substr(num.length - digits);
      }
      return neg + num;
    }

    function dateGetter(name, size, offset, trim) {
      offset = offset || 0;
      return function(date) {
        var value = date['get' + name]();
        if (offset > 0 || value > -offset){
          value += offset;
        }
        if (value === 0 && offset === -12 ) {
          value = 12;
        }
        return padNumber(value, size, trim);
      };
    }
    function ampmGetter(date, formats) {
      return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
    }
    function timeZoneGetter(date) {
      var zone = -1 * date.getTimezoneOffset();
      var paddedZone = (zone >= 0) ? "+" : "";

      paddedZone += padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) +
                    padNumber(Math.abs(zone % 60), 2);

      return paddedZone;
    }

    function dateStrGetter(name, shortForm) {
      return function(date, formats) {
        var value = date['get' + name]();
        var get = uppercase(shortForm ? ('SHORT' + name) : name);

        return formats[get][value];
      };
    }
    var $locale = $locale || {};
    $locale.DATETIME_FORMATS = {
      MONTH:
          'January,February,March,April,May,June,July,August,September,October,November,December'
          .split(','),
      SHORTMONTH:  'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(','),
      DAY: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
      SHORTDAY: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(','),
      AMPMS: ['AM','PM'],
      medium: 'MMM d, y h:mm:ss a',
      short: 'M/d/yy h:mm a',
      fullDate: 'EEEE, MMMM d, y',
      longDate: 'MMMM d, y',
      mediumDate: 'MMM d, y',
      shortDate: 'M/d/yy',
      mediumTime: 'h:mm:ss a',
      shortTime: 'h:mm a'
    };
    var DATE_FORMATS = {
      yyyy: dateGetter('FullYear', 4),
        yy: dateGetter('FullYear', 2, 0, true),
         y: dateGetter('FullYear', 1),
      MMMM: dateStrGetter('Month'),
       MMM: dateStrGetter('Month', true),
        MM: dateGetter('Month', 2, 1),
         M: dateGetter('Month', 1, 1),
        dd: dateGetter('Date', 2),
         d: dateGetter('Date', 1),
        HH: dateGetter('Hours', 2),
         H: dateGetter('Hours', 1),
        hh: dateGetter('Hours', 2, -12),
         h: dateGetter('Hours', 1, -12),
        mm: dateGetter('Minutes', 2),
         m: dateGetter('Minutes', 1),
        ss: dateGetter('Seconds', 2),
         s: dateGetter('Seconds', 1),
         // while ISO 8601 requires fractions to be prefixed with `.` or `,`
         // we can be just safely rely on using `sss` since we currently don't support single or two digit fractions
       sss: dateGetter('Milliseconds', 3),
      EEEE: dateStrGetter('Day'),
       EEE: dateStrGetter('Day', true),
         a: ampmGetter,
         Z: timeZoneGetter
    };

    var DATE_FORMATS_SPLIT = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,
        NUMBER_STRING = /^\-?\d+$/;
    var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
                       // 1        2       3         4          5          6          7          8  9     10      11
    function jsonStringToDate(string) {
      var match;
      if (match = string.match(R_ISO8601_STR)) {
        var date = new Date(0),
            tzHour = 0,
            tzMin  = 0,
            dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear,
            timeSetter = match[8] ? date.setUTCHours : date.setHours;

        if (match[9]) {
          tzHour = int(match[9] + match[10]);
          tzMin = int(match[9] + match[11]);
        }
        dateSetter.call(date, int(match[1]), int(match[2]) - 1, int(match[3]));
        var h = int(match[4]||0) - tzHour;
        var m = int(match[5]||0) - tzMin;
        var s = int(match[6]||0);
        var ms = Math.round(parseFloat('0.' + (match[7]||0)) * 1000);
        timeSetter.call(date, h, m, s, ms);
        return date;
      }
      return string;
    }


    function formatter(date, format) {
      var text = '',
          parts = [],
          fn, match;

      format = format || 'mediumDate';
      format = $locale.DATETIME_FORMATS[format] || format;
      if (isString(date)) {
        date = NUMBER_STRING.test(date) ? int(date) : jsonStringToDate(date);
      }

      if (isNumber(date)) {
        date = new Date(date);
      }

      if (!isDate(date)) {
        return date;
      }

      while(format) {
        match = DATE_FORMATS_SPLIT.exec(format);
        if (match) {
          parts = concat(parts, match, 1);
          format = parts.pop();
        } else {
          parts.push(format);
          format = null;
        }
      }

      _.each(parts, function(value){
        fn = DATE_FORMATS[value];
        text += fn ? fn(date, $locale.DATETIME_FORMATS)
                   : value.replace(/(^'|'$)/g, '').replace(/''/g, "'");
      });

      return text;
    }
    return formatter(date, format);
  }




  /**
   * formats numbers or number strings to proper fractionSize, lifted from
   *   AngularJS with support for removing commas, i.e. the group separator.
   *
   * Usage:
   *    numberFormatter(123)
   *    "123"
   *    numberFormatter(123, 0)
   *    "123"
   *    numberFormatter(123, 1)
   *    "123.0"
   *    numberFormatter(123.11111111)
   *    "123.111"
   *    numberFormatter(123.11111111, 1)
   *    "123.1"
   *    numberFormatter(123.11, -1)
   *    "120"
   *    numberFormatter(123123, 2)
   *    "123,123.00"
   *    numberFormatter(123123)
   *    "123,123"
   *    numberFormatter(123123, 0)
   *    "123,123"
   *    numberFormatter(123123, 0, true)
   *    "123123"
   *    numberFormatter(123123, 1, true)
   *    "123123.0"
   *    numberFormatter(-123123, 0, true)
   *    "-123123"
   *
   *
   *
   * @param  {number/str} number
   * @param  {int} fractionSize
   * @param  {bool} commas
   * @return {str}
   */
  function numberRenderer(number, fractionSize, noCommas){
    var pattern = { // Decimal Pattern
      minInt: 1,
      minFrac: 0,
      maxFrac: 3,
      posPre: '',
      posSuf: '',
      negPre: '-',
      negSuf: '',
      gSize: 3,
      lgSize: 3
    };
    var groupSep = ',';
    var decimalSep = '.';
    var isUndefined = _.isUndefined;
    var isObject = _.isObject;
    var DECIMAL_SEP = '.';


    /**
     * lifted from AngularJS
     */
    function formatNumber(number, pattern, groupSep, decimalSep, fractionSize, noGroupSep) {
      if (number === null || !isFinite(number) || isObject(number)) {
        return '';
      }

      var isNegative = number < 0;
      number = Math.abs(number);
      var numStr = number + '',
          formatedText = '',
          parts = [];

      var hasExponent = false;
      if (numStr.indexOf('e') !== -1) {
        var match = numStr.match(/([\d\.]+)e(-?)(\d+)/);
        if (match && match[2] === '-' && match[3] > fractionSize + 1) {
          numStr = '0';
          number = 0;
        } else {
          formatedText = numStr;
          hasExponent = true;
        }
      }

      if (!hasExponent) {
        var fractionLen = (numStr.split(DECIMAL_SEP)[1] || '').length;

        // determine fractionSize if it is not specified
        if (isUndefined(fractionSize)) {
          fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac);
        }

        // safely round numbers in JS without hitting imprecisions of floating-point arithmetics
        // inspired by:
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
        number = +(Math.round(+(number.toString() + 'e' + fractionSize)).toString() + 'e' + -fractionSize);

        if (number === 0) {
          isNegative = false;
        }

        var fraction = ('' + number).split(DECIMAL_SEP);
        var whole = fraction[0];
        fraction = fraction[1] || '';

        var i, pos = 0,
            lgroup = pattern.lgSize,
            group = pattern.gSize;

        if (whole.length >= (lgroup + group)) {
          pos = whole.length - lgroup;
          for (i = 0; i < pos; i++) {
            if ((pos - i)%group === 0 && i !== 0 && !noGroupSep) {
              formatedText += groupSep;
            }
            formatedText += whole.charAt(i);
          }
        }

        for (i = pos; i < whole.length; i++) {
          if ((whole.length - i)%lgroup === 0 && i !== 0 && !noGroupSep) {
            formatedText += groupSep;
          }
          formatedText += whole.charAt(i);
        }

        // format fraction part.
        while(fraction.length < fractionSize) {
          fraction += '0';
        }

        if (fractionSize && fractionSize !== "0") {
          formatedText += decimalSep + fraction.substr(0, fractionSize);
        }
      } else {

        if (fractionSize > 0 && number > -1 && number < 1) {
          formatedText = number.toFixed(fractionSize);
        }
      }

      parts.push(isNegative ? pattern.negPre : pattern.posPre);
      parts.push(formatedText);
      parts.push(isNegative ? pattern.negSuf : pattern.posSuf);
      return parts.join('');
    }
    return formatNumber(number, pattern, groupSep, decimalSep, fractionSize, noCommas);
  }
  ns.numberRenderer = numberRenderer;
  ns.dateRenderer = dateRenderer;
})(formatters);
/* jshint ignore:end */

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
var BETable = React.createClass({displayName: "BETable",
  propTypes: {
    columns : React.PropTypes.array.isRequired,
    rows : React.PropTypes.array.isRequired,
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
      selectedColumn: {},
      ascending: true,
      searchFilters: {},
      currentPage: 1,
      numberPerPage: 10,
      selectedRows: []
    };
  },
  handleColumnClick: function (e, obj) {
    var ascending = (this.state.selectedColumn === obj) ? !this.state.ascending : false;
    this.setState({
      selectedColumn: obj,
      ascending: ascending,
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
      // if row in selectedRows remove, else add
      return {};
    }, function () {
      this.props.callback(this.state, {eventType: 'rowClicked'});
    });
  },
  render: function() {
    var columns = this.props.columns.map(function (c) {
        return React.createElement(Column, {key: c.sort_column, column: c, handleClick: this.handleColumnClick, selectedState: this.state});
    }.bind(this));

    var searchFilters = this.props.columns.map(function (c) {
        return React.createElement(SearchFilter, {key: c.sort_column, column: c, handleChange: this.handleFilterChange, selectedState: this.state});
    }.bind(this));

    var rows = this.props.rows.map(function (r) {
      return React.createElement(Row, {row: r, columns: this.props.columns, selectedState: this.state, renderers: this.getRenderers(), key: r.id});
    }.bind(this));

    var numberOfObjects = this.props.searchmeta.totalMatchCount || this.props.searchmeta.number_matching_search;

    return (
      React.createElement("div", null, 
        React.createElement("div", {className: "vert_table_scroll_container"}, 
          React.createElement("table", {className: "table table-striped sortable"}, 
            React.createElement("thead", null, 
              React.createElement("tr", null, 
                columns
              ), 
              React.createElement("tr", {className: "sub_head"}, 
                searchFilters
              )
            ), 
            React.createElement("tbody", null, 
              rows
            )
          )
        ), 
        React.createElement(TableFooter, {objectName: this.props.objectname, 
                     currentPage: this.state.currentPage, 
                     numberPerPage: this.state.numberPerPage, 
                     numberOfObjects: numberOfObjects, 
                     paginationCallback: this.paginationCallback}, " ")
      )
    );
  }
});


var Column = React.createClass({displayName: "Column",
  propTypes: {
    column : React.PropTypes.object.isRequired,
    handleClick: React.PropTypes.func,
    selectedState: React.PropTypes.object.isRequired
  },
  handleClick: function (e) {
    this.props.handleClick(e, this.props.column);
  },
  render: function() {
    var classString = "column_head scroll_columns";
    if (this.props.column === this.props.selectedState.selectedColumn) {
      classString += " sorted";
      if (this.props.selectedState.ascending) {
        classString += " sort_asc";
      } else {
        classString += " sort_desc";
      }
    }
    return (
      React.createElement("th", {className: classString, onClick: this.handleClick}, 
        this.props.column.title
      )
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
var SearchFilter = React.createClass({displayName: "SearchFilter",
  propTypes: {
    column : React.PropTypes.object.isRequired,
    handleChange: React.PropTypes.func,
    selectedState: React.PropTypes.object.isRequired
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
    if (this.props.column === this.props.selectedState.selectedColumn) {
      thClassString += " sorted";
    }
    if (this.state.input !== "") {
      inputClassString += " active";
    }
    return (
      React.createElement("th", {className: thClassString}, 
        React.createElement("input", {type: "text", className: inputClassString, placeholder: this.props.column.title, onChange: this.handleChange})
      )
    );
  }
});

var Row = React.createClass({displayName: "Row",
  propTypes: {
    row : React.PropTypes.object.isRequired,
    columns : React.PropTypes.array.isRequired,
    selectedState: React.PropTypes.object.isRequired,
    renderers: React.PropTypes.object.isRequired
  },
  render: function() {
    var row = this.props.columns.map(function (c) {
      var sorted = c === this.props.selectedState.selectedColumn;
      return React.createElement(Cell, {column: c, row: this.props.row, sorted: sorted, renderers: this.props.renderers});
    }.bind(this));
    return (
      React.createElement("tr", null, 
        row
      )
    );
  }
});

/**
 * Cell: table row cell: `td`
 *   Allows custom React elements to be returned if set in BETable.types
 */
var Cell = React.createClass({displayName: "Cell",
  propTypes: {
    column: React.PropTypes.object.isRequired,
    row: React.PropTypes.object.isRequired,
    sorted: React.PropTypes.bool,
    renderers: React.PropTypes.object.isRequired
  },
  render: function () {
    var renderer, rendererArgs;
    var classString = "scroll_columns is_aligned_left";
    if (this.props.sorted) {
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
      React.createElement("td", {className: classString}, cellValue)
    );
  }
});

/**
 * pagination footer
 */
var TableFooter = React.createClass({displayName: "TableFooter",
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
      return React.createElement("option", {value: opt}, opt);
    }.bind(this));
    var numberOfPages = this.numberOfPages();
    var pageStart = ((this.props.currentPage - 1) * this.props.numberPerPage) + 1;
    var pageEnd = (this.props.currentPage === numberOfPages) ? this.props.numberOfObjects : this.props.currentPage * this.props.numberPerPage;
    var prevDisabled = this.props.currentPage <= 1 ? "disabled" : "";
    var prevStyle = this.props.currentPage <= 1 ? {} : {cursor: "pointer"};
    var nextDisabled = this.props.currentPage === numberOfPages ? "disabled" : "";
    var nextStyle = this.props.currentPage === numberOfPages ? {} : {cursor: "pointer"};

    return (
        React.createElement("div", {className: "table_footer"}, 
            React.createElement("div", {className: "display_number_entries col-sm-3 col-md-3"}, 
                 React.createElement("div", {className: "display_number_entries_text"}, "Display:"), 
                 React.createElement("div", {className: "display_number_entries_select"}, 
                    React.createElement("select", {className: "form-control input-sm col-xs-2", onChange: this.changePagination}, 
                        options
                    )
                ), 
                React.createElement("div", {className: "display_number_entries_text"}, this.props.objectName)
            ), 
            React.createElement("div", {className: "counts col-sm-6 col-md-6"}, 
                React.createElement("span", null, "Showing ", pageStart, " to ", pageEnd, " of ", this.props.numberOfObjects, " ", this.props.objectName)
            ), 
            React.createElement("div", {className: "pager_container col-sm-3 col-md-3"}, 
                React.createElement("ul", {className: "pager"}, 
                  React.createElement("li", {className: prevDisabled}, React.createElement("a", {style: prevStyle, onClick: this.prevPage}, React.createElement("i", {className: "fa fa-angle-double-left"}), " Previous")), 
                  React.createElement("li", {className: nextDisabled}, React.createElement("a", {style: nextStyle, onClick: this.nextPage}, "Next ", React.createElement("i", {className: "fa fa-angle-double-right"})))
                )
            )
        )
      );
  }
});

// last step add the react component to the mix
getNamespace('BE', 'Table').BETable = BETable;


})();