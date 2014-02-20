
var each = require('component-each')
  , type = require('component-type');


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

  var attr = Model.attr;

  Model.attr = function (name, options) {

    options = options || {};
    var globals = dict[name] || {};

    attr.apply(Model, arguments);

    var set = Model.prototype[name]
      , get = set
      , setter = options.set || globals.set
      , getter = options.get || globals.get

    Model.prototype[name] = function (val) {

      if(0 == arguments.length) {

        if(type(getter) === 'function') return getter.call(this, get.call(this));

        return get.call(this);
      }

      if(type(setter) === 'function') val = setter.apply(this, arguments);

      set.call(this, val);

    };

    return this;
  };
}