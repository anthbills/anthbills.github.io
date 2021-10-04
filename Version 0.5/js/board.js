// Definitions

const Colour = { White: 0, Black: 1, Both: 2 };

var Board = {};

Board.Side = Colour.Both;
Board.Material = new Array(2);
Board.Fortress = Colour.Both;
Board.Winner = 0;
Board.Draw = false;
Board.Turn = 0;
Board.Ply = 0;
Board.Move = 0;

function ChangeSide() {

    if (Board.Side == Colour.White) {
        Board.Side = Colour.Black
        
    } else if (Board.Side == Colour.Black) {
        Board.Side = Colour.White
        
    } else {
        Board.Side = Colour.Both
        
    }

}

function ApplyPromotion() {

    index = 0;

    promote = false;

    if (fortressStat == wctl || fortressStat == bctl) {
        for (index = 0; index < 120; index++) {
            if(IsInFortress(index) == true) {
                switch(square120[index]) {
                    case Pieces.Empty: break;
                    case Pieces.wP: square120[index] = Pieces.wL; PromoteGUIPiece(index, Pieces.wL); promote = true; break;
                    case Pieces.wG: square120[index] = Pieces.wS; PromoteGUIPiece(index, Pieces.wS); promote = true; break;
                    case Pieces.bP: square120[index] = Pieces.bL; PromoteGUIPiece(index, Pieces.bL); promote = true; break;
                    case Pieces.bG: square120[index] = Pieces.bS; PromoteGUIPiece(index, Pieces.bS); promote = true; break;
                }
            }
        }
    }

    if (promote == true) {
        PlayPromoteSFX();
    }

}

// Squares

const Squares = {
    a1 : 21, b1 : 22, c1 : 23, d1 : 24, e1 : 25, f1 : 26, g1 : 27, h1 : 28,
    a2 : 31, b2 : 32, c2 : 33, d2 : 34, e2 : 35, f2 : 36, g2 : 37, h2 : 38,
    a3 : 41, b3 : 42, c3 : 43, d3 : 44, e3 : 45, f3 : 46, g3 : 47, h3 : 48,
    a4 : 51, b4 : 52, c4 : 53, d4 : 54, e4 : 55, f4 : 56, g4 : 57, h4 : 58,
    a5 : 61, b5 : 62, c5 : 63, d5 : 64, e5 : 65, f5 : 66, g5 : 67, h5 : 68,
    a6 : 71, b6 : 72, c6 : 73, d6 : 74, e6 : 75, f6 : 76, g6 : 77, h6 : 78,
    a7 : 81, b7 : 82, c7 : 83, d7 : 84, e7 : 85, f7 : 86, g7 : 87, h7 : 88,
    a8 : 91, b8 : 92, c8 : 93, d8 : 94, e8 : 95, f8 : 96, g8 : 97, h8 : 98, NO_SQ : 99, OUTOFBOUND : 100
};

const square64 = [
    21, 22, 23, 24, 25, 26, 27, 28,
    31, 32, 33, 34, 35, 36, 37, 38,
    41, 42, 43, 44, 45, 46, 47, 48,
    51, 52, 53, 54, 55, 56, 57, 58,
    61, 62, 63, 64, 65, 66, 67, 68,
    71, 72, 73, 74, 75, 76, 77, 78,
    81, 82, 83, 84, 85, 86, 87, 88,
    91, 92, 93, 94, 95, 96, 97, 98
];

var square120 = new Array(120);

const OutOfBounds = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    29, 30, 39, 40, 49, 50, 59, 60, 69, 70,
    79, 80, 89, 90, 99, 100, 101, 102, 103,
    104, 105, 106, 107, 108, 109, 110,
    111, 112, 113, 114, 115, 116, 117, 118, 119
];

const FILES = { F_A: 0, F_B: 1, F_C: 2, F_D: 3, F_E: 4, F_F: 5, F_G: 6, F_H: 7 };
const RANKS = { R_1: 0, R_2: 1, R_3: 2, R_4: 3, R_5: 4, R_6: 5, R_7: 6, R_8: 7 };

var RankChar = "12345678";
var FileChar = "abcdefgh";

