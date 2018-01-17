console.log(`------------------------------------------------------------------
copy dist/Module.js and run it in browser for colorful log support
------------------------------------------------------------------
`)
let Module = f => () => {
  let x = {};
  let props = new Map();
  let exports = new Proxy(v => {
    if (!v.name) {
      throw "can't export function without a name";
    }
    return x[v.name] = v;
  }, {
    set: (x, k, v) => {
      props.set(k, x);
      x[k] = v;
      return true;
    }
  });
  f(exports);
  return new Proxy({...x, ...exports}, {
    set: (x, k, v) => {
      if (props.has(k)) {
        props.get(k)[k] = v;
      } else {
        x[k] = v;
      }
      return true;
    }, get: (x, k) => {
      if (props.has(k)) {
        return props.get(k)[k];
      } else {
        return x[k];
      }
    }});
};

let Init = (...args) => m => {
  m["init"](...args);
  return m;
};

@Module
let Person = function (exports) {
  let self = {
    name: null,
    age: null,
  };

  exports.hp = 100;

  @exports
  let init = ({age, name}) => {
    self.age = age;
    self.name = name;
  };

  @exports
  let eat = (food) => {
    console.log(`${self.name} eats a ${food}`);
  };

  @exports
  let introduce = () => {
    console.log(`my name is ${self.name}, ${self.age} years old`)
  };

  @exports
  let attacked = (damage) => {
    let oldhp = exports.hp;
    console.log(`${self.name} get %c${damage}%c damage`, "color: red", "color:black");
    if ((exports.hp -= damage) > 0) {
      console.log(`${self.name}'s hp %c${oldhp}%c/100 --> %c${exports.hp}%c/100`, "color: green", "color:black", "color: green", "color:black");
    } else {
      console.log(`${self.name}'s hp %c${oldhp}%c/100 --> %c0`, "color: green", "color:black", "color: red");
      console.log(`${self.name} is %cdie`, "color: red");
    }

  };
};

@Init({name: "Aurore", age: 12})
let person = Person();

console.log(person);
person.introduce();
person.eat("bad apple");
person.attacked(15);
person.attacked(15);
person.hp -= 50;
console.log("enforced lose %c50%c hp, now hp %c" + person.hp + "%c/100", "color: purple", "color:black", "color: purple", "color:black");
person.attacked(25);
