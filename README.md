*This repository is a mirror of the [component](http://component.io) module [treygriffith/model-setters](http://github.com/treygriffith/model-setters). It has been modified to work with NPM+Browserify. You can install it using the command `npm install npmcomponent/treygriffith-model-setters`. Please do not open issues or send pull requests against this repo. If you have issues with this repo, report it to [npmcomponent](https://github.com/airportyh/npmcomponent).*
# model-setters

  Lets a model specify custom getters and setters for attributes.

## Installation

    $ component install treygriffith/model-setters

## API

```js
var setters = require('model-setters')
  , model = require('model');

// all specified up front
var person = model('person')
  .use(setters({
    name: {
      get: function (name) {
        return name.toUpperCase();
      },
      set: function (name) {
        return name.toLowerCase();
      }
    },
    age: {
      set: function (age) {
        return parseInt(age, 10);
      }
    } 
  }))
  .attr('name')
  .attr('age');

// or specified individually
var person = model
  .use(setters)
  .attr('name', {
    get: function (name) { return name.toUpperCase(); }
    set: function (name) { return name.toLowerCase(); }
  })
  .attr('age', { set: function (age) { return parseInt(age, 10); } });
```

## License

  MIT
