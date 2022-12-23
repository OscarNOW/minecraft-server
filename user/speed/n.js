const createLazy = require('./createLazy.js');

class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    get description() {
        return `${this.name} is ${this.age} years old`;
    }

    set description(value) {
        console.log('Cannot set to', value)
    }

    growUp() {
        this.age++;
    }

    static getNewName(oldName) {
        return oldName + ' the Great';
    }
};

const LazyPerson = createLazy(() => {
    console.log('loading class')
    return Person;
}, 'Person');

console.log(LazyPerson)