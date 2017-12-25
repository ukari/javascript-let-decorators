let Async = f => p => p.then(r => f(r), j => j);

let inc = v => v + 1;
let log = v => (console.log(v), v);
(async () => {
  @Async(log)
  @Async(inc)
  let a = new Promise((re, rj) => setTimeout(() => re(1), 1000));
})();
