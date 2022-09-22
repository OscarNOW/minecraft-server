module.exports = Object.freeze({
    getAllIndexes: (str, val) => {
        let indexes = [];
        let i = 0;

        while (i != -1) {
            i = str.indexOf(val, i + 1)

            if (i != -1)
                indexes.push(i);
        }

        return indexes;
    }
})