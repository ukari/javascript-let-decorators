let logs = [];
let slient = f => x => {
  try {
    return f(x);
  } catch (e) {
    logs.push(String(e));
    return x;
  }
};

// utils
let check = type => x => {
  if (!(Object(x) instanceof type)) {
    throw "unmatch type exception: " + JSON.stringify(x) + " is " + type.name;
  }
  return x;
};

let to = type => x => {
  return type(x);
};

let required = x => {
  if (x === undefined) {
    throw "forget use it";
  }
  return x;
};

let RuntimeType = schema => x => {
  let res = {};
  let object = (s, o, r) => Object.keys(s).map(key => {
    if (s[key] instanceof Object && !(s[key] instanceof Function)) {
      if (r[key] === undefined) {
        r[key] = {};
      }
      object(s[key], o[key], r[key]);
    } else {
      r[key] = s[key](o[key]);
    }
  });
  object(schema, x, res);
  return res;
};

// for library author
let library = {
  api: () => ({ a: '1', b: 1.1, neast: {c: '2'}, forget: "here" }),
  schema: {
    a: slient(check(Number)),
    b: to(String),
    neast: {
      c: slient(check(Number))
    },
    forget: slient(required)
  }
};

// for library user
@RuntimeType(library.schema)
let {a, b, neast: {c}} = library.api();

console.log({a, b, neast: {c}});
logs.map(x => console.log(x));
