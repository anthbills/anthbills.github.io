
const Computer = {};

var NoSide;

Computer.Side = NoSide;

var MoveList = [];
var MoveHist = [];
var HistNotation = [];

function InitMoveHistory() {
    ResetMoveList();
    Board.Turn = 0;
    Board.Ply = 0;
    console.log("Move History reset OK!");
}

function ResetMoveList() {
    MoveList = [];
}

function GetMoveFrom(moveNum) {
    var moveFrom;
    var moveStr;
    var moveSq;
    GenerateMoves(square120, Board.Side);
    moveStr = MoveList[moveNum];
    moveFrom = moveStr.substring(0, 2);
    moveSq = parseInt(moveFrom);
    return moveSq;
}

function GetMoveTo(moveNum) {
    var moveTo;
    var moveStr;
    var moveSq;
    GenerateMoves(square120, Board.Side);
    moveStr = MoveList[moveNum];
    moveTo = moveStr.substring(2, 4);
    moveSq = parseInt(moveTo);
    return moveSq;
}

function GenNonSlideMove(position, pce, from, to) {

    var toPce = position[to];

    if(pce == Pieces.wG || pce == Pieces.bG) {
        return;
    }

    if(position[to] == Squares.OUTOFBOUND) {
        return;
    }

    if(PieceCol[pce] == PieceCol[toPce]) {
        return;
    }

    if(position[to] == Pieces.Empty) {
        AddQuietMove(from, to);
        return;
    } else {
        AddCaptureMove(from, to, position);
        return;
    }

}

function GenGuardianMove(position, from, to) {

    UpdateAllOutposts(position);
    UpdateFortressStat(position);

    var pce = position[from];
    var toPce = position[to];
    var Outpost;
    var OPStat;
    var pceCol = PieceCol[pce];

    if(position[to] == Squares.OUTOFBOUND) {
        return;
    }

    if(PieceCol[pce] == PieceCol[toPce]) {
        return;
    }

    if(IsInFortress(to) == true) {
        if(fortressStat == cont) {
            return;
        }
        if(fortressStat == ntrl) {
            AddPromotionMove(from, to, position);
            return;
        }
        if(fortressStat == wctl && pceCol == Colour.White) {
            AddPromotionMove(from, to, position);
            return;
        }
        if(fortressStat == bctl && pceCol == Colour.Black) {
            AddPromotionMove(from, to, position);
            return;
        }
    }

    if(IsInOutpost(to) > 0) {
        UpdateAllOutposts(position);
        Outpost = IsInOutpost(to);
        OPCol = GetOutpostColor(Outpost);
        Outpost--;
        OPStat = OutpostStat[Outpost];
        if(OPStat == cont) {
            return;
        }
        if(OPStat != ntrl && OPCol != pceCol) {
            return;
        }
    }

    if(position[to] == Pieces.Empty) {
        AddQuietMove(from, to);
    } else {
        AddCaptureMove(from, to, position);
    }

}

