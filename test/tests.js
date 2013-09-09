describe('model-setters', function () {

  var setters = require('model-setters')
    , assert = require('component-assert')
    , model = require('segmentio-model')
    , type = require('component-type');


  it('should send all set operations through the setter', function () {

    var Order = model('order')
      .use(setters)
      .attr('amount', { set: function (amt) {
        return parseInt(amt, 10);
      }});

    var order = new Order();

    order.amount('$50');

    assert(50 === order.amount());
  });

  it('should send all get operations through the getter', function () {

    var Ninja = model('ninja')
      .use(setters)
      .attr('battleCry', { get: function (cry) { return cry ? cry.toUpperCase() : cry; }});

    var ninja = new Ninja();

    ninja.battleCry("whoop");

    assert("WHOOP", ninja.battleCry());
  });

  it('should accept all defaults up front', function () {
    var Ninja = model('ninja')
      .use(setters({
        visibility : {
          set: function (pct) {
            return parseInt(pct, 10) / 100;
          },
          get: function (dec) {
            return (dec * 100).toFixed(2) + '%';
          }
        },
        belt : {
          get: function (belt) {
            return 'ninja ' + belt;
          }
        }
      }))
      .attr('weapons')
      .attr('belt');

    var ninja = new Ninja();
    ninja.visibility('50%');
    assert(ninja.attrs.visibility === 0.5);
    assert(ninja.visibility() === '50%');

    ninja.belt('black');
    assert(ninja.belt() === 'ninja black');
  });

  it('should call setters and getters in the context of the model', function () {

    var Dog = model('dog')
      .use(setters)
      .attr('age', { set: function (age) { return parseInt(age, 10); } })
      .attr('bark', { get: function (bark) {
        if(this.age() < 2) return bark.toUpperCase();
        return bark;
      } });

    var spot = new Dog({ bark: 'woof' });

    spot.age('1');

    assert(spot.bark() === 'WOOF');

    var sparky = new Dog({ bark: 'ruff', age: 7 });

    assert(sparky.bark() === 'ruff');
  });

});


describe('model-defaults', function () {
  var defaults = require('model-defaults')
    , assert = require('component-assert')
    , model = require('segmentio-model')
    , type = require('component-type');

  it('should work for values that are falsey', function(){
    var Ninja = model('Ninja')
      .use(defaults)
      .attr('weapons', { default: 0 });

    assert(0 == new Ninja().weapons());
  })

  it('should accept all defaults up front', function () {
    var Ninja = model('ninja')
      .use(defaults({
        weapons : 7,
        belt : 'black'
      }))
      .attr('weapons')
      .attr('belt');

    var ninja = new Ninja();
    assert(7 === ninja.weapons());
    assert('black' === ninja.belt());
  });

  it('should accept individual defaults', function () {
    var Pirate = model('pirate')
      .use(defaults)
      .attr('name', { default: 'Hook' })
      .attr('legs', { default: 1 });

    var pirate = new Pirate();
    assert('Hook' === pirate.name());
    assert(1 === pirate.legs());
  });

  it('should call functions', function () {
    var Person = model('person')
      .use(defaults)
      .attr('age', { default: function () { return 42; } });

    var person = new Person();
    assert(42 === person.age());
  });

  it('should call functions in the context of the model', function() {

    var Person = model('person')
      .use(defaults)
      .attr('age', { default: 42 })
      .attr('wrinkles', { default: function () { return this.age() * 2; }})

    var person = new Person();

    assert(84 === person.wrinkles());
  });

  it('should clone objects and arrays', function () {
    var array = [];
    var object = {};
    var Thing = model('thing')
      .use(defaults)
      .attr('array', { default: array })
      .attr('object', { default: object });

    var thing = new Thing();
    assert('object' === type(thing.object()));
    assert(object !== thing.object());
    assert('array' === type(thing.array()));
    assert(array !== thing.array());
  });

  it('should not clone objects returned from functions', function () {
    var obj = {};
    var Thing = model('thing')
      .use(defaults)
      .attr('custom', { default: function() {
        return obj;
      }});

    var thing = new Thing();
    assert('object' === type(thing.custom()));
    assert(obj === thing.custom());
  });
});
