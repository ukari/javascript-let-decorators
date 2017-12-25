# Decorators for ES6 let

## Summary
Nowadays, we have the proposal which enable decorators on Class and Object, but it don't support on Function due to the probably difficult when implement this feature, especially for the exist of function declaration hoisting.

The let variable declaration doesn't have a declaration hoisting, and it could bind a reference to a identifier. If enable to use decorators on let, it means decorators would works on everything which could be bind to a identifier.

The let decorators not works on the left expression in a let statement, it works on the right identifier in the way of rebind it.

## Examples

### simple let decorator
``` javascript
@inc
let a = 1;

function inc(value) {
  return value + 1;
}
```

### custom let decorator
``` javascript
@incn(10)
let a = 1;

function incn(step) {
  return function (value) {
    return value + step;
  }
}
```

### works with Promise
``` javascript
let Async = f => p => p.then(r => f(r), j => j);

let inc = v => v + 1;
let log = v => (console.log(v), v);
(async () => {
  @Async(log)
  @Async(inc)
  let a = new Promise((re, rj) => setTimeout(() => re(1), 1000));
})();

```
Due to it's behavior of not working on the right expression instead of working on the left identifier, let decorators could easily be comfortable with the other stuffs.

And easily to understand it's usage.

### works with JSX
``` jsx
let store = {};

@connect(store)
let a = store => () => (
  <button onClick={() => store.i += 1}>
    + {store.i}
  </button>
)

function connect(store) {
  return function (comp) {
    // blablabla, magic...
    return (props) => comp(new Proxy(store, someMagicConfig))(props);
  }
}

```

with the help of connect function, the variable a will be turns into a functional stateful react component.


## Syntax

### from
```
[@decorator1]
[@decorator2]
[... @decoratorM]
let var1 [= value1] [, var2 [= value2]] [, ..., varN [= valueN]];

```

### to
```
let var1 [= value1] [, var2 [= value2]] [, ..., varN [= valueN]];
[[var1 = decoratorM(var1); ...]
[var1 = decorator2(var1);]
[var1 = decorator1(var1);]]
[[var2 = decoratorM(var2); ...]
[var2 = decorator2(var2);]
[var2 = decorator1(var2);]]
[... [varN = decoratorM(varN); ...]
[varN = decorator2(varN);]
[varN = decorator1(varN);]]
```

### Run examples
I provides some babel plugins and a fork babylon to help preview and experience this syntax, the config could be find in package.json and .babelrc. 

#### install dependencies
```
npm install
```

#### compile by babel
```
npm run example
```

#### view and run example
```
cat examples/xxx-example.js
cat dist/xxx-example.js
node dist/xxx-example.js
```

The babylon I forked is a pre-release version so it couldn't works well with the latest babel version v6.24.0 when some other plugins needed like transform-object-rest-spread, so I don't recommand to use the preview plugins and the forked babylon in production.
