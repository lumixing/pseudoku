console.log("ready!");

switchContainer("game");

$("#new").click(async () => {
    await generate();
    updateBoard();
    exportBoard();
});

$("#css").click(() => switchContainer("css"));

$("#cssstyle").text($("#code").val());
$("#code").on("input", (e) => {
    $("#cssstyle").text($("#code").val());
});

let selectedCell = -1;

// init board
for (let bi = 0; bi < 9; bi++) {
    for (let ci = 0; ci < 9; ci++) {
        let [x, y] = bici2xy(bi, ci);
        let i = xy2i(x, y);

        $(`.block[data-bi="${bi}"]`).append(`<div class="cell" data-ci="${ci}" data-x="${x}" data-y="${y}" data-i="${i}">0</div>`)
    }
}

let savedBoard = localStorage.getItem("board");
savedBoard ? importBoard(savedBoard) : generateBoard();

updateBoard();
exportBoard();

$(".cell").click(({ target }) => {
    let { i, x, y, ci } = $(target).data();
    let { bi } = $(target).parent().data();

    console.log(`clicked cell [${i}] (${x},${y}) {${bi},${ci}}`);
    selectedCell = i;

    // clear previous highlights
    $(".cell.highlight").removeClass("highlight");

    // highlight block
    $(target).parent().children().addClass("highlight");

    // highlight row
    for (let _y = 0; _y < 9; _y++) {
        $(`.cell[data-x="${x}"][data-y="${_y}"]`).addClass("highlight");
    }

    // highlight column
    for (let _x = 0; _x < 9; _x++) {
        $(`.cell[data-x="${_x}"][data-y="${y}"]`).addClass("highlight");
    }

    // highlight same values
    if ($(target).text()) {
        $(`.cell:contains(${$(target).text()})`).addClass("highlight");
    }
});

$("body").keypress(({ originalEvent }) => {
    let key = parseInt(originalEvent.key);
    if (!key || selectedCell === -1) return;

    let [x, y] = i2xy(selectedCell);
    board[x][y] = key;
    $(`.cell[data-i=${selectedCell}]`).text(key);
    exportBoard();
    updateBoard();
});

function importBoard(str) {
    board = array_chunks(str.split("").map(Number), 9);
    console.log("imported board", printBoard());
}

function exportBoard() {
    localStorage.setItem("board", board.flat().join(""));
    console.log("exported board", board.flat().join(""));
}

function updateBoard() {
    // board
    for (let i = 0; i < 81; i++) {
        $(`.cell[data-i="${i}"]`).text(board.flat()[i] == 0 ? "" : board.flat()[i]);
    }

    // left side (x)
    for (let x = 0; x < 9; x++) {
        $(`.side[data-x="${x}"]`).text([1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !board[x].includes(n)).join(""));
    }

    // top side (y)
    for (let y = 0; y < 9; y++) {
        $(`.side[data-y="${y}"]`).text([1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !board.map(i => i[y]).includes(n)).join("\n"));
    }
}