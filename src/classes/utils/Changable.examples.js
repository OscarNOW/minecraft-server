module.exports = {
    constructor: [
        {
            code: `
function onChange(value) {
    console.log('onChange called', value)
}

const changable = new Changable(onChange, { a: 1, b: 2 });

changable.a = 5; // onChange called { a: 5, b: 2 }

changable.b = 7; // onChange called { a: 5, b: 7 }

console.log(changable.a); // 5

`
        }
    ],
    methods: {
        setRaw: [
            {
                code: `
function onChange(value) {
    console.log('onChange called', value)
}
                
const changable = new Changable(onChange, { a: 1, b: 2 });

changable.setRaw({ a: 5, b: 7 }); // onChange not called

console.log(changable.a); // 5

changable.setRaw('b', 2); //onChange not called

console.log(changable.b); // 2

`
            }
        ]
    }
}