const filearray = [
    -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1,
    -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1,
    -1 ,  0 ,  1 ,  2 ,  3 ,  4 ,  5 ,  6 ,  7 , -1,
    -1 ,  0 ,  1 ,  2 ,  3 ,  4 ,  5 ,  6 ,  7 , -1,
    -1 ,  0 ,  1 ,  2 ,  3 ,  4 ,  5 ,  6 ,  7 , -1,
    -1 ,  0 ,  1 ,  2 ,  3 ,  4 ,  5 ,  6 ,  7 , -1,
    -1 ,  0 ,  1 ,  2 ,  3 ,  4 ,  5 ,  6 ,  7 , -1,
    -1 ,  0 ,  1 ,  2 ,  3 ,  4 ,  5 ,  6 ,  7 , -1,
    -1 ,  0 ,  1 ,  2 ,  3 ,  4 ,  5 ,  6 ,  7 , -1,
    -1 ,  0 ,  1 ,  2 ,  3 ,  4 ,  5 ,  6 ,  7 , -1,
    -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1,
    -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1
];

const rankarray = [
    -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1,
    -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1,
    -1 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 ,  0 , -1,
    -1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 ,  1 , -1,
    -1 ,  2 ,  2 ,  2 ,  2 ,  2 ,  2 ,  2 ,  2 , -1,
    -1 ,  3 ,  3 ,  3 ,  3 ,  3 ,  3 ,  3 ,  3 , -1,
    -1 ,  4 ,  4 ,  4 ,  4 ,  4 ,  4 ,  4 ,  4 , -1,
    -1 ,  5 ,  5 ,  5 ,  5 ,  5 ,  5 ,  5 ,  5 , -1,
    -1 ,  6 ,  6 ,  6 ,  6 ,  6 ,  6 ,  6 ,  6 , -1,
    -1 ,  7 ,  7 ,  7 ,  7 ,  7 ,  7 ,  7 ,  7 , -1,
    -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1,
    -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1
];

// FindSq120: Takes a File and Rank and returns the square for that file rank in square120 format

function FindSq120(f, r) {
    var file = 21 + f;
    var rank = r * 10;

    var sq = file + rank;

    // console.log("FindSq120 Test: Sq is " + sq);
    return sq;
}

// FindFile and FindRank: Takes a square and returns the file or rank that square belongs to if on the board.

function FindFile(sq) {

    var file;

    if (square120[sq] != Squares.OUTOFBOUND) {
        file = filearray[sq];
        return file;
    } else if (square120[sq] == Squares.OUTOFBOUND) {
        console.log("FindFile Error! :(");
    }

    return file;
}

function FindRank(sq) {

    var rank;

    if (square120[sq] != Squares.OUTOFBOUND) {
        rank = rankarray[sq];
        return rank;
    } else if (square120[sq] == Squares.OUTOFBOUND) {
        console.log("FindRank Error! :(");
    }

}

function PrintSq(sq) {

    var file;
    var rank;
    var output;

    file = FindFile(sq);
    rank = FindRank(sq);

    output = FileChar[file] + RankChar[rank];

    return output;

}

// Zones

const ntrl = 0;
const wctl = 1;
const bctl = 2;
const cont = 3;

var OutpostStat = [ ntrl, ntrl, ntrl, ntrl, ntrl, ntrl ];

var fortressStat = ntrl;

const zoneMap = [
    0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,
    0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,
    0 , 1 , 1 , 0 , 2 , 2 , 0 , 3 , 3 , 0 ,
    0 , 1 , 1 , 0 , 2 , 2 , 0 , 3 , 3 , 0 ,
    0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,
    0 , 0 , 0 , 0 , 7 , 7 , 0 , 0 , 0 , 0 ,
    0 , 0 , 0 , 0 , 7 , 7 , 0 , 0 , 0 , 0 ,
    0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,
    0 , 4 , 4 , 0 , 5 , 5 , 0 , 6 , 6 , 0 ,
    0 , 4 , 4 , 0 , 5 , 5 , 0 , 6 , 6 , 0 ,
    0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,
    0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 
];

// IsInFortress: Checks if a given square is inside the Fortress or not

function IsInFortress(sq) {

    if(zoneMap[sq] != 7) {
        return false;
    }
    return true;

}

// IsInOutpost: Checks if a given square is inside an outpost and returns the outpost it belongs to if any

