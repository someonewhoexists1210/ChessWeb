let Images, currentBoard, promotion;
function imageLoad() {
    Images = new Map([
        ['WHITE_PAWN', 'imgs\\wpawn.png'],
        ['WHITE_KNIGHT', 'imgs\\wknight.png'],
        ['WHITE_BISHOP', 'imgs\\wbishop.png'],
        ['WHITE_ROOK', 'imgs\\wrook.png'],
        ['WHITE_QUEEN', 'imgs\\wqueen.png'],
        ['WHITE_KING', 'imgs\\wking.png'],
        ['BLACK_PAWN', 'imgs\\blpawn.png'],
        ['BLACK_KNIGHT', 'imgs\\blknight.png'],
        ['BLACK_BISHOP', 'imgs\\blbishop.png'],
        ['BLACK_ROOK', 'imgs\\blrook.png'],
        ['BLACK_QUEEN', "imgs\\blqueen.png"],
        ['BLACK_KING', 'imgs\\blking.png']
    ]);
    let imageCounter = 0;
    Images.forEach(function (value, key) {
    let image = new Image();
    image.src = value;
    image.onload = function () {
        Images.set(key, image);
        imageCounter++;
        if (imageCounter == Images.size) {
            console.log('Images loaded');
            Images = new Map([
                ['Pawn', [Images.get('WHITE_PAWN'), Images.get('BLACK_PAWN')]],
                ['Bishop', [Images.get('WHITE_BISHOP'), Images.get('BLACK_BISHOP')]],
                ['Knight', [Images.get('WHITE_KNIGHT'), Images.get('BLACK_KNIGHT')]],
                ['Rook', [Images.get('WHITE_ROOK'), Images.get('BLACK_ROOK')]],
                ['Queen', [Images.get('WHITE_QUEEN'), Images.get('BLACK_QUEEN')]],
                ['King', [Images.get('WHITE_KING'), Images.get('BLACK_KING')]],
            ]);
        }
    }

})
};

const charcode = (l) => l.charCodeAt(0) - 96 ;
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

const boardpos = new Map([
    ['a1', [0, 525]], 
    ['a2', [0, 450]],
    ['a3', [0, 375]],
    ['a4', [0, 300]],
    ['a5', [0, 225]],
    ['a6', [0, 150]],
    ['a7', [0, 75]],
    ['a8', [0, 0]],
    ['b1', [75, 525]],
    ['b2', [75, 450]],
    ['b3', [75, 375]],
    ['b4', [75, 300]],
    ['b5', [75, 225]],
    ['b6', [75, 150]],
    ['b7', [75, 75]],
    ['b8', [75, 0]],
    ['c1', [150, 525]],
    ['c2', [150, 450]],
    ['c3', [150, 375]],
    ['c4', [150, 300]],
    ['c5', [150, 225]],
    ['c6', [150, 150]],
    ['c7', [150, 75]],
    ['c8', [150, 0]],
    ['d1', [225, 525]],
    ['d2', [225, 450]],
    ['d3', [225, 375]],
    ['d4', [225, 300]],
    ['d5', [225, 225]],
    ['d6', [225, 150]],
    ['d7', [225, 75]],
    ['d8', [225, 0]],
    ['e1', [300, 525]],
    ['e2', [300, 450]],
    ['e3', [300, 375]],
    ['e4', [300, 300]],
    ['e5', [300, 225]],
    ['e6', [300, 150]],
    ['e7', [300, 75]],
    ['e8', [300, 0]],
    ['f1', [375, 525]],
    ['f2', [375, 450]],
    ['f3', [375, 375]],
    ['f4', [375, 300]],
    ['f5', [375, 225]],
    ['f6', [375, 150]],
    ['f7', [375, 75]],
    ['f8', [375, 0]],
    ['g1', [450, 525]],
    ['g2', [450, 450]],
    ['g3', [450, 375]],
    ['g4', [450, 300]],
    ['g5', [450, 225]],
    ['g6', [450, 150]],
    ['g7', [450, 75]],
    ['g8', [450, 0]],
    ['h1', [525, 525]],
    ['h2', [525, 450]],
    ['h3', [525, 375]],
    ['h4', [525, 300]],
    ['h5', [525, 225]],
    ['h6', [525, 150]],
    ['h7', [525, 75]],
    ['h8', [525, 0]]
]);


