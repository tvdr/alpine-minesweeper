function ms() {
    return {
        play: false,
        cols: 10,
        rows: 10,
        flags: 0,
        mines: 10,
        win:false,
        board: [],
        shown: [],
        flagged: [],
        minesindices: [],
        busted: false,
        doplay: function () {
            this.play = true;
            this.flags = this.mines;

            this.cols -= 1;
            this.rows -= 1;
            while (this.minesindices.length < this.mines) {
                var r = Math.floor(Math.random() * ((this.cols + 1) * (this.rows + 1)));
                if (this.minesindices.indexOf(r) === -1) this.minesindices.push(r);
            }


            for (r = 0; r <= this.rows; r++) {
                this.board[r] = [];
                this.shown[r] = [];
                this.flagged[r] = [];
                for (c = 0; c <= this.cols; c++) {

                    let currentindex = r * (this.rows + 1) + c;
                    this.shown[r][c] = 0;
                    this.flagged[r][c] = 0;
                    if (this.minesindices.indexOf(currentindex) !== -1) {
                        this.board[r][c] = -1;
                    } else {
                        this.board[r][c] = 0;
                    }
                }

            }

            for (r = 0; r <= this.rows; r++) {
                for (c = 0; c <= this.cols; c++) {
                    if (this.board[r][c] == -1) {
                        this.incrementNeighbours(r, c);
                    }
                }

            }




        },
        restart: function () {
            this.play = false;
            this.busted = false;
            this.board = [];
            this.shown = [];
            this.minesindices = [];
            this.flagged = [];
            this.cols += 1;
            this.rows += 1;
            this.flags = 0;
            this.win = false;
        },

        init: function () {
            /* while (this.minesindices.length < this.mines) {
                 var r = Math.floor(Math.random() * ((this.cols + 1) * (this.rows + 1)));
                 if (this.minesindices.indexOf(r) === -1) this.minesindices.push(r);
             }

             for (r = 0; r <= this.rows; r++) {
                 this.board[r] = [];
                 this.shown[r] = [];
                 for (c = 0; c <= this.cols; c++) {

                     let currentindex = r * (this.rows + 1) + c;
                     this.shown[r][c] = 0;
                     if (this.minesindices.indexOf(currentindex) !== -1) {
                         this.board[r][c] = -1;
                     } else {
                         this.board[r][c] = 0;
                     }
                 }

             }

             for (r = 0; r <= this.rows; r++) {
                 for (c = 0; c <= this.cols; c++) {
                     if (this.board[r][c] == -1) {
                         this.incrementNeighbours(r, c);
                     }
                 }

             }*/


        },
        incrementNeighbours(r, c) {
            for (x = -1; x <= 1; x++) {
                for (y = -1; y <= 1; y++) {
                    if (typeof this.board[r + x] !== 'undefined' && typeof this.board[r + x][c + y] !== 'undefined') {
                        if (this.board[r + x][c + y] !== -1) {
                            this.board[r + x][c + y] += 1;
                        }
                    }
                }
            }
        },
        isMine: function (row, col) {
            return this.play && this.board[row][col] == -1;
        },
        isEmpty: function (row, col) {
            return this.play && this.board[row][col] == 0;
        },
        isNumber: function (row, col) {
            return this.play && 0 < this.board[row][col];
        },
        isValidField: function (row, col) {
            return (typeof this.board[row] !== 'undefined' && typeof this.board[row][col] !== 'undefined')
        },
        isShown: function (row, col) {
            return this.play && this.shown[row][col] === 1;
        },
        isFlagged: function (row, col) {
            return this.play && this.flagged[row][col] === 1;
        },
        show: function (row, col) {
            if (!this.busted && !this.win) {

                if (this.isFlagged(row, col)) {
                    this.flagged[row][col] = 0;
                    this.flags++;
                }else{
                    this.shown[row][col] = 1;
                    if (this.isEmpty(row, col)) {
                        for (let x = -1; x <= 1; x++) {
                            for (let y = -1; y <= 1; y++) {

                                let rx = row + x;
                                let cy = col + y;

                                if (this.isValidField(rx, cy) && !this.isShown(rx, cy) && this.isEmpty(rx, cy)) {

                                    this.show(rx, cy);
                                }
                            }
                        }
                    } else if (this.isMine(row, col)) {
                        this.busted = true;
                    }
                }

            }


        },
        flag: function (row, col) {
            if (!this.busted && !this.win  && this.flags > 0) {
                if (!this.isShown(row, col)) {
                    this.flagged[row][col] = 1;
                    this.flags--;
                }

            }

            if (this.flags == 0) {
                let winbyflags = true;
                for (r = 0; r <= this.rows; r++) {
                    for (c = 0; c <= this.cols; c++) {
                        if (this.isMine(row,col) && !this.isFlagged(row,col)){
                            winbyflags = false;
                        }
                    }
                }

                this.win = winbyflags;


            }
        },
        getText(row, col) {
            if (this.isFlagged(row, col)) {
                return '<i class="far fa-flag"></i>';
            } else if (this.isShown(row, col)) {
                if (this.isEmpty(row, col)) {
                    return '&nbsp;'
                } else if (this.isNumber(row, col)) {
                    return this.board[row][col];
                } else if (this.isMine(row, col)) {
                    return '<i class="fas fa-bomb"></i>'
                }

            } else {
                return '&nbsp;'
            }
        }
    }
}