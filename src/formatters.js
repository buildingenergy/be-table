/* jshint ignore:start */

var formatters = {};
getNamespace('BE', 'Table').formatters = formatters;

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
