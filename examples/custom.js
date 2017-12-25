let logger = x => (console.log(x), x);

@logger
@incn(10)
@logger
let a = 1;

function incn(step) {
    return function(x) {
        return x + step;
    }
}