class Move{
    constructor(from, to, passant = false){
        this.from = from;
        this.to = to;
        this.capture = currentBoard.squareoccupied(to)
        if (passant){this.capture = true}
        this.piece = currentBoard.squareoccupied(from, null, true)
        this.color = Number(this.piece.isBlack)
        if (this.capture){
            this.takenPiece = currentBoard.squareoccupied(to, null, true)
            if (passant){
                this.passant = true
                let frontOrBack = (this.color) ? to[0] + (Number(to[1]) + 1):to[0] + (Number(to[1]) - 1)
                this.takenPiece = currentBoard.squareoccupied(frontOrBack, null, true)
            }
        }if (this.checkCastle()){
            this.castle = true
            this.rookCastle = this.getRook(this.checkCastle())
            this.rookTo = this.getRooksq()
        }
    }

    checkCastle(){
        if (this.piece instanceof King){
            if (this.color){
                if (this.from == 'e8' && this.to == 'g8'){
                    return 'O-O'
                }else if (this.from == 'e8' && this.to == 'c8'){
                    return 'O-O-O'
                }
            }else {
                if (this.from == 'e1' && this.to == 'g1'){
                    return 'O-O'
                }else if (this.from == 'e1' && this.to == 'c1'){
                    return 'O-O-O'
                }
            }
        }return false
    }

    getRook(castle){
        if (castle == 'O-O'){
            return (this.color) ? currentBoard.squareoccupied('h8', null, true):
            currentBoard.squareoccupied('h1', null, true)
        };
        return (this.color) ? currentBoard.squareoccupied('a8', null, true):
        currentBoard.squareoccupied('a1', null, true)

    }
    getRooksq(){
        if (this.color){
            return (this.rookCastle.sq == 'a8') ? 'd8':'f8'
        }return (this.rookCastle.sq == 'a1') ? 'd1':'f1'
    }

    checkPromote(){
        if (this.piece instanceof Pawn){
            if (this.color){
                if (this.to[1] == '1'){
                    return true
                }
            }else {
                if (this.to[1] == '8'){
                    return true
                }
            }
        }
        return false
    }

