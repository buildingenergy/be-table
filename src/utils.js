
function getNamespace() {
  /**
   * Recursively define a nested object on ``window`` without destroying if it exists
   *
   * e.g.:
   *   getNamespace('BE', 'utils', 'formatting') === window.BE.utils.formatting
   *   // keeps existing objects intact if extant, otherwise creates empty objects
   */
  var o = window;
  for (var k of arguments) {
    o[k] = o[k] || {};
    o = o[k];
  }
  return o;
}
