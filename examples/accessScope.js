@(x => (console.log(a), x))
let a = 1;

console.log(`
it could access the identifier scope,
because it actually a sugar to rebind the identifier
after the identifier's first assignment
`)