    toPGN(){
        let res, castle = this.checkCastle();
        if (castle){
            return castle
        }

        switch(this.piece.constructor.name){
            case 'Knight':
                res = 'N'
                break;
            case 'Bishop':
                res = 'B'
                break;
            case 'Rook':
                res = 'R'
                break;
            case 'Queen':
                res = 'Q'
                break;
            case 'King':
                res = 'K'
                break;
            case 'Pawn':
                res = (this.capture) ? this.from[0]: ''
                break;
            default:
                throw SyntaxError('Piece type not vaild' + this.piece.constructor.name)
        }

        let squares = []
        for (let piece of currentBoard.pieces){
            if (piece === this.piece){continue}
            if (piece.constructor === this.piece.constructor){
                if (piece.isBlack == this.piece.isBlack){
                    piece.moves.forEach((val) => {
                        if(val.to == this.to){squares.push(piece.sq);return}
                    })
                }
            }
        }

        let addOns = ['', '']
        for (let sq of squares){
            if (sq[0] == this.from[0]){
                addOns[0] = this.from[0]
            }if (sq[1] == this.from[1]){
                addOns[1] = this.from[1]
            }
        }

        addOns = addOns[0] + addOns[1]
        
        res += addOns
        if (this.capture){res+='x'}
        res += this.to
        if (this.checkPromote()){res+='='+ this.promotion}
        res += (currentBoard.checkForCheck(!this.color, undefined, true)) ? '+':''
        return res
    }
}class Board {
    constructor(color) {
        document.getElementById('result').innerHTML = '';
        this.color = color
        this.bking = new King(true, 'e8');
        this.wking = new King(false, 'e1');
        this.wkrook = new Rook(false, 'h1'),
        this.wqrook = new Rook(false, 'a1'),
        this.bkrook = new Rook(true, 'a8'),
        this.bqrook = new Rook(true, 'h8'),

        this.selected = undefined;
        this.whites_turn = true;
        this.pieces = [
            new Pawn(false, 'a2'),
            new Pawn(false, 'b2'),
            new Pawn(false, 'c2'),
            new Pawn(false, 'd2'),
            new Pawn(false, 'e2'),
            new Pawn(false, 'f2'),
            new Pawn(false, 'g2'),
            new Pawn(false, 'h2'),

            new Pawn(true, 'a7'),
            new Pawn(true, 'b7'),
            new Pawn(true, 'c7'),
            new Pawn(true, 'd7'),
            new Pawn(true, 'e7'),
            new Pawn(true, 'f7'),
            new Pawn(true, 'g7'),
            new Pawn(true, 'h7'),

            new Bishop(false, 'c1'),
            new Bishop(false, 'f1'),
            new Bishop(true, 'c8'),
            new Bishop(true, 'f8'),

            new Knight(false, 'b1'),
            new Knight(false, 'g1'),
            new Knight(true, 'b8'),
            new Knight(true, 'g8'),

            this.wkrook,
            this.wqrook,
            this.bkrook,
            this.bqrook,

            new Queen(false, 'd1'),
            new Queen(true, 'd8'),

            this.bking, this.wking
        ];
        this.wpieces = [];
        this.bpieces = [];
        this.positions = [this.getFen()]
        this.lastMove = {}
        this.reloadList()
        
        

    }

    squareoccupied(sq, isBlack=null, returnpiece = false) {
        for (let x of this.pieces) {
            if (x.sq == sq){
                if ((isBlack == x.isBlack) || (isBlack == null)){
                    return (returnpiece) ? x:true
                }
            }
        }
        return (returnpiece) ? null:false
    }
    
    sqfro(sq)  {
        if (sq == null){return null} 
        let x = sq[0] + (Number(sq[1]) + 1);
        if (Number(x[1]) > 8) {
            return null;
        }
        return x;
    }
    
    sqback(sq)  {
        if (sq == null){return null} 
        let x = sq[0] + (Number(sq[1]) - 1);
        if (Number(x[1]) < 1) {
            return null;
        }
        return x;
    
    }
    
    sqright(sq)  {
        if (sq == null){return null} 
        let x = String.fromCharCode(charcode(sq[0]) + 1 + 96) + sq[1];
        if (x[0] == 'i'){
            return null;
        }
        return x;
    
    }

    sqleft(sq)  {
        if (sq == null){return null} 
        let x = String.fromCharCode(charcode(sq[0]) - 1 + 96) + sq[1];
        if (x[0] == '`'){
            return null;
        }
        return x;
    
    }

    async checkClick(e){
        let pos = getMousePosition(e);
        if (pos[0] <= 600 && pos[1] <= 600) {
            let sq = String.fromCharCode(Math.floor(pos[0]/75)+97) + String(8 - Math.floor(pos[1]/75));
            for (let x of this.pieces){
                if (x.sq == sq) {
                    if (this.whites_turn != x.isBlack && this.whites_turn != this.color){
                        x.select();
                        this.selected = {sq: sq, piece: x};
                        return;
                    }
                }
            }
            if (this.selected != undefined){
                for (let o of this.selected.piece.moves){
                    if (o.to == sq){
                        await this.move(o)
                        this.selected = undefined
                        return;
                    }
                }
            }
            gameCanvas.drawBoard()
            for (let x of this.pieces){x.draw()}
        }
    }

    checkForCheck(color = null, sq=undefined, bool=false) {
        let wchecks = [], bchecks = [], bkingsq = this.bking.sq, wkingsq = this.wking.sq;

        if (sq != undefined){
            if (color == false){
                wkingsq = sq;
            }
            else if (color == true){
                bkingsq = sq;
            }
            else {
                throw new SyntaxError('Color needs to be passed in case of square check')
            }
        }

        for (let wp of this.wpieces){
            for (let mv of wp.moves){
                if (mv.to == bkingsq){
                    bchecks.push(mv)
                }
            }
        }
        for (let bp of this.bpieces){
            for (let mv of bp.moves){
                if (mv.to == wkingsq){
                    wchecks.push(mv)
                }
            }
        }

        if (wchecks.length == 0){this.wking.incheck = false}else{this.wking.incheck = true}
        if (bchecks.length == 0){this.bking.incheck = false}else{this.bking.incheck = true}
        if (bool){
            switch (Number(color)){
                case 0:
                    return wchecks.length != 0
                case 1:
                    return bchecks.length != 0
                default:
                    return [wchecks, bchecks]
            }
        }else {
            switch (Number(color)){
                case 0:
                    return wchecks
                case 1:
                    return bchecks
                default:
                    return [wchecks, bchecks]
            }
        }
        
    }

    reloadList() {
        this.bpieces = []; this.wpieces = [];
        for (let p of this.pieces){
            if (p.isBlack){this.bpieces.push(p)}
            else {this.wpieces.push(p)}
        }
    }

    checkMoves() {
        for (let p of this.pieces){
            p.getMoves()
        }
    }

    delete(piece, reload=true){
        this.pieces.splice(this.pieces.indexOf(piece), 1)
        if (reload){this.reloadList()}
    }

    checkDraw() {
        const insuff = () => {
            if (this.pieces.length == 2){
                return true
                }
            else if (this.pieces.length > 3){
                return false

            }
            
            let fe = true;
            this.pieces.forEach((val) => {
                if (val instanceof Queen || val instanceof Rook || val instanceof Pawn) {
                    fe = false
                    return
                }}
            )

            return fe
        }
        //const timevsinsuff = () => {};
        //const agree = () => {};
        const rep = () => {
            let copy = this.positions.filter((val) => val == this.getFen())
            if (copy.length == 3){
                return true
            }
            return false

        }
        
        if (insuff() ){
            return {draw: true, type: 'Insufficient Material'}
        } else if (rep()){
            return {draw: true, type: 'Repetition'}
        }
        return {draw: false}
    }

    removeIllegal(color = Number(this.whites_turn)) {
        this.reloadList()
        let checkedpieces = (color) ? this.wpieces:this.bpieces;
        let checkingpieces = (!color) ? this.wpieces:this.bpieces;
        let originalSq, checked, rookOriginalSquaure, legalMoves = [];

        
        
        for (let piece of checkedpieces){
            this.checkMoves()
            originalSq = piece.sq
            for (let move of piece.moves){
                if (move.capture){   
                    if (move.to == 'g4'){debugger}                  
                    this.delete(move.takenPiece, false)
                    checkingpieces.splice(checkingpieces.indexOf(move.takenPiece), 1)

                }if (move.castle){
                    rookOriginalSquaure = move.rookCastle.sq
                    move.rookCastle.sq = mv.rookTo
                }
                piece.sq = move.to
                this.checkMoves()
                if (this.checkForCheck(!color).length == 0) {
                    legalMoves.push({mv: move, piece: piece})
                }

                if (move.capture){
                    this.pieces.push(move.takenPiece)
                    checkingpieces.push(move.takenPiece)
                }if (move.castle){
                    move.rookCastle.sq = rookOriginalSquaure
                }
                piece.sq = originalSq
            }
        }
        for (let p of checkedpieces){p.moves = new Set()}
        if (this.checkForCheck(!color).length== 0){
            checked = false
        }else {checked = true}

        if (this.whites_turn && color && legalMoves.length == 0){
            (checked) ? this.checkmate('black'):this.draw('stalemate')
        }
        else if (!this.whites_turn && !color && legalMoves.length == 0){
            (checked) ? this.checkmate('white'):this.draw('stalemate')
        }

        legalMoves.forEach((val) => {
            val.piece.moves.add(val.mv)
        })
        
        return legalMoves

    }

    checkmate(side) {
        document.getElementById('result').innerHTML = capitalize(side) + " won by checkmate";
        currentBoard = undefined
    }
    draw(type) {
        document.getElementById('result').innerHTML = "Draw by " + type;
        currentBoard = undefined

    }

    changeMove(move){
        this.lastMove = move
        this.whites_turn = !this.whites_turn
        this.positions.push(this.getFen())
        this.checkMoves()
        this.removeIllegal()
        gameCanvas.drawBoard()
        for (let p of this.pieces){p.draw()}
    }

    /**
     * 
     * @param {Move} move 
     */
    async move(move){
        if (move.piece instanceof Rook ||move.piece instanceof King){
            move.piece.moved = true
        };

        if (move.capture){
            this.delete(move.takenPiece)
        };

        move.piece.sq = move.to;

        if (move.castle){
            move.rookCastle.sq = move.rookTo
        };
        if (move.checkPromote()){
            move.promotion = await move.piece.promote();
            this.delete(move.piece)
        };

       
        this.changeMove(move)
    }

    getFen(){
        let pf, pr;
        let nots = Array.from({ length: 8 }, () => Array(8).fill(''));
        let getLet = (n, isBlack) =>{
            let res;
            switch(n){
                case 'Pawn':
                    res = 'p'
                    break;
                case 'Knight':
                    res = 'k'
                    break;
                case 'Bishop':
                    res = 'b'
                    break;
                case 'Rook':
                    res = 'r'
                    break;
                case 'Queen':
                    res = 'q'
                    break;
                case 'King':
                    res = 'k'
                    break;
                default:
                    console.error('WHAT THE FUCK THAT ISN\'T A PIECE');
                    break;
            }
            return (isBlack) ? res:capitalize(res)
        }

        for (let p of this.pieces){
            pf = charcode(p.sq[0]),  pr = Number(p.sq[1]);
            nots[pr - 1][pf - 1] = getLet(p.constructor.name, p.isBlack)
        }
        let s = '';
        for (let x of nots){
            let f = '', counter = 0;
            for (let y of x){
                if (y == ''){
                    counter += 1; 
                    continue;
                }else {
                    if (counter != 0){
                        f += counter
                    }
                    f += y;
                    counter = 0
                }
            }
            if (counter != 0){
                f += counter
            }
            s += f
            s += '/'
        }
        s = s.slice(0,-1)
        
        if (this.whites_turn){
            s += ' w' 
        } else {
            s += ' w' 
        }
        return s
    }
    
}

