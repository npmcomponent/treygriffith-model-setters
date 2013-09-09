
var each = require('each')
  , type = require('type');


/**
 * Plugin.
 *
 * @param {Function|Object} values  The setter values dictionary or the Model.
 */

module.exports = function (values) {
  if ('object' === type(values)) {
    return function (Model) {
      bind(Model, values);
    };
  } else {
    return bind(values);
  }
};




/**
 * Bind to the model's construct event.
 *
 * @param {Function} Model  The model constructor.
 */

function bind (Model, dict) {
  dict || (dict = {});
  setters = dict.setters || {};
  getters = dict.getters || {};

  var attr = Model.attr;

  Model.attr = function (name, options) {

    attr.apply(Model, arguments);

    var set = Model.prototype[name]
      , get = set
      , setter = options.set || setters[name]
      , getter = options.get || getters[name];

    Model.prototype[name] = function (val) {

      if(0 == arguments.length) {

        if(type(getter) === 'function') return getter.apply(this, get.call(this));

        return get.call(this);
      }

      if(type(setter) === 'function') val = setter.apply(this, arguments);

      set.call(this, val);

    };
  };
}