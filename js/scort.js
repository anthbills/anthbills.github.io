var VirtualBoard = new Array(120);
var VirtualSide = Colour.Both;
var BestMove = 0;
var BestEval = 0;
var DeepBoard = [];
const infinite = 10000000;
const negInfinite = -10000000;
var killScort = 0;
var maxEval;
var minEval;

function ComputerMove() {

    BestMove = 0;
    BestEval = 0;
    var from;
    var to;

    BestMove = FindBestMove();

    from = GetMoveFrom(BestMove);
    to = GetMoveTo(BestMove);

    MakeMove(from, to);

}

function MakeSecretMove(from, to) {

    var pce = square120[from];

    if(PieceCol[pce] != Board.Side) {
        return;
    }

    if(from == to) {
        return;
    }

    ClearPiece(from);
    ClearPiece(to);

    square120[to] = pce;

    UpdateFortressStat(square120);
    UpdateOutpostStat(square120);

    SecretPromotion();

    ChangeSide();

    Board.Turn++;

    if(Board.Ply == 1) {
        Board.Ply = 0;
        Board.Move++;
    } else {
        Board.Ply = 1;
    }

    UpdateFPNOut();

    SaveMove(Board.Turn, currentFPN);

    GenerateMoves(square120, Board.Side);

}

function TakeSecretMove() {

    if(Board.Turn == 0) {
        return;
    }
    
    MoveHist.pop();
    
    Board.Turn--;
    if(Board.Ply == 0) {
        Board.Ply = 1;
        Board.Move--;
    } else {
        Board.Ply == 0;
    }

    ChangeSide();

    var returnto = MoveHist[Board.Turn];

    ParsePosition(returnto);
    GenerateMoves(square120, Board.Side);
    UpdateFPNOut();

}

function SecretPromotion() {

    index = 0;

    if (fortressStat == wctl || fortressStat == bctl) {
        for (index = 0; index < 120; index++) {
            if(IsInFortress(index) == true) {
                switch(square120[index]) {
                    case Pieces.Empty: break;
                    case Pieces.wP: square120[index] = Pieces.wL; break;
                    case Pieces.wG: square120[index] = Pieces.wS; break;
                    case Pieces.bP: square120[index] = Pieces.bL; break;
                    case Pieces.bG: square120[index] = Pieces.bS; break;
                }
            }
        }
    }

}

function FindBestMove() {

    var side = Board.Side;
    GenerateMoves(square120, side);
    var moveCount = CheckMoveCount();
    var index;
    var deepIndex;
    var from;
    var to;
    var eval = 0;
    var MaxDepth = 20;
    killScort = 0;
    maxEval = 0;
    minEval = 0;
    var randMov = 0;

    if(moveCount == 0) {
        return;
    }

    for(index = 0; index < moveCount; index++) {
        from = GetMoveFrom(index);
        to = GetMoveFrom(index);
        MakeSecretMove(from, to);
        eval = EvaluateBoard(square120);
        if(side == Colour.White) {
            if(eval > BestEval) {
                BestEval = eval;
                BestMove = index;
            }
        } else if(side == Colour.Black) {
            if(eval < BestEval) {
                BestEval = eval;
                BestMove = index;
            }
        }
        TakeSecretMove();
    }

    return BestMove;

}

function DeepMove(MaxDepth, depth, alpha, beta) {
    
    var index;
    var eval;
    var moveCount;
    killScort++;

    // if(killScort == 5000) {
    //     console.log("Scort has been killed! :(")
    //     return;
    // }

    GenerateMoves(square120, Board.Side);
    console.log(MoveList);
    moveCount = CheckMoveCount();
    
    if(depth == 0 || moveCount == 0) {
        eval = EvaluateBoard(square120);
        for(index = 0; index < MaxDepth; index++) {
            TakeSecretMove();
        }
        return eval;
    }

    if(Board.Side == Colour.White) {
        maxEval = negInfinite;
        for(index = 0; index < moveCount; index++) {
            from = GetMoveFrom(index);
            to = GetMoveTo(index);
            MakeSecretMove(from, to);
            eval = DeepMove(MaxDepth, depth - 1, alpha);
            if(eval > maxEval) {
                maxEval = eval;
            }
            if(eval > alpha) {
                alpha = eval;
            }
            if(beta <= alpha) {
                break;
            }
        }
        return maxEval;
    } else if(Board.Side == Colour.Black) {
        minEval = infinite;
        for(index = 0; index < moveCount; index++) {
            from = GetMoveFrom(index);
            to = GetMoveTo(index);
            MakeSecretMove(from, to);
            eval = DeepMove(MaxDepth, depth - 1, beta);
            if(eval < minEval) {
                minEval = eval;
            }
            if(eval < beta) {
                beta = eval;
            }
            if(beta <= alpha) {
                break;
            }
        }
        return minEval;
    }




} 

