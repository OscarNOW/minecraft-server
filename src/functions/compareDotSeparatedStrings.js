const separator = '.';

function compareDotSeparatedStrings(a, b) {
    a = a.split(separator).map(c => parseInt(c));
    b = b.split(separator).map(c => parseInt(c));

    for (let i = 0; i < a.length; i++) {
        if (a[i] > b[i]) return 1;
        if (a[i] < b[i]) return -1;
    };

    return 0;
};

module.exports = Object.freeze({ compareDotSeparatedStrings });