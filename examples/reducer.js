let store = {data: {i: 0}};

@reducer(x => x + 1)
let action = {state: store, getter: ['data', 'i']};

action();
console.log(store);
action();
console.log(store);

function reducer (f) {
    return function ({state, getter}) {
        return function() {
            let {prev, key} = getter.reduce((acc, cur) => ({prev: acc.x, x: acc.x[cur], key: cur}), {x: state});
            prev[key] = f(prev[key]);
            return state;
        }
    }
}