class Piece {
    constructor(isBlack, sq, points) {  
        this.isBlack = isBlack;
        this.img = null;
        this.sq = sq;
        this.points = points;
        this.moves = new Set()
    }
    
    draw() {
        let [x, y] = boardpos.get(this.sq);
        gameCanvas.context.drawImage(this.img, x, y);
    }
    getMoves() {
        return self.moves;
    }

    select() {
        
        gameCanvas.drawBoard()
        for (let move of this.moves) {
            
            if (!move.capture) {
            gameCanvas.context.beginPath();
            gameCanvas.context.arc(boardpos.get(move.to)[0] + 37.5, boardpos.get(move.to)[1] + 37.5, 17, 0, 2 * Math.PI, false);
            gameCanvas.context.fillStyle = 'gray';
            gameCanvas.context.fill();
            }
            else {
                gameCanvas.context.fillStyle = 'rgb(129, 133, 137)';
                gameCanvas.context.fillRect(boardpos.get(move.to)[0] + 3, boardpos.get(move.to)[1] + 3, 69, 69);
                gameCanvas.context.fillStyle = 'azure';
                gameCanvas.context.fillRect(boardpos.get(move.to)[0] + 7, boardpos.get(move.to)[1] + 7, 61, 61);
            }
        }
        for (let x of currentBoard.pieces){x.draw()}
    }

