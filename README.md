# Decorators for let

## Summary
Nowadays, we have the proposal which enable decorators on Class and Object, but it don't support on Function due to the probably difficult when implement this feature, especially for the exist of function declaration hoisting.

The let variable declaration doesn't have a declaration hoisting, and it could bind a reference to a identifier. If enable to use decorators on let, it means decorators would works on everything which could be bind to a identifier.

The let decorators not works on the left expression in a let statement, it works on the right identifier in the way of rebind it.

## Why Let
`let` is the only thing which has actual semantic and implement nearly to the `class`.

Javascript is a language where function hava a first class standing and some people programming in the function way. If we have some good things new for `class`, the same thing for functional way as a replacement should always be include too.

For `let foo = () => {}`, if print the `foo.name` then a "foo" will got. `let foo = () => {}` is the reality that guys programming in functional ways like me must face to because we don't have a non-hoisting function defination syntax. And `let` has been well prepared to play such a role.

If the syntax for [non-hoisting function](https://github.com/wycats/javascript-decorators/issues/4#issuecomment-169285562) like `def` is added into the language, decorators could work to `def` in the same way as `let`.

Works well with commonjs's `require`.

### the same
for example
```
class A {

}
A = 5;
```

```
let A = () => {};
A = 5;
```

- they won't be hoist
- they could be re-assign to another value

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

### works with react router v4
``` jsx
@Path("/article/:path*/:title", {
  exact: true,
  title: ({match: {params: {title}}}) => title,
  onload: ({match: {params: {path, title}}}) => fetchArticle({path, title}),
})
@Connect(store)
let Article = () => (
  <div>
    <div class={title}>{store.title}</div>
    <div class={content}>
      {Loading(Markdown(store.content), store.loading)}
    </div>
  </div>
);
```

## Syntax

### normal

#### from
```
[@decorator1]
[@decorator2]
[... @decoratorM]
let var1 [= value1] [, var2 [= value2]] [, ..., varN [= valueN]];

```

#### to
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

## styles
the syntax transforms the decorator in the `reassign-style` instead of the `wrap-style`.

for example
``` javascript
@foo
let a = 1;
```

### reassign-style
``` javascript
let a = 1;
a = foo(a);
```

### wrap-style
``` javascript
let a = foo(1);
```

#### the reason choosing reassign-style
transform won't happen in `wrap-style` due to the advantage of do it `reassign-style` in some conditions.

##### the condition: get function name
for example
```
let foo = fn => (console.log(fn.name), fn);

@foo
let fun = () => {};
```

- in `reassign-style`, the function `fun`'s name could be accessible.

``` javascript
let fun = ()  => {}
fun = foo(fun)
```



- in `wrap-style`, the function `fun`'s name couldn't be logged.

``` javascript
let fun = foo(()  => {})
```

here is a [example](https://github.com/ukari/javascript-let-decorators/blob/master/examples/Module.js) which needs the feature to get let function's name.


##### the condition: a Non-Independent decorator could be valid in wrap-style while invalid in reassign-style

``` javascript
@boo
@bar
@foo
let {a, b} = {a: 1, b: 2}

```

image that if there are three function foo, bar, boo. When their defination is

``` javascript
function foo(x) {
    return null;
}

function bar(x) {
    return null
}

function boo(x) {
    return {a: 2, b: 3}
}
```

now, @foo, @bar is actually not valid for the ObjectPattern, if things happen in `wrap-style`, it won't be checked, and it means @foo, @bar needs a implicit dependent on the last excute @boo, so they are actually not a independent decorator which could be add or remove alone.

### corner

#### from
```
@f
let a = b = c = 1;
```

#### to
```
let a = 1;
a = f(a);
b = a;
c = a;
```

## Run examples
I provides some babel plugins and a fork babylon to help preview and experience this syntax, the config could be find in package.json and .babelrc. 

### install dependencies
```
npm install
```

### compile by babel
```
npm run example
```

### view and run example
```
cat examples/xxx-example.js
cat dist/xxx-example.js
node dist/xxx-example.js
```
