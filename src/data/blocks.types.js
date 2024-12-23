const { convertToType } = require('../functions/convertToType.js');
const { blocks } = require('../functions/loader/data.js');

function categorizeBlocks(blocks) {
    const blockStateCategories = [];
    let noBlockStateCategory = null;

    for (const block of blocks) {
        const [blockName, , blockState] = block;

        if (!blockState) {
            // Handle blocks without a blockState
            if (!noBlockStateCategory)
                noBlockStateCategory = {
                    blockState: null,
                    blockNames: []
                };
            noBlockStateCategory.blockNames.push(blockName);
            continue;
        }

        // Check if the blockState already exists in blockStateCategories
        let matchedCategory = null;

        for (const category of blockStateCategories) {
            if (blockStatesTypeEqual(category.blockState, blockState)) {
                matchedCategory = category;
                break;
            }
        }

        if (matchedCategory) {
            // Add the blockName to the matching category
            matchedCategory.blockNames.push(blockName);
        } else {
            // Create a new category
            blockStateCategories.push({
                blockState,
                blockNames: [blockName]
            });
        }
    }

    return [noBlockStateCategory, ...blockStateCategories];
}

function blockStatesTypeEqual(a, b) {
    if (!a && !b)
        return true;

    if (!a || !b)
        return false;

    if (a.length !== b.length)
        return false;

    // Create a Map to store blockStates for fast lookup
    const createBlockStateMap = blockStates => {
        const map = new Map();
        for (const { name, values } of blockStates) {
            map.set(name, new Set(values));
        }
        return map;
    };

    const mapA = createBlockStateMap(a);
    const mapB = createBlockStateMap(b);

    // Compare maps
    if (mapA.size !== mapB.size)
        return false;

    for (const [name, valuesA] of mapA) {
        const valuesB = mapB.get(name);
        if (!valuesB || valuesA.size !== valuesB.size)
            return false;

        // Compare values in sets
        for (const value of valuesA) {
            if (!valuesB.has(value))
                return false;
        }
    }

    return true;
}

const blockStateCategories = categorizeBlocks(blocks);
let type = 'type blockState<a extends blockName>=';

// we can not include the ones without a blockState, because they will fallback to the never
for (const { blockState, blockNames } of
    blockStateCategories
        .filter(({ blockState }) => blockState)
) {
    type += `a extends ${convertToType(blockNames)}?`
    if (blockState) {
        type += '{';
        for (const i in blockState) {
            const { name, values } = blockState[i];
            type += `${name}:${convertToType(values)};`;
        }
        type += '}';
    } else
        type += 'never';

    type += ':';
}
type += 'never;';

module.exports = {
    blockName: convertToType(blocks.map(a => a[0])),
    _: type
}