    straight(len) {
        let front = new Set();
        if (len == null){len = 9};let orisq = this.sq, temp = orisq, x = len;
        while (x--) {
            temp = currentBoard.sqfro(temp)
            if (temp == null || currentBoard.squareoccupied(temp, this.isBlack)){
                break;
            }front.add(new Move(this.sq, temp));
            if(currentBoard.squareoccupied(temp, !this.isBlack)){break}
        }

        let back = new Set();
        orisq = this.sq, temp = orisq, x = len;
        while (x--) {
            temp = currentBoard.sqback(temp)
            if (temp == null || currentBoard.squareoccupied(temp, this.isBlack)){
                break;
            }back.add(new Move(this.sq, temp))
            if(currentBoard.squareoccupied(temp, !this.isBlack)){break}
        }
        let right = new Set();
        orisq = this.sq, temp = orisq, x = len;
        while (x--) {
            temp = currentBoard.sqright(temp)
            if (temp == null || currentBoard.squareoccupied(temp, this.isBlack)){
                break;
            }right.add(new Move(this.sq, temp))
            if(currentBoard.squareoccupied(temp, !this.isBlack)){break}
        }
        let left = new Set();
        orisq = this.sq, temp = orisq, x = len;
        while (x--) {
            temp = currentBoard.sqleft(temp)
            if (temp == null || currentBoard.squareoccupied(temp, this.isBlack)){
                break;
            };left.add(new Move(this.sq, temp))
            if(currentBoard.squareoccupied(temp, !this.isBlack)){break}
        }
        return new Set([...back, ...front, ...right, ...left])
    }

    diag(len) {
        let topright = new Set();
        if (len == null){len = 9};let orisq = this.sq, temp = orisq, x = len;
        while (x--) {
            temp = currentBoard.sqright(currentBoard.sqfro(temp))
            if (temp == null || currentBoard.squareoccupied(temp, this.isBlack)){
                break;
            }topright.add(new Move(this.sq, temp));
            if(currentBoard.squareoccupied(temp, !this.isBlack)){break}
        }

        let topleft = new Set();
        orisq = this.sq, temp = orisq, x = len;
        while (x--) {
            temp = currentBoard.sqleft(currentBoard.sqfro(temp))
            if (temp == null || currentBoard.squareoccupied(temp, this.isBlack)){
                break;
            }topleft.add(new Move(this.sq, temp));
            if(currentBoard.squareoccupied(temp, !this.isBlack)){break}
        }
        let bottomright = new Set();
        orisq = this.sq, temp = orisq, x = len;
        while (x--) {
            temp = currentBoard.sqback(currentBoard.sqright(temp))
            if (temp == null || currentBoard.squareoccupied(temp, this.isBlack)){
                break;
            }bottomright.add(new Move(this.sq, temp));
            if(currentBoard.squareoccupied(temp, !this.isBlack)){break}
        }
        let bottomleft = new Set();
        orisq = this.sq, temp = orisq, x = len;
        while (x--) {
            temp = currentBoard.sqback(currentBoard.sqleft(temp))
            if (temp == null || currentBoard.squareoccupied(temp, this.isBlack)){
                break;
            }bottomleft.add(new Move(this.sq, temp));
            if(currentBoard.squareoccupied(temp, !this.isBlack)){break}
        }
        return new Set([...topright, ...topleft, ...bottomright, ...bottomleft])
    }
    


}class Pawn extends Piece {
    constructor(isBlack, sq) {
        super(isBlack, sq, 1);
        this.img = Images.get("Pawn")[Number(isBlack)];
        
    }

    getMoves() {
        let moves = new Set();
        let sqinfro = (this.isBlack) ? currentBoard.sqback(this.sq) : currentBoard.sqfro(this.sq)
        
        
        if (!currentBoard.squareoccupied(sqinfro, null)){
            moves.add(new Move(this.sq, sqinfro))
        }
        if ((this.sq[1] == '7' && this.isBlack) && !currentBoard.squareoccupied(currentBoard.sqback(sqinfro), null)){
            moves.add(new Move(this.sq, currentBoard.sqback(sqinfro)))
        
        }else if ((this.sq[1] == '2' && !this.isBlack) && !currentBoard.squareoccupied(currentBoard.sqfro(sqinfro), null)){
            moves.add(new Move(this.sq, currentBoard.sqfro(sqinfro)))
        }

        let cap1 = currentBoard.sqleft(sqinfro), cap2 = currentBoard.sqright(sqinfro)
        if (currentBoard.squareoccupied(cap1, !this.isBlack)){
            moves.add(new Move(this.sq, cap1))
        }

        if (currentBoard.squareoccupied(cap2, !this.isBlack)){
            moves.add(new Move(this.sq, cap2))
        }
        // if (this.checkPromote()){
        //     this.moves.add(this.checkPromote())
        // }
        

        let x = this.enpassant()
        if (x != undefined){
            moves.add(new Move(this.sq, x.targetSq, true))
        }

        this.moves = new Set(moves)
        
    }
    enpassant() {
        let mv;
        if ((this.sq[1] == '4' && this.isBlack) || (this.sq[1] == '5' && !this.isBlack)){
            let p = currentBoard.lastMove

            if (p.piece instanceof Pawn){
                if (Number(p.from[1]) - Number(p.to[1]) == 2 || Number(p.from[1]) - Number(p.to[1]) == -2){
                    if (currentBoard.sqright(this.sq) == p.to){
                        mv =  (this.isBlack) ? currentBoard.sqback(currentBoard.sqright(this.sq)):
                        currentBoard.sqfro(currentBoard.sqright(this.sq));
                    }else if (currentBoard.sqleft(this.sq) == p.to){
                        mv =  (this.isBlack) ? currentBoard.sqback(currentBoard.sqleft(this.sq)):
                        currentBoard.sqfro(currentBoard.sqleft(this.sq));
                    }
                }
            }
        }
        if (mv){
            return {targetSq: mv}
        }
    }

    checkPromote() {
        if (!this.isBlack && this.sq[1] == '7'){
            if (!currentBoard.squareoccupied(currentBoard.sqfro(this.sq))){
                return {sq: currentBoard.sqfro(this.sq), capture: false, promote: true}
            }
        } else if (this.isBlack && this.sq[1] == '2'){
            if (!currentBoard.squareoccupied(currentBoard.sqback(this.sq))){
                return {sq: currentBoard.sqback(this.sq), capture: false, promote: true}
            }
        }
        return false
    }

    async promote(){
        let modClass = document.querySelector('.modal').classList;
        modClass.remove('hidden')
        
        let prom = new Promise((resolve) => {
            const buttons = document.querySelectorAll('.promote')
            let clickFunc = (event) => {
                buttons.forEach((b) => {b.removeEventListener('click', clickFunc)})
                resolve(event.target.textContent)
            };
            buttons.forEach((button) => {
                button.addEventListener('click', clickFunc)
            })
        })
        await prom.then((res) => {this.promotePiece(res[0]);modClass.add('hidden'); return res[0]})
    }
    
    promotePiece(res){
        if (res == 'Q'){
            currentBoard.pieces.push(
                new Queen(this.isBlack, this.sq)
            )
        }else if (res == 'R'){
            currentBoard.pieces.push(
                new Rook(this.isBlack, this.sq)
            )
        }else if (res == 'B'){
            currentBoard.pieces.push(
                new Bishop(this.isBlack, this.sq)
            )
        }else if (res == 'K'){
            currentBoard.pieces.push(
                new Knight(this.isBlack, this.sq)
            )
        }
        return res
    }

}class Bishop extends Piece {
    constructor(isBlack, sq) {
        super(isBlack, sq, 3);
        this.img = Images.get("Bishop")[Number(isBlack)];
    }

    getMoves() {
        this.moves = this.diag(null)
    }
}class Knight extends Piece {
    constructor(isBlack, sq) {
        super(isBlack, sq, 3);
        this.img = Images.get("Knight")[Number(isBlack)];
    }

    getMoves() {
        this.moves = new Set();   
        let possibleMoves = [
            currentBoard.sqfro(currentBoard.sqfro(currentBoard.sqleft(this.sq))),
            currentBoard.sqfro(currentBoard.sqfro(currentBoard.sqright(this.sq))),
            currentBoard.sqback(currentBoard.sqback(currentBoard.sqleft(this.sq))),
            currentBoard.sqback(currentBoard.sqback(currentBoard.sqright(this.sq))),
            currentBoard.sqright(currentBoard.sqright(currentBoard.sqfro(this.sq))),
            currentBoard.sqright(currentBoard.sqright(currentBoard.sqback(this.sq))),
            currentBoard.sqleft(currentBoard.sqleft(currentBoard.sqfro(this.sq))),
            currentBoard.sqleft(currentBoard.sqleft(currentBoard.sqback(this.sq))),
        ]
        for (let mv of possibleMoves) {
            if (mv != null && !currentBoard.squareoccupied(mv, this.isBlack)) {
                this.moves.add(new Move(this.sq, mv))
            }
        }

    }
}class Rook extends Piece {
    constructor(isBlack, sq) {
        super(isBlack, sq, 5);
        this.img = Images.get("Rook")[Number(isBlack)];
        this.moved = false;
    }
    getMoves() {
        this.moves = this.straight(null)
    }
}class Queen extends Piece {
    constructor(isBlack, sq) {
        super(isBlack, sq, 9);
        this.img = Images.get("Queen")[Number(isBlack)];
    }
    
    getMoves() {
        this.moves = new Set([...this.straight(null), ...this.diag(null)])
    }
}class King extends Piece {
    constructor(isBlack, sq) {
        super(isBlack, sq, Infinity);
        this.img = Images.get("King")[Number(isBlack)];
        this.moved = false;
        this.incheck = false;

    }

    getMoves() {
        this.moves = new Set([...this.straight(1), ...this.diag(1)])
        let cas = this.canCastle()
        if (cas[0]){
            this.moves.add(cas[0])
        }if (cas[1]){
            this.moves.add(cas[1])
        }
        
    }

    canCastle(){
        let res = [undefined, undefined];
        if (this.moved || this.incheck){
            return [false, false]
        }
        if (!this.isBlack){
            if (currentBoard.squareoccupied('b1') || 
            currentBoard.squareoccupied('c1') || currentBoard.squareoccupied('d1')){
                res[0] = false
            }
            else if (currentBoard.wqrook.moved){
                res[0] = false
            }
            else if (!currentBoard.checkForCheck(false, 'c1', true) || 
            !currentBoard.checkForCheck(false, 'd1', true) ){
                res[0] = false
            }else{
                res[0] = new Move('e1', 'c1')
            }

            
            if (currentBoard.squareoccupied('f1') || 
            currentBoard.squareoccupied('g1') ){
                res[1] = false
            }
            else if (currentBoard.wkrook.moved){
                res[1] = false
            }
            else if (!currentBoard.checkForCheck(false, 'f1', true) || 
            !currentBoard.checkForCheck(false, 'g1', true) ){
                res[1] = false
            }else{
                res[1] = new Move('e1', 'g1')
            }
            
        }else {
            if (currentBoard.squareoccupied('b8') || 
            currentBoard.squareoccupied('c8') || currentBoard.squareoccupied('d1')){
                res[0] = false
            }else if (currentBoard.bqrook.moved){
                res[0] = false
            }else if (!currentBoard.checkForCheck(true, 'c8', true) || 
            !currentBoard.checkForCheck(true, 'd8', true) ){
                res[0] = false
            }else{
                res[0] = new Move('e8', 'c8')
            }

            if (currentBoard.squareoccupied('f8') || 
            currentBoard.squareoccupied('g8') ){
                res[1] = false
            }
            else if (currentBoard.wkrook.moved){
                res[1] = false
            }
            else if (!currentBoard.checkForCheck(false, 'f8', true) || 
            !currentBoard.checkForCheck(false, 'g8', true) ){
                res[1] = false
            }else{
                res[1] = new Move('e8', 'g8')
            }
            
        }

        return res

        
    }

}

const gameCanvas = {
    canvas: document.createElement('canvas'),
    size: [600, 600],
    drawBoard: function (){
        for (let i = 0; i <= 7; i++){
            for (let y = 0; y <= 7; y++){
                if (i%2 == 0) {
                    if (y%2 == 0){
                        this.context.fillStyle = "azure"
                        this.context.fillRect(y*75, i*75, 75, 75);
                    }
                    else {
                        this.context.fillStyle = "darkgreen"
                        this.context.fillRect(y*75, i*75, 75, 75);
                    }
                }
                else {
                    if (y%2 == 0){
                        this.context.fillStyle = "darkgreen"
                        this.context.fillRect(y*75, i*75, 75, 75);
                    }
                    else {
                        this.context.fillStyle = "azure"
                        this.context.fillRect(y*75, i*75, 75, 75);
                    }
                }
            }
        }
    },
    start: function() {
        imageLoad()
        this.canvas.width = this.size[0];
        this.canvas.height = this.size[1];
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.lastChild);
        this.drawBoard()
    }
};

function getMousePosition(event) {
    let rect = gameCanvas.canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return [x, y];
};

function gameStart() { 
    gameCanvas.drawBoard()
    currentBoard = new Board()
    for (let sdf of currentBoard.pieces){sdf.draw()}
    currentBoard.removeIllegal()
};


gameCanvas.canvas.addEventListener('mousedown', function (e) {
    if (currentBoard != undefined){
        currentBoard.checkClick(e)
    }
});



