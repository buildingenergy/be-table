(function(){
'use strict';

var React = window.React;
var _ = window._; // lodash

/*jshint esnext: true */
function getNamespace() {
  /**
   * Recursively define a nested object on ``window`` without destroying if it exists
   *
   * e.g.:
   *   getNamespace('BE', 'utils', 'formatting') === window.BE.utils.formatting
   *   // keeps existing objects intact if extant, otherwise creates empty objects
   */
  var o = window;
  for (var i in arguments) {
    var k = arguments[i];
    o[k] = o[k] || {};
    o = o[k];
  }
  return o;
}

function getOrCall(x) {
  for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }

  if (_.isFunction(x)) {
    return x.apply(this, params);
  } else {
    return x;
  }
}

/*!
  Copyright (c) 2015 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/

(function () {
  'use strict';

  function classNames() {

    var classes = '';

    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      if (!arg) continue;

      var argType = typeof arg;

      if ('string' === argType || 'number' === argType) {
        classes += ' ' + arg;
      } else if (Array.isArray(arg)) {
        classes += ' ' + classNames.apply(null, arg);
      } else if ('object' === argType) {
        for (var key in arg) {
          if (arg.hasOwnProperty(key) && arg[key]) {
            classes += ' ' + key;
          }
        }
      }
    }

    return classes.substr(1);
  }

  if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
    // AMD. Register as an anonymous module.
    define(function () {
      return classNames;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = classNames;
  } else {
    window.classNames = classNames;
  }
})();

/* jshint ignore:start */

var formatters = {};
getNamespace('BE', 'Table').formatters = formatters;

(function (ns) {
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
    function isString(value) {
      return typeof value === 'string';
    }
    function int(str) {
      return parseInt(str, 10);
    }
    function isNumber(value) {
      return typeof value === 'number';
    }
    function isDate(value) {
      return toString.call(value) === '[object Date]';
    }
    function concat(array1, array2, index) {
      return array1.concat(slice.call(array2, index));
    }
    var uppercase = function uppercase(string) {
      return isString(string) ? string.toUpperCase() : string;
    };
    function padNumber(num, digits, trim) {
      var neg = '';
      if (num < 0) {
        neg = '-';
        num = -num;
      }
      num = '' + num;
      while (num.length < digits) {
        num = '0' + num;
      }
      if (trim) {
        num = num.substr(num.length - digits);
      }
      return neg + num;
    }

    function dateGetter(name, size, offset, trim) {
      offset = offset || 0;
      return function (date) {
        var value = date['get' + name]();
        if (offset > 0 || value > -offset) {
          value += offset;
        }
        if (value === 0 && offset === -12) {
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
      var paddedZone = zone >= 0 ? '+' : '';

      paddedZone += padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2);

      return paddedZone;
    }

    function dateStrGetter(name, shortForm) {
      return function (date, formats) {
        var value = date['get' + name]();
        var get = uppercase(shortForm ? 'SHORT' + name : name);

        return formats[get][value];
      };
    }
    var $locale = $locale || {};
    $locale.DATETIME_FORMATS = {
      MONTH: 'January,February,March,April,May,June,July,August,September,October,November,December'.split(','),
      SHORTMONTH: 'Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec'.split(','),
      DAY: 'Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday'.split(','),
      SHORTDAY: 'Sun,Mon,Tue,Wed,Thu,Fri,Sat'.split(','),
      AMPMS: ['AM', 'PM'],
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
            tzMin = 0,
            dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear,
            timeSetter = match[8] ? date.setUTCHours : date.setHours;

        if (match[9]) {
          tzHour = int(match[9] + match[10]);
          tzMin = int(match[9] + match[11]);
        }
        dateSetter.call(date, int(match[1]), int(match[2]) - 1, int(match[3]));
        var h = int(match[4] || 0) - tzHour;
        var m = int(match[5] || 0) - tzMin;
        var s = int(match[6] || 0);
        var ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
        timeSetter.call(date, h, m, s, ms);
        return date;
      }
      return string;
    }

    function formatter(date, format) {
      var text = '',
          parts = [],
          fn,
          match;

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

      while (format) {
        match = DATE_FORMATS_SPLIT.exec(format);
        if (match) {
          parts = concat(parts, match, 1);
          format = parts.pop();
        } else {
          parts.push(format);
          format = null;
        }
      }

      _.each(parts, function (value) {
        fn = DATE_FORMATS[value];
        text += fn ? fn(date, $locale.DATETIME_FORMATS) : value.replace(/(^'|'$)/g, '').replace(/''/g, '\'');
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
  function numberRenderer(number, fractionSize, noCommas) {
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

        var i,
            pos = 0,
            lgroup = pattern.lgSize,
            group = pattern.gSize;

        if (whole.length >= lgroup + group) {
          pos = whole.length - lgroup;
          for (i = 0; i < pos; i++) {
            if ((pos - i) % group === 0 && i !== 0 && !noGroupSep) {
              formatedText += groupSep;
            }
            formatedText += whole.charAt(i);
          }
        }

        for (i = pos; i < whole.length; i++) {
          if ((whole.length - i) % lgroup === 0 && i !== 0 && !noGroupSep) {
            formatedText += groupSep;
          }
          formatedText += whole.charAt(i);
        }

        // format fraction part.
        while (fraction.length < fractionSize) {
          fraction += '0';
        }

        if (fractionSize && fractionSize !== '0') {
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

/*jshint esnext: true */

var makeNormalFilter = function makeNormalFilter(filterCallback) {
  return function (col) {
    var classes = classNames('form-control input-sm show', {
      disabled: col.filterable === false
    });

    return React.createElement('input', { type: 'text',
      name: col.key,
      onChange: function (ev) {
        return filterCallback(col.key, ev.target.value);
      },
      className: classes,
      disabled: col.filterable === false ? 'disabled' : '',
      required: 'true',
      placeholder: col.title });
  };
};

/** Convenience function that, given an input type, returns a function
 *  that takes a col and renders a range filter
 */
var makeRangeFilter = function makeRangeFilter(type, filterCallback) {
  return function (col) {
    var minKey = col.key + '__gte';
    var maxKey = col.key + '__lte';

    var classes = classNames('form-control input-sm show', {
      disabled: col.filterable === false
    });

    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'col-xs-6' },
        React.createElement('input', { type: type,
          name: minKey,
          onChange: function (ev) {
            return filterCallback(minKey, ev.target.value);
          },
          className: classes,
          disabled: col.filterable === false ? 'disabled' : '',
          required: 'true',
          placeholder: 'Min' })
      ),
      React.createElement(
        'div',
        { className: 'col-xs-6' },
        React.createElement('input', { type: type,
          name: maxKey,
          onChange: function (ev) {
            return filterCallback(maxKey, ev.target.value);
          },
          className: classes,
          disabled: col.filterable === false ? 'disabled' : '',
          required: 'true',
          placeholder: 'Max' })
      )
    );
  };
};

var defaultTypes = function defaultTypes(table) {
  return {
    hidden: {
      header: { className: 'hidden' },
      filter: { className: 'hidden' },
      cell: { className: 'hidden' }
    },
    string: {},
    number: {
      filter: {
        renderer: makeRangeFilter('number', table.filterCallback)
      },
      cell: {
        className: 'scroll_columns is_aligned_right',
        renderer: function renderer(val) {
          return formatters.numberRenderer(val, 0);
        }
      }
    },
    year: {
      filter: {
        renderer: makeRangeFilter('number', table.filterCallback)
      },
      cell: {
        renderer: function renderer(val) {
          return formatters.numberRenderer(val, 0, true);
        }
      }
    },
    date: {
      filter: {
        renderer: makeRangeFilter('date', table.filterCallback)
      },
      cell: {
        renderer: function renderer(val) {
          return formatters.dateRenderer(val);
        }
      }
    },
    multiselector: {
      header: {
        className: 'check',
        renderer: function renderer(col, state) {
          var checked = state.selectAll;
          var handler = function handler(ev) {
            var node = ev.target;
            table.selectAllCallback(node.checked);
            return false;
          };
          return React.createElement('input', { type: 'checkbox',
            onChange: handler,
            checked: checked });
        }
      },
      filter: {
        className: 'check'
      },
      cell: {
        className: 'check',
        renderer: function renderer(val, row, col, opts) {
          var checked = opts.isSelectedRow;
          var handler = function handler(ev) {
            var node = ev.target;
            table.rowCallback(row, node.checked);
            return false;
          };
          return React.createElement('input', { type: 'checkbox',
            onChange: handler,
            checked: checked });
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
var completeType = function completeType(filterRenderer) {
  return function (type) {
    return _.defaults(type, {
      cell: {
        className: 'scroll_columns',
        renderer: function renderer(val) {
          return val;
        }
      },
      header: {
        className: 'column_head scroll_columns',
        renderer: function renderer(col) {
          return col.title;
        }
      },
      filter: {
        className: 'sub_head scroll_columns',
        renderer: filterRenderer
      }
    });
  };
};

/** Get default and custom types merged, with missing values filled with defaults */
var getTableTypes = function getTableTypes(table) {
  var completer = completeType(makeNormalFilter(table.filterCallback));
  var mergedTypes = _.assign({}, defaultTypes(table), table.props.customTypes);
  var allTypes = _.mapValues(mergedTypes, completer);
  return allTypes;
};

/*jshint esnext: true */
/**
 * BETable react component and table library
 */
(function (_) {

  /**
   * Recusrive merge of two nested objects. Arrays values are not supported.
   */
  function mergeObjects(obj0, obj1) {
    var result = _.merge(obj0, obj1, function (subObj0, subObj1) {
      if (_.isPlainObject(subObj0)) {
        return mergeObjects(subObj0, subObj1);
      } else {
        // console.log('subs:', subObj0, subObj1);
        return subObj1;
      }
    });
    //    console.log('mergeResult:', result);
    return result;
  }

  var BasicTable = React.createClass({
    displayName: 'BasicTable',

    propTypes: {
      columns: React.PropTypes.array.isRequired,
      rows: React.PropTypes.array.isRequired,
      callback: React.PropTypes.func,
      dispatchers: React.PropTypes.object,
      renderers: React.PropTypes.object,
      tableClasses: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.func, React.PropTypes.array])
    },

    getDefaultProps: function getDefaultProps() {
      return {
        tableClasses: ''
      };
    },

    defaultDispatchers: {
      header: function header(column, context) {
        return column.type;
      },
      cell: function cell(column, data, context) {
        return column.type;
      }
    },

    defaultRenderers: {
      header: {
        base: function base(column, context) {
          return React.createElement(
            'th',
            null,
            'A header!'
          );
        }
      },
      cell: {
        base: function base(column, data, context) {
          return React.createElement(
            'span',
            null,
            'A cell!'
          );
        }
      }
    },

    getDispatchers: function getDispatchers() {
      return mergeObjects(this.defaultDispatchers, this.props.dispatchers);
    },

    getRenderers: function getRenderers() {
      return mergeObjects(this.defaultRenderers, this.props.renderers);
    },

    computeTableClasses: function computeTableClasses() {
      // TODO: extend to support a function or an array
      if (typeof this.props.tableClasses === 'string') {
        return this.props.tableClasses;
      } else {
        return '';
      }
    },

    headerRenderer: function headerRenderer(column, context) {
      var dispatchers = this.getDispatchers(),
          renderers = this.getRenderers(),
          dispatch = dispatchers.header,
          dispatchValue = dispatch(column, context),
          renderer = _.get(renderers, ['header', dispatchValue]) || _.get(renderers, ['header', 'base']);
      return renderer;
    },

    renderHeader: function renderHeader(column, context) {
      var render = this.headerRenderer(column, context);
      return render(column, context);
    },

    cellRenderer: function cellRenderer(column, data, context) {
      var dispatchers = this.getDispatchers(),
          renderers = this.getRenderers(),
          dispatch = dispatchers.cell,
          dispatchValue = dispatch(column, data, context),
          renderer = _.get(renderers, ['cell', dispatchValue]) || _.get(renderers, ['cell', 'base']);
      return renderer;
    },

    renderCell: function renderCell(column, data, context) {
      var render = this.cellRenderer(column, data, context);
      return render(column, data, context);
    },

    render: function render() {

      var columns = this.props.columns,
          rows = this.props.rows,
          renderHeader = this.renderHeader,
          renderCell = this.renderCell,
          renderedHeaders = _.map(columns, function (column) {
        return renderHeader(column, null);
      }),
          renderedRows = _.map(rows, function (data) {
        return React.createElement(
          'tr',
          null,
          _.map(columns, function (column) {
            return renderCell(column, data, null);
          })
        );
      });

      return React.createElement(
        'table',
        { className: this.computeTableClasses() },
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            null,
            renderedHeaders
          )
        ),
        React.createElement(
          'tbody',
          null,
          renderedRows
        )
      );
    }

  });

  // last step add the react component to the mix
  var ns = getNamespace('BE', 'Table');

  ns.BasicTable = BasicTable;
  ns.basicTable = function (props) {
    return React.createElement(BasicTable, props);
  };

  try {
    module.exports = {
      BasicTable: BasicTable,
      basicTable: ns.basicTable
    };
  } catch (e) {}
})(window._);

/*jshint esnext: true */
/**
 * BETable react component and table library
 */
var ns = getNamespace('BE', 'Table');

var BETable = React.createClass({
  displayName: 'BETable',

  propTypes: {
    columns: React.PropTypes.array.isRequired,
    rows: React.PropTypes.array.isRequired,
    callback: React.PropTypes.func,
    searchmeta: React.PropTypes.object,
    objectname: React.PropTypes.string,
    customTypes: React.PropTypes.object
  },

  getDefaultProps: function getDefaultProps() {
    return {
      objectname: 'rows',
      customTypes: {}
    };
  },

  buildTypes: function buildTypes() {
    return getTableTypes(this);
  },

  getType: function getType(type) {
    var types = this.buildTypes();
    return types[type] || types.hidden;
  },

  getInitialState: function getInitialState() {
    return {
      sorting: {
        column: {},
        ascending: true
      },
      searchFilters: {},
      currentPage: 1,
      numberPerPage: 10,
      selectedRows: {},
      selectAll: false
    };
  },

  sortingCallback: function sortingCallback(obj) {
    if (obj.sortable === false) {
      return;
    }
    var ascending = this.state.sorting.column === obj ? !this.state.sorting.ascending : false;
    this.setState({
      sorting: {
        column: obj,
        ascending: ascending
      },
      currentPage: 1
    }, function () {
      this.props.callback(this.state, { eventType: 'columnSorted' });
    });
  },

  filterCallback: function filterCallback(key, val) {
    this.setState(function (previousState, currentProps) {
      previousState.searchFilters[key] = val;
      return { searchFilters: previousState.searchFilters, currentPage: 1 };
    }, function () {
      this.props.callback(this.state, { eventType: 'filterChanged' });
    });
  },

  paginationCallback: function paginationCallback(state) {
    this.setState(state, function () {
      this.props.callback(this.state, { eventType: 'pagination' });
    });
  },

  rowCallback: function rowCallback(row, insert) {
    this.setState(function (previousState, currentProps) {
      var rows = previousState.selectedRows;
      if (previousState.selectAll) {
        insert = !insert;
      }

      if (insert) {
        rows[row.id] = row;
      } else {
        delete rows[row.id];
      }

      return {
        selectedRows: rows
      };
    }, function () {
      this.props.callback(this.state, { eventType: 'rowClicked' });
    });
  },

  selectAllCallback: function selectAllCallback() {
    this.setState(function (prevState) {
      var selectAll = !prevState.selectAll;
      return {
        selectedRows: {},
        selectAll: !prevState.selectAll
      };
    }, function () {
      this.props.callback(this.state, { eventType: 'selectAllToggled' });
    });
  },

  isSelectedRow: function isSelectedRow(row) {
    var selected = _.has(this.state.selectedRows, row.id);
    if (this.state.selectAll) {
      selected = !selected;
    }
    return selected;
  },

  render: function render() {
    var columnDefs = this.props.columns;
    var types = this.buildTypes();

    var headers = columnDefs.map((function (col) {
      var _this = this;

      var builder = this.getType(col.type).header;
      var className = getOrCall(builder.className, col);
      var content = getOrCall(builder.renderer, col, this.state);
      return React.createElement(
        Header,
        { key: col.key,
          column: col,
          className: className,
          handleClick: function () {
            return _this.sortingCallback(col);
          },
          sorting: this.state.sorting },
        content
      );
    }).bind(this));

    var searchFilters = columnDefs.map((function (col) {
      var builder = this.getType(col.type).filter;
      return React.createElement(
        SearchFilter,
        { className: getOrCall(builder.className, col), key: col.key },
        getOrCall(builder.renderer, col)
      );
    }).bind(this));

    var rows = this.props.rows.map((function (row) {
      return React.createElement(Row, { row: row, isSelectedRow: this.isSelectedRow(row), columns: columnDefs, sorting: this.state.sorting, getType: this.getType, key: row.id });
    }).bind(this));

    var numberOfObjects = this.props.searchmeta.totalMatchCount || this.props.searchmeta.number_matching_search;

    var self = this,
        basicTableProps = {
      columns: columnDefs,
      rows: this.props.rows,
      tableClasses: 'table table-striped sortable',
      renderers: {
        header: {
          base: function base(column, context) {
            console.log('custom base renderer called!');
            var builder = self.getType(column.type).header,
                content = getOrCall(builder.renderer, column, self.state);
            return React.createElement(
              'th',
              null,
              content
            );
          }
        }
      }
    },
        basicTable = ns.basicTable(basicTableProps);

    /* old table template delegating to BasicTable now
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
     */

    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'vert_table_scroll_container' },
        basicTable
      ),
      React.createElement(
        TableFooter,
        { objectName: this.props.objectname,
          currentPage: this.state.currentPage,
          numberPerPage: this.state.numberPerPage,
          numberOfObjects: numberOfObjects,
          paginationCallback: this.paginationCallback },
        ' '
      )
    );
  }
});

var Header = React.createClass({
  displayName: 'Header',

  propTypes: {
    column: React.PropTypes.object.isRequired,
    handleClick: React.PropTypes.func,
    sorting: React.PropTypes.object.isRequired,
    className: React.PropTypes.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      className: ''
    };
  },
  handleClick: function handleClick(e) {
    this.props.handleClick(e, this.props.column);
  },
  render: function render() {
    var classes = {};
    var column = this.props.column;
    if (column === this.props.sorting.column) {
      classes = {
        sorted: true,
        sort_asc: this.props.sorting.ascending,
        sort_desc: !this.props.sorting.ascending
      };
    }

    return React.createElement(
      'th',
      { className: classNames(this.props.className, classes), onClick: this.handleClick },
      this.props.children
    );
  }
});

/**
 * SearchFilter: the filter sub header
 */
var SearchFilter = React.createClass({
  displayName: 'SearchFilter',

  render: function render() {
    var thClassString = 'sub_head scroll_columns' + ' ' + this.props.className;

    return React.createElement(
      'th',
      { className: thClassString },
      this.props.children
    );
  }
});

var Row = React.createClass({
  displayName: 'Row',

  propTypes: {
    row: React.PropTypes.object.isRequired,
    columns: React.PropTypes.array.isRequired,
    sorting: React.PropTypes.object.isRequired,
    getType: React.PropTypes.func.isRequired
  },
  render: function render() {
    var row = this.props.columns.map((function (col) {
      var isSorted = col === this.props.sorting.column;
      var cellValue = this.props.row[col.key];
      var cellBuilder = this.props.getType(col.type).cell;
      var content = getOrCall(cellBuilder.renderer, cellValue, this.props.row, col, { isSelectedRow: this.props.isSelectedRow });
      var className = getOrCall(cellBuilder.className, col);

      return React.createElement(
        Cell,
        { isSorted: isSorted,
          isSelectedRow: this.props.isSelectedRow,
          className: className,
          key: col.key },
        content
      );
    }).bind(this));
    return React.createElement(
      'tr',
      { className: this.props.isSelectedRow ? 'selected-row' : '' },
      row
    );
  }
});

/**
 * Cell: table row cell: `td`
 *   Allows custom React elements to be returned if set in BETable.types
 */
var Cell = React.createClass({
  displayName: 'Cell',

  propTypes: {
    className: React.PropTypes.string.isRequired,
    isSorted: React.PropTypes.bool,
    isSelectedRow: React.PropTypes.bool
  },
  render: function render() {
    var classString = this.props.className;
    if (this.props.isSorted) {
      classString += ' sorted';
    }
    return React.createElement(
      'td',
      { className: classString },
      this.props.children
    );
  }
});

/**
 * pagination footer
 */
var TableFooter = React.createClass({
  displayName: 'TableFooter',

  propTypes: {
    numberPerPageOptions: React.PropTypes.array,
    numberPerPage: React.PropTypes.number,
    currentPage: React.PropTypes.number,
    numberOfObjects: React.PropTypes.number,
    paginationCallback: React.PropTypes.func
  },
  getDefaultProps: function getDefaultProps() {
    return {
      numberPerPageOptions: [10, 25, 50, 100],
      enableFirstLast: true
    };
  },
  changePagination: function changePagination(r) {
    this.props.paginationCallback({ numberPerPage: +r.target.value, currentPage: 1 });
  },
  numberOfPages: function numberOfPages() {
    return Math.ceil(this.props.numberOfObjects / this.props.numberPerPage);
  },
  firstPage: function firstPage() {
    this.props.paginationCallback({ currentPage: 1 });
  },
  lastPage: function lastPage() {
    this.props.paginationCallback({ currentPage: this.numberOfPages() });
  },
  nextPage: function nextPage() {
    if (this.props.currentPage < this.numberOfPages()) {
      this.props.paginationCallback({ currentPage: this.props.currentPage + 1 });
    }
  },
  prevPage: function prevPage() {
    if (this.props.currentPage > 1) {
      this.props.paginationCallback({ currentPage: this.props.currentPage - 1 });
    }
  },
  render: function render() {
    var options = this.props.numberPerPageOptions.map((function (opt) {
      return React.createElement(
        'option',
        { key: opt, value: opt },
        opt
      );
    }).bind(this));
    var numberOfPages = this.numberOfPages();
    var pageStart = (this.props.currentPage - 1) * this.props.numberPerPage + 1;
    var pageEnd = this.props.currentPage === numberOfPages ? this.props.numberOfObjects : this.props.currentPage * this.props.numberPerPage;
    var prevDisabled = this.props.currentPage <= 1 ? 'disabled' : '';
    var prevStyle = this.props.currentPage <= 1 ? {} : { cursor: 'pointer' };
    var nextDisabled = this.props.currentPage === numberOfPages ? 'disabled' : '';
    var nextStyle = this.props.currentPage === numberOfPages ? {} : { cursor: 'pointer' };
    var firstButton = undefined;
    var lastButton = undefined;
    if (this.props.enableFirstLast) {
      firstButton = React.createElement(
        'li',
        { className: prevDisabled },
        React.createElement(
          'a',
          { style: prevStyle, onClick: this.firstPage },
          React.createElement('i', { className: 'fa fa-angle-double-left' }),
          React.createElement('i', { className: 'fa fa-angle-double-left' }),
          ' First'
        )
      );
      lastButton = React.createElement(
        'li',
        { className: nextDisabled },
        React.createElement(
          'a',
          { style: nextStyle, onClick: this.lastPage },
          'Last ',
          React.createElement('i', { className: 'fa fa-angle-double-right' }),
          React.createElement('i', { className: 'fa fa-angle-double-right' })
        )
      );
    }

    return React.createElement(
      'div',
      { className: 'table_footer' },
      React.createElement(
        'div',
        { className: 'display_number_entries col-sm-3 col-md-3' },
        React.createElement(
          'div',
          { className: 'display_number_entries_text' },
          'Display:'
        ),
        React.createElement(
          'div',
          { className: 'display_number_entries_select' },
          React.createElement(
            'select',
            { className: 'form-control input-sm col-xs-2', onChange: this.changePagination },
            options
          )
        ),
        React.createElement(
          'div',
          { className: 'display_number_entries_text' },
          this.props.objectName
        )
      ),
      React.createElement(
        'div',
        { className: 'counts col-sm-6 col-md-6' },
        React.createElement(
          'span',
          null,
          'Showing ',
          pageStart,
          ' to ',
          pageEnd,
          ' of ',
          this.props.numberOfObjects,
          ' ',
          this.props.objectName
        )
      ),
      React.createElement(
        'div',
        { className: 'pager_container col-sm-3 col-md-3' },
        React.createElement(
          'ul',
          { className: 'pager' },
          firstButton,
          React.createElement(
            'li',
            { className: prevDisabled },
            React.createElement(
              'a',
              { style: prevStyle, onClick: this.prevPage },
              React.createElement('i', { className: 'fa fa-angle-double-left' }),
              ' Previous'
            )
          ),
          React.createElement(
            'li',
            { className: nextDisabled },
            React.createElement(
              'a',
              { style: nextStyle, onClick: this.nextPage },
              'Next ',
              React.createElement('i', { className: 'fa fa-angle-double-right' })
            )
          ),
          lastButton
        )
      )
    );
  }
});

// last step add the react component to the mix
ns.BETable = BETable;
ns.Header = Header;
ns.Row = Row;
ns.Cell = Cell;
ns.SearchFilter = SearchFilter;

try {
  module.exports = {
    BETable: BETable,
    Header: Header,
    Row: Row,
    Cell: Cell,
    SearchFilter: SearchFilter
  };
} catch (e) {}
})();