function GenSlideMoves(position, side, pce, from, to, dir) {

    UpdateFortressStat(position);
    
    var SlideTo = to;
    var SlideFrom;
    var toPce;
    var Outpost;
    var OPStat;
    var OPCol;
    var SlideIndex = 0;
    var pceCol = PieceCol[pce];

    for(SlideIndex = 0; SlideIndex < 9; SlideIndex++) {
        
        SlideFrom = SlideTo;

        toPce = position[SlideTo];
        if(toPce == Squares.OUTOFBOUND) {
            break;
        }
        if(PieceCol[pce] == PieceCol[toPce]) {
            break;
        }
        if(IsInFortress(SlideTo) == true) {
            if(fortressStat != ntrl && fortressStat != cont) {
                if(fortressStat == wctl) {
                    if(pce == Pieces.bP) {
                        AddIntrusionMove(from, SlideTo, position);
                        break;
                    }
                    if(pce == Pieces.bL) {
                        AddIntrusionMove(from, SlideTo, position);
                        break;
                    }
                    if(pce == Pieces.bS) {
                        AddIntrusionMove(from, SlideTo, position);
                        break;
                    }
                } else {}
                if(fortressStat == bctl) {
                    if(pce == Pieces.wP) {
                        AddIntrusionMove(from, SlideTo, position);
                        break;
                    }
                    if(pce == Pieces.wL) {
                        AddIntrusionMove(from, SlideTo, position);
                        break;
                    }
                    if(pce == Pieces.wS) {
                        AddIntrusionMove(from, SlideTo, position);
                        break;
                    }
                } else {}
            } else {}
            
            if(pce == Pieces.wP || pce == Pieces.bP) {
                if(Board.Fortress == side || fortressStat == ntrl) {
                    AddPromotionMove(from, SlideTo, position);
                }
            }
        }
        if(IsInOutpost(SlideTo) > 0 && IsInOutpost(SlideTo) < 7) {
            UpdateAllOutposts(position);
            Outpost = IsInOutpost(SlideTo);
            OPCol = GetOutpostColor(Outpost);
            Outpost--;
            OPStat = OutpostStat[Outpost];
            if(OPStat != ntrl && OPStat != cont && OPCol != pceCol) {
                AddIntrusionMove(from, SlideTo, position);
                break;
            }
        }
        
        if(toPce == Pieces.Empty) {
            AddQuietMove(from, SlideTo);
        } else if (toPce != Pieces.Empty && PieceCol[toPce] != side) {
            AddCaptureMove(from, SlideTo, position);
            break;
        }

        SlideTo = SlideFrom + dir;

    }

    return;

}

function AddQuietMove(from, to) {

    var movefrom = from.toString();
    var moveto = to.toString();
    var moveName = movefrom + moveto;

    MoveList.push(moveName);

    // console.log("Quiet Move:" + NotateMove(from, to) );

}

function AddCaptureMove(from, to, position) {

    var movefrom = from.toString();
    var moveto = to.toString();
    var moveName = movefrom + moveto;

    MoveList.push(moveName);
    
    // console.log("Capture Move:" + NotateMove(from, to) );

}

function AddPromotionMove(from, to, position) {

    var movefrom = from.toString();
    var moveto = to.toString();
    var moveName = movefrom + moveto;

    MoveList.push(moveName);
    
    // console.log("Promotion Move:" + NotateMove(from, to) );

}

function AddIntrusionMove(from, to, position) {

    var movefrom = from.toString();
    var moveto = to.toString();
    var moveName = movefrom + moveto;

    MoveList.push(moveName);
    
    // console.log("Intrusion Move:" + NotateMove(from, to) );

}

function GenerateMoves(position, side) {

    var index;
    var pce;
    var pceDir;
    var movIndex;
    var to;

    UpdateFortressStat(position);
    UpdateAllOutposts(position);

    ResetMoveList();

    for(index = 0; index < 200; index++) {
        if(position[index] != Pieces.Empty && position[index] != Squares.OUTOFBOUND) {
            to = 0;
            pce = position[index];
            if(PieceCol[pce] == side) {
                pceDir = PieceDir[pce];
                for (movIndex = 0; movIndex < DirNum[pce]; movIndex++) {
                    dir = pceDir[movIndex];
                    to = index + dir;
                    if(pce == Pieces.wG || pce == Pieces.bG) {
                        GenGuardianMove(position, index, to);
                    }
                    if(PieceSlide[pce] == false) {
                        GenNonSlideMove(position, pce, index, to);
                    } else if(PieceSlide[pce] == true) {
                        GenSlideMoves(position, side, pce, index, to, dir);
                    }
                    
                }
            }
        }
    }

    return;

}

function ClearPiece(sq) {
    
    if(square120[sq] != Squares.OUTOFBOUND) {
        square120[sq] = Pieces.Empty;
    } else {
        console.log("Clear Piece error! :(")
    }
    
}

function NotateMove(from, to) {
    var index;
    var pceCount = 0;
    var pce = square120[from];
    var capture = '';
    var string;
    var char = PceChar[pce].toUpperCase();

    if(square120[to] != Pieces.Empty) {
        capture = 'x';
    }

    // if(pce == Pieces.wP || pce == Pieces.bP) {
    //     string = (char + capture + PrintSq(to));
    //     return string;
    // }

    // for(index = 0; index < 120; index++) {
    //     if (square120[index] == pce) {
    //         pceCount++;
    //     }
    // }

    // if (pceCount == 1) {
    //     string = (char + capture + PrintSq(to));
    //     return string;
    // }

    string = PrintSq(from) + char + capture + PrintSq(to);
    return string;

}

function SaveMove(turnNum, fpn, move) {

    MoveHist[turnNum] = fpn;
    HistNotation[turnNum] = move;

};

function MakeMove(from, to) {
    
    var pce = square120[from];

    if(PieceCol[pce] != Board.Side) {
        PlayErrorSFX();
        return;
    }

    if(from == to) {
        PlayErrorSFX();
        return;
    }

    if(square120[to] == Pieces.Empty) {
        PlayMoveSFX();
    } else {
        PlayCaptureSFX();
    }

    var notated;
    notated = NotateMove(from, to);
    console.log(notated);

    ClearPiece(from);
    ClearPiece(to);

    square120[to] = pce;

    UpdateFortressStat(square120);
    UpdateOutpostStat(square120);

    RemoveGUIPiece(from);
    AddGUIPiece(to, pce);

    ApplyPromotion();

    ChangeSide();

    Board.Turn++;

    if(Board.Ply == 1) {
        Board.Ply = 0;
        Board.Move++;
    } else {
        Board.Ply = 1;
    }

    UpdateFPNOut();

    // PrintBoardToConsole();

    SaveMove(Board.Turn, currentFPN, notated);

    PrintLastMove(notated);
    UpdateMoveListGUI();

    GenerateMoves(square120, Board.Side);
    
    if(CheckMoveCount() == 0) {
        if(Board.Side == Colour.White) {
            Board.Winner = Colour.Black;
        }
        if(Board.Side == Colour.Black) {
            Board.Winner = Colour.White;
        }
        GameOver();
    }

    // if(Computer.Side == Board.Side) {
    //     ComputerMove();
    // }

}

function TakeMove() {

    if(Board.Turn == 0) {
        PlayErrorSFX();
        console.log("Can't take back anymore moves!");
        console.log(MoveHist);
        return;
    }
    
    MoveHist.pop();
    HistNotation.pop();
    
    Board.Turn--;
    if(Board.Ply == 0) {
        Board.Ply = 1;
        Board.Move--;
    } else {
        Board.Ply == 0;
    }

    ChangeSide();

    var returnto = MoveHist[Board.Turn];
    var return2 = HistNotation[Board.Turn];

    ParsePosition(returnto);
    RenderBoardPieces();
    GenerateMoves(square120, Board.Side);
    UpdateFPNOut();
    PrintLastMove(return2);

    PlayBackSFX();

    console.log("Move Takeback OK!");
    console.log(MoveHist);

}

function LookupMove(from, to) {
    
    var movefrom = from.toString();
    var moveto = to.toString();
    var moveName = movefrom + moveto;
    var index;
    var legal = false;

    for(index = 0; index < 500; index++) {
        if(moveName == MoveList[index]) {
            legal = true;
            break;
        } else {
            legal = false;
        }
    }

    return legal;

}

function CheckMoveCount() {
    var moveCount = MoveList.length;
    return moveCount;
}

// function ComputerMove() {
//     moveCount = CheckMoveCount();
//     randomMove = Math.floor((Math.random() * moveCount) + 0);

//     move = MoveCoord[randomMove];

//     from = move[0];
//     to = move[1];

//     MakeMove(from, to);
// }

