// convert array row,column to blockIndex,cellIndex
function xy2bici(x, y) {
    let [bx, by] = [~~(x / 3), ~~(y / 3)];
    let [cx, cy] = [x % 3, y % 3];
    // return [xy2i(by, bx, 3), xy2i(cy, cx, 3)];
    return [by + 3 * bx, cy + 3 * cx];
}

// convert blockIndex,cellIndex to array row,column
function bici2xy(bi, ci) {
    let [bx, by] = i2xy(bi, 3);
    let [cx, cy] = i2xy(ci, 3);
    return [xy2i(bx, cx, 3), xy2i(by, cy, 3)];
}

// convert array index to array row,col
function i2xy(i, xMax = 9) {
    return [~~(i / xMax), i % xMax];
}

// convert array row,col to array index
function xy2i(x, y, xMax = 9) {
    return x * xMax + y;
}

function chunk(arr, size) {
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size)
    )
};

const array_chunks = (array, chunk_size) => Array(Math.ceil(array.length / chunk_size))
    .fill().map((_, index) => index * chunk_size)
    .map(begin => array.slice(begin, begin + chunk_size));

function switchContainer(name) {
    $(".container").hide();
    $(`.container.${name}Container`).show();
}