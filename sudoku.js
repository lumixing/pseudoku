// initialize board as 9x9 array
let board;
let available;

// generates new board
function generateBoard() {
    try {
        board = Array.from({ length: 9 }, _ => Array.from({ length: 9 }, _ => 0));
        available = Array.from({ length: 81 }, _ => Array.from({ length: 9 }, (_, i) => i + 1));

        fillBlock(0);
        fillBlock(4);
        fillBlock(8);
        fillRemaining();
        removeRandom(81 - 50);
        printBoard();
    } catch (err) {
        console.error(err, "retrying!");
        generateBoard()
    }
}

function generate() {
    return new Promise(resolve => {
        try {
            board = Array.from({ length: 9 }, _ => Array.from({ length: 9 }, _ => 0));
            available = Array.from({ length: 81 }, _ => Array.from({ length: 9 }, (_, i) => i + 1));

            fillBlock(0);
            fillBlock(4);
            fillBlock(8);
            fillRemaining();
            removeRandom(81 - 50);
            printBoard();
            resolve();
        } catch (err) {
            console.error(err, "retrying!");
            generate()
        }
    });
}

// fill cells in block with random numbers
function fillBlock(bi) {
    let values = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort((a, b) => 0.5 - Math.random());
    for (let ci = 0; ci < 9; ci++) {
        let [x, y] = bici2xy(bi, ci);
        board[x][y] = values.shift();
    }
}

// recursing function which fills empty cells with random numbers
function fillRemaining() {
    // loop through cells
    for (let i = 0; i < 81; i++) {
        let [x, y] = i2xy(i);
        if (board[x][y] !== 0) continue;

        // loop through numbers 1-9
        for (let n = 1; n < 10; n++) {
            // if number is not available then go to next number
            if (!available[i].includes(n)) continue;

            // if number can be valid then place it and go to next cell
            if (validateCell(x, y, n)) {
                board[x][y] = n;
                break;
            }

        }

        // if cell ran out of numbers then backtrack to previous cell
        if (board[x][y] === 0) {
            // previous cell
            let [pX, pY] = i2xy(i - 1);
            let pValue = board[pX][pY];
            board[pX][pY] = 0;
            available[i - 1].splice(available[i - 1].indexOf(pValue), 1);
            available[i] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            fillRemaining();
        }
    }
}

function removeRandom(n) {
    for (let j = 0; j < n; j++) {
        let i = ~~(Math.random() * 81);

        if (board.flat()[i] === 0) {
            j--;
            continue;
        }

        let [x, y] = i2xy(i);
        board[x][y] = 0;
    }
}

// print board to console
function printBoard() {
    let str = "";

    for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
            str += board[x][y] + " ";
        }
        str += "\n";
    }

    console.log(str);
}

// validates cell using sudoku rules
function validateCell(x, y, n) {
    // validate row
    if (board[x].includes(n)) return false;

    // validate column
    if (board.map(i => i[y]).includes(n)) return false;

    // validate block
    let [bi] = xy2bici(x, y);
    let blockValues = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(ci => {
        let [x_, y_] = bici2xy(bi, ci);
        return board[x_][y_];
    });

    if (blockValues.includes(n)) return false;

    return true;
}