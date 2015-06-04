/*jshint esnext: true */
function getNamespace() {
  /**
   * Recursively define a nested object on ``window`` without destroying if it exists
   *
   * e.g.:
   *   getNamespace('BE', 'utils', 'formatting') === window.BE.utils.formatting
   *   // keeps existing objects intact if extant, otherwise creates empty objects
   */
  let o = window;
  for (let i in arguments) {
    let k = arguments[i];
    o[k] = o[k] || {};
    o = o[k];
  }
  return o;
}

function getOrCall(x, ...params) {
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

  function classNames () {

    let classes = '';

    for (let i = 0; i < arguments.length; i++) {
      let arg = arguments[i];
      if (!arg) continue;

      let argType = typeof arg;

      if ('string' === argType || 'number' === argType) {
        classes += ' ' + arg;

      } else if (Array.isArray(arg)) {
        classes += ' ' + classNames.apply(null, arg);

      } else if ('object' === argType) {
        for (let key in arg) {
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

}());