function EvaluateBoard(position) {

    var eval = 0;
    var Wmoves;
    var Bmoves;

    // Material
    eval = CountMaterial(position);
    // Activity
    // GenerateMoves(position, Colour.White);
    // Wmoves = CheckMoveCount();
    // GenerateMoves(position, Colour.Black);
    // Bmoves = CheckMoveCount();
    // eval += Wmoves;
    // eval -= Bmoves;
    // Placement
    eval += CountRelValue(position);

    console.log("Evaluation: " + eval);

    return eval;

}

function CountMaterial(position) {

    var index;
    var MaterialCount = 0;
    var wPCount = 0;
    var bPCount = 0;
    var wMonCount = 0;
    var bMonCount = 0;

    for(index = 0; index < 120; index++) {
        var iSq = position[index];

        switch(iSq) {
            case Pieces.wN:
                MaterialCount += 1000;
                break;
            case Pieces.wP:
                MaterialCount += 3000;
                wPCount += 1;
                break;
            case Pieces.wG:
                MaterialCount += 5000;
                break;
            case Pieces.wL:
                MaterialCount += 7000;
                break;
            case Pieces.wS:
                MaterialCount += 10000;
                break;
            case Pieces.wK:
                MaterialCount += 20000;
                break;
            case Pieces.wQ:
                MaterialCount += 20000;
                break;
            case Pieces.bN:
                MaterialCount -= 1000;
                break;
            case Pieces.bP:
                MaterialCount -= 3000;
                bPCount += 1;
                break;
            case Pieces.bG:
                MaterialCount -= 5000;
                break;
            case Pieces.bL:
                MaterialCount -= 7000;
                break;
            case Pieces.bS:
                MaterialCount -= 1000;
                break;
            case Pieces.bK:
                MaterialCount -= 20000;
                break;
            case Pieces.bQ:
                MaterialCount -= 20000;
                break;

        }
    }

    if(wPCount == 2) {
        MaterialCount += 100;
    }
    if(bPCount == 2) {
        MaterialCount -= 100;
    }

    if(wMonCount == 2) {
        MaterialCount += 2000;
    }
    if(bMonCount == 2) {
        MaterialCount -= 2000;
    }

    return MaterialCount;

}

function CountRelValue(position) {

    var count = 0;
    var index = 0;
    var blIndex;
    var pce;
    var relval;

    for(index = 0; index < 120; index++) {
        
        blIndex = 0;
        pce = position[index];
        blIndex = 120 - index;
        
        switch(pce) {
            case Pieces.wN: count += NTable[index]; break;
            case Pieces.wP: count += PTable[index]; break;
            case Pieces.wG: count += GTable[index]; break;
            case Pieces.wL: count += LTable[index]; break;
            case Pieces.wS: count += STable[index]; break;
            case Pieces.wQ: count += QTable[index]; break;
            case Pieces.wK: count += KTable[index]; break;
            case Pieces.bN: count -= NTable[blIndex]; break;
            case Pieces.bP: count -= PTable[blIndex]; break;
            case Pieces.bG: count -= GTable[blIndex]; break;
            case Pieces.bL: count -= LTable[blIndex]; break;
            case Pieces.bS: count -= STable[blIndex]; break;
            case Pieces.bQ: count -= QTable[blIndex]; break;
            case Pieces.bK: count -= KTable[blIndex]; break;
            default: break;
        }

    }

    relval = count;

    return relval;


}

const NTable = [

    null, null, null, null, null, null, null, null, null, null, 
    null, null, null, null, null, null, null, null, null, null, 
    null,    0,    0,    0,    0,    0,    0,    0,    0, null, 
    null,    0,   10,    5,   10,   10,    5,   10,    0, null, 
    null,   10,   20,   40,   50,   50,   40,   20,   10, null, 
    null,   10,   10,   30,  100,  100,   30,   10,   10, null, 
    null,   20,   20,   30,  150,  150,   30,   20,   20, null, 
    null,   10,   10,   10,   10,   10,   10,   10,   10, null, 
    null,    5,    5,   10,    5,    5,   10,    5,    5, null, 
    null,   10,    5,   10,   10,   10,   10,    5,   10, null, 
    null, null, null, null, null, null, null, null, null, null, 
    null, null, null, null, null, null, null, null, null, null
    
];

const PTable = [

    null, null, null, null, null, null, null, null, null, null, 
    null, null, null, null, null, null, null, null, null, null, 
    null,   10,   10,   10,   10,   10,   10,   10,   15, null, 
    null,   10,   15,   50,   10,   10,   50,   15,   10, null, 
    null,   10,  100,   15,   10,   10,   15,  100,   10, null, 
    null,   10,   10,   10,  500,  500,   10,   10,   10, null, 
    null,   10,   10,   10,  500,  500,   10,   10,   10, null, 
    null,   10,   10,   15,   10,   10,   15,   10,   10, null, 
    null,   10,   15,   10,   10,   10,   10,   15,   10, null, 
    null,   10,   10,   10,   10,   10,   10,   10,   10, null, 
    null, null, null, null, null, null, null, null, null, null, 
    null, null, null, null, null, null, null, null, null, null
    
];

