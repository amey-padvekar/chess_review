"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPieceHanging = exports.getDefenders = exports.getAttackers = exports.pieceValues = exports.promotions = void 0;
const chess_js_1 = require("chess.js");
exports.promotions = [undefined, "b", "n", "r", "q"];
exports.pieceValues = {
    "p": 1,
    "n": 3,
    "b": 3,
    "r": 5,
    "q": 9,
    "k": Infinity,
    "m": 0
};
function getBoardCoordinates(square) {
    return {
        x: "abcdefgh".indexOf(square.slice(0, 1)),
        y: parseInt(square.slice(1)) - 1
    };
}
function getSquare(coordinate) {
    return "abcdefgh".charAt(coordinate.x) + (coordinate.y + 1).toString();
}
function getAttackers(fen, square) {
    let attackers = [];
    let board = new chess_js_1.Chess(fen);
    let piece = board.get(square);
    board.load(fen.replace(/(?<= )(?:w|b)(?= )/g, piece.color == "w" ? "b" : "w"));
    let legalMoves = board.moves({ verbose: true });
    for (let move of legalMoves) {
        if (move.to == square) {
            attackers.push({
                square: move.from,
                color: move.color,
                type: move.piece
            });
        }
    }
    let oppositeKingFound = false;
    let oppositeColour = piece.color == "w" ? "b" : "w";
    let pieceCoordinate = getBoardCoordinates(square);
    for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            if (xOffset == 0 && yOffset == 0)
                continue;
            let offsetSquare = getSquare({
                x: Math.min(Math.max(pieceCoordinate.x + xOffset, 0), 7),
                y: Math.min(Math.max(pieceCoordinate.y + yOffset, 0), 7)
            });
            let offsetPiece = board.get(offsetSquare);
            if (!offsetPiece)
                continue;
            if (offsetPiece.color == oppositeColour && offsetPiece.type == "k") {
                try {
                    board.move({
                        from: offsetSquare,
                        to: square
                    });
                }
                catch (_a) {
                    oppositeKingFound = true;
                    break;
                }
                attackers.push({
                    square: offsetSquare,
                    color: offsetPiece.color,
                    type: offsetPiece.type
                });
                oppositeKingFound = true;
                break;
            }
        }
        if (oppositeKingFound)
            break;
    }
    return attackers;
}
exports.getAttackers = getAttackers;
function getDefenders(fen, square) {
    let defenders;
    let board = new chess_js_1.Chess(fen);
    let piece = board.get(square);
    let attackers = getAttackers(fen, square);
    board.load(fen.replace(/(?<= )(?:w|b)(?= )/g, piece.color == "w" ? "b" : "w"));
    for (let attacker of attackers) {
        for (let promotion of exports.promotions) {
            try {
                board.move({
                    from: attacker.square,
                    to: square,
                    promotion: promotion
                });
                let counterattackers = getAttackers(board.fen(), square);
                if (!defenders || counterattackers.length < defenders.length) {
                    defenders = counterattackers;
                }
                board.undo();
            }
            catch (_a) { }
        }
    }
    return defenders !== null && defenders !== void 0 ? defenders : [];
}
exports.getDefenders = getDefenders;
function isPieceHanging(lastFen, fen, square) {
    let lastBoard = new chess_js_1.Chess(lastFen);
    let board = new chess_js_1.Chess(fen);
    let lastPiece = lastBoard.get(square);
    let piece = board.get(square);
    let attackers = getAttackers(fen, square);
    let defenders = getDefenders(fen, square);
    if (exports.pieceValues[lastPiece.type] >= exports.pieceValues[piece.type] && lastPiece.color != piece.color) {
        return false;
    }
    if (piece.type == "r"
        && exports.pieceValues[lastPiece.type] == 3
        && attackers.every(atk => exports.pieceValues[atk.type] == 3)
        && attackers.length == 1) {
        return false;
    }
    if (attackers.some(atk => exports.pieceValues[atk.type] < exports.pieceValues[piece.type])) {
        return true;
    }
    if (attackers.length > defenders.length) {
        let minAttackerValue = Infinity;
        for (let attacker of attackers) {
            minAttackerValue = Math.min(exports.pieceValues[attacker.type], minAttackerValue);
        }
        if (exports.pieceValues[piece.type] < minAttackerValue
            && defenders.some(dfn => exports.pieceValues[dfn.type] < minAttackerValue)) {
            return false;
        }
        if (defenders.some(dfn => exports.pieceValues[dfn.type] == 1)) {
            return false;
        }
        return true;
    }
    return false;
}
exports.isPieceHanging = isPieceHanging;