function IsInOutpost(sq) {

    var OutpostNum;

    OutpostNum = zoneMap[sq];

    return OutpostNum;

}

// UpdateFortressStat: Looks up pieces on fortress squares and updates the Fortress Status accordingly

function UpdateFortressStat(position) {
    
    var index;
    var update = 0;

    for (index = 0; index < 120; index++) {
        if(IsInFortress(index) == true) {
            if(FindPieceCol(index, position) == Colour.White) {
                update = update + 1;
                break;
            }
        }
    }

    for (index = 0; index < 120; index++) {
        if(IsInFortress(index) == true) {
            if(FindPieceCol(index, position) == Colour.Black) {
                update = update + 2;
                break;
            }
        }
    }

    if(update == 1) {
        Board.Fortress == Colour.White;
    } else if (update == 2) {
        Board.Fortress == Colour.Black;
    } else {
        Board.Fortress == Colour.Both;
    }

    fortressStat = update;
}

// UpdateOutpostStat: Looks up pieces in a particular outpost and updates the Outpost Status accordingly

function UpdateOutpostStat(Outpost, position) {

    var index;
    var update = 0;

    for(index = 0; index < 120; index++) {
        if(IsInOutpost(index) == Outpost) {
            if (FindPieceCol(index, position) == Colour.White) {
                update += 1;
                break;
            }
        }
    }

    for(index = 0; index < 120; index++) {
        if(IsInOutpost(index) == Outpost) {
            if (FindPieceCol(index, position) == Colour.Black) {
                update += 2;
                break;
            }
        }
    }
    
    if(update == 0) {update = ntrl;}
    if(update == 1) {update = wctl;}
    if(update == 2) {update = bctl;}
    if(update == 3) {update = cont;}

    Outpost -= 1;
    OutpostStat[Outpost] = update;

}

// UpdateAllOutposts: Applies UpdateOutpostStat function for every Outpost

function UpdateAllOutposts(position) {

    var Outpost;

    for (Outpost = 1; Outpost < 7; Outpost++) {
        UpdateOutpostStat(Outpost, position);
    }

}

function GetOutpostColor(outpost) {

    if(outpost == 0) {
        return;
    }

    outpost -=1

    if(OutpostStat[outpost] == ntrl) {
        return Colour.Both;
    } else if(OutpostStat[outpost] == cont) {
        return Colour.Both;
    } else if(OutpostStat[outpost] == wctl) {
        return Colour.White;
    } else if(OutpostStat[outpost] == bctl) {
        return Colour.Black;
    }

}

// CheckZoneCtrl: Counts the amount of zones controlled by a particular side

function CheckZoneCtrl(side) {

    var ZoneCount = 0;
    var index;
    
    if(side == Colour.White) {
        side = wctl;
    } else if (side == Colour.Black) {
        side = bctl;
    } else if (side == Colour.Both) {
        side = ntrl;
    }

    for (index = 0; index < 6; index++) {
        if (OutpostStat[index] == side) {
            ZoneCount++;
        }
    }

    if (fortressStat == side) {
        ZoneCount++;
    }

    // console.log(ZoneCount);
    return ZoneCount;

}

function CheckFortCtrl() {

    if(fortressStat == wctl) {
        Board.Fortress = Colour.White;
        return;
    } else if (fortressStat == bctl) {
        Board.Fortress = Colour.Black;
        return;
    } else {
        Board.Fortress = Colour.Both;
        return;
    }

}

// Pieces

const Pieces = { Empty : 0, wN : 1 , wP : 2, wG : 3, wL : 4, wS : 5, wQ : 6, wK : 7, bN : 8, bP : 9, bG : 10, bL : 11, bS : 12, bQ : 13, bK : 14 }

const PieceCol = [ Colour.Both, Colour.White, Colour.White, Colour.White, Colour.White, Colour.White, Colour.White, Colour.White, Colour.Black, Colour.Black, Colour.Black, Colour.Black, Colour.Black, Colour.Black, Colour.Black ];
const PieceSlide = [ false, false, true, false, true, true, false, false, false, true, false, true, true, false, false ];

const NSKQDir = [ -1, -9, -10, -11, 11, 10, 9, 1 ];
const GrdnDir = [ -2, -8, -12, -18, -19, -20, -21, -22, 2, 8, 12, 18, 19, 20, 21, 22 ];
const PikeDir = [ -9, -11, 9, 11 ];
const LncrDir = [ -1, -10, 1, 10 ];

const DirNum = [ 0 , 8 , 4 , 16 , 4 , 8 , 8 , 8 , 8 , 4 , 16 , 4 , 8 , 8 , 8 ];
const PieceDir = [ 0, NSKQDir, PikeDir, GrdnDir, LncrDir, NSKQDir, NSKQDir, NSKQDir, NSKQDir, PikeDir, GrdnDir, LncrDir, NSKQDir, NSKQDir, NSKQDir ];


// FindPieceCol: Finds the colour of the piece on a given square

function FindPieceCol(sq, position) {

    if(position[sq] == Squares.OUTOFBOUND) {
        return Squares.OUTOFBOUND;
    } else if (position[sq] == 0) {
        return Colour.Both;
    } else if (position[sq] < 7) {
        return Colour.White;
    } else if (position[sq] > 7) {
        return Colour.Black;
    }

}

var PceChar = ".NPGLSQKnpglsqk";
var SideChar = "wb-";

// ResetPosition: Resets Squares and Position Data to null

function ResetPosition() {

    var index = 0;

    for(index = 0; index < 120; ++index) {
        square120[index] = Pieces.Empty;
    }

    for(index = 0; index < 120; ++index) {
        square120[OutOfBounds[index]] = Squares.OUTOFBOUND;
    }

    for(index = 0; index < 2; ++index) {
        Board.Material[index] = 0;
    }

    Board.Side = Colour.Both;

    OutpostStat = [ ntrl, ntrl, ntrl, ntrl, ntrl, ntrl ];
    fortressStat = ntrl;

    
    //test
    // console.log("Reset Position Test");
    // console.log(square120);

}

var StartPosition = "qg1pp1gk/nn1nn1nn/8/8/8/8/NN1NN1NN/KG1PP1GQ w";

var FlippedPosition = "QG1PP1GK/NN1NN1NN/8/8/8/8/nn1nn1nn/kg1pp1gq w";

// ParsePosition: Sets up board according to an FPN (Full Position Notation) string

function ParsePosition(fpn) {

    var rank = RANKS.R_8;
    var file = FILES.F_A;
    var piece = 0;
    var count = 0;
    var fpnCnt = 0;

    ResetPosition();

    while ((rank >= RANKS.R_1) && fpnCnt < fpn.length) {
        count = 1;
        switch (fpn[fpnCnt]) {
            case 'n': piece = Pieces.bN; break;
            case 'p': piece = Pieces.bP; break;
            case 'g': piece = Pieces.bG; break;
            case 'l': piece = Pieces.bL; break;
            case 's': piece = Pieces.bS; break;
            case 'q': piece = Pieces.bQ; break;
            case 'k': piece = Pieces.bK; break;
            case 'N': piece = Pieces.wN; break;
            case 'P': piece = Pieces.wP; break;
            case 'G': piece = Pieces.wG; break;
            case 'L': piece = Pieces.wL; break;
            case 'S': piece = Pieces.wS; break;
            case 'Q': piece = Pieces.wQ; break;
            case 'K': piece = Pieces.wK; break;

            // case '0': piece = Pieces.Empty; break;

            case '1': 
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
                piece = Pieces.Empty;
                count = fpn[fpnCnt].charCodeAt() - '0'.charCodeAt();
                break;

            case '/':
            case ' ':
                rank--;
                file = FILES.F_A;
                fpnCnt++;
                continue;
            
            default:
                console.log("FPN Error :(");
                return;
        }

        for (i = 0; i < count; i++) {
            if (piece != Pieces.Empty) {
                square120[FindSq120(file,rank)] = piece;
            }
            file++;
        }
            
        fpnCnt++;        
            
    }

    switch(fpn[fpnCnt]) {
        case 'w': Board.Side = Colour.White; break;
        case 'b': Board.Side = Colour.Black; break;
    }

    fpnCnt += 2;

    UpdateAllOutposts(square120);
    UpdateFortressStat(square120);
    CheckZoneCtrl(Board.Side);

    // console.log(OutpostStat);
    // console.log(fortressStat);
    
}