const GTable = [

    null, null, null, null, null, null, null, null, null, null, 
    null, null, null, null, null, null, null, null, null, null, 
    null,   10,   10,   10,   50,   50,   10,   10,   10, null, 
    null,   10,   10,   10,  200,  200,   10,   10,   10, null, 
    null,   50,  200,  100,   10,   10,  100,  200,   50, null, 
    null,   50,   10,   10,  500,  500,   10,   10,   50, null, 
    null,   50,   50,   10,  500,  500,   10,   50,   50, null, 
    null,   10,   10,   10,   10,   10,   10,   10,   10, null, 
    null,   50,   50,   10,   50,   50,   10,   50,   50, null, 
    null,   50,   50,   10,   50,   50,   10,   50,   50, null, 
    null, null, null, null, null, null, null, null, null, null, 
    null, null, null, null, null, null, null, null, null, null
    
];

const LTable = [

    null, null, null, null, null, null, null, null, null, null, 
    null, null, null, null, null, null, null, null, null, null, 
    null,   20,   20,   50,   20,   20,   50,   20,   20, null, 
    null,   15,   15,  100,   15,   15,  100,   15,   15, null, 
    null,   10,   10,   80,   10,   10,   80,   10,   10, null, 
    null,   10,   10,   50,   20,   20,   50,   10,   10, null, 
    null,   10,   10,   50,   20,   20,   50,   10,   10, null, 
    null,  100,   80,   80,   50,   50,   80,   80,  100, null, 
    null,   10,   10,   70,   10,   10,   70,   10,   10, null, 
    null,   50,   50,   60,   50,   50,   60,   50,   50, null, 
    null, null, null, null, null, null, null, null, null, null, 
    null, null, null, null, null, null, null, null, null, null
    
];

const STable = [

    null, null, null, null, null, null, null, null, null, null, 
    null, null, null, null, null, null, null, null, null, null, 
    null,  100,   10,   60,  100,  100,   60,   10,  100, null, 
    null,   10,   20,   70,   10,   10,   70,   20,   10, null, 
    null,   10,   10,   80,   10,   10,   80,   10,   10, null, 
    null,   10,   10,   80,  100,  100,   80,   10,   10, null, 
    null,   10,   10,   80,  100,  100,   80,   10,   10, null, 
    null,   70,   80,  100,   80,   80,  100,   80,   70, null, 
    null,   10,   20,   60,   10,   10,   60,   20,   10, null, 
    null,  100,   10,   50,  100,  100,   50,   10,  100, null, 
    null, null, null, null, null, null, null, null, null, null, 
    null, null, null, null, null, null, null, null, null, null
    
];

const QTable = [

    null, null, null, null, null, null, null, null, null, null, 
    null, null, null, null, null, null, null, null, null, null, 
    null,   20,   15,   10,   20,   20,   20,   60,   50, null, 
    null,   10,   10,   10,   60,   60,   60,   80,   10, null, 
    null,    0,   10,   10,  100,  100,   90,   10,    0, null, 
    null,    0,    0,   10,  500,  500,   10,    0,    0, null, 
    null,    0,    0,    0,  500,  500,    0,    0,    0, null, 
    null,    0,    0,    0,    0,    0,    0,    0,    0, null, 
    null,    0,    0,    0,    0,    0,    0,    0,    0, null, 
    null,   10,   10,    0,   10,   10,    0,   10,   10, null, 
    null, null, null, null, null, null, null, null, null, null, 
    null, null, null, null, null, null, null, null, null, null
    
];

const KTable = [

    null, null, null, null, null, null, null, null, null, null, 
    null, null, null, null, null, null, null, null, null, null, 
    null,   50,   60,   20,   20,   20,   10,   15,   20, null, 
    null,   10,   80,   60,   60,   60,   10,   10,   10, null, 
    null,    0,   10,   90,  100,  100,   10,   10,    0, null, 
    null,    0,    0,   10,  500,  500,   10,    0,    0, null, 
    null,    0,    0,    0,  500,  500,    0,    0,    0, null, 
    null,    0,    0,    0,    0,    0,    0,    0,    0, null, 
    null,    0,    0,    0,    0,    0,    0,    0,    0, null, 
    null,   10,   10,    0,   10,   10,    0,   10,   10, null, 
    null, null, null, null, null, null, null, null, null, null, 
    null, null, null, null, null, null, null, null, null, null
    
];

function PrintVirtualBoard(move) {

    var sq;
    var rank;
    var file;
    var piece;

    console.log("Virtual Board: Move " + move);

    for (rank = RANKS.R_8; rank >= RANKS.R_1; rank--) {
        var line = ((rank+1) + " ");
        for (file = FILES.F_A; file <= FILES.F_H; file++) {
            sq = FindSq120(file, rank);
            piece = VirtualBoard[sq];
            line += (" " + PceChar[piece] + " ");
        }
        console.log(line);
    }

    var line = "  ";
    for(file = FILES.F_A; file <= FILES.F_H; file++) {
        line += (' ' + FileChar[file] + ' ');
    }
    console.log(line);

}