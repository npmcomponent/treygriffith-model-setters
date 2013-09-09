
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

  Model.on('construct', function (model, attrs) {
    each(Model.attrs, function (key, options) {

      var set, get, setter, getter;

      setter = options.set || setters[key];
      getter = options.get || getters[key];

      get = set = model.prototype[key];

      model.prototype[key] = function (val) {

        if(0 == arguments.length) {

          if(type(getter) === 'function') return getter.apply(model, get.call(model));

          return get.call(model);
        }

        if(type(setter) === 'function') val = setter.apply(model, arguments);

        set.call(model, val);
      };
    });
  });
}