$("#SetFPN").click(function () {
    var fpnString = $("#FPNIn").val();
    NewGame(fpnString);
    console.log("Custom Position set OK!");
});

$("#NewGameAsWhite").click(function () {
    NewGame(StartPosition);
    Computer.Side = Colour.Black;
    console.log("New Game set OK!");
});

$("#NewGameAsBlack").click(function () {
    NewGame(FlippedPosition);
    Computer.Side = Colour.White;
    console.log("New Game set OK!")
    // ComputerMove();
});

$("#Takeback").click(function () {
    TakeMove();
});

$("#EnterMove").click(function () {
    var move = $("#MoveIn").val();
    EnterMove(move);
    console.log("Move set OK!");
})

// MakeGUISquare: Creates a div to represent a square on the GUI.

function MakeGUISquare(light, file, rank) {
    
    var Square = document.createElement('div');
    var r2str = rank + 1;
    var f2str = file + 1;

    Square.className += 'Square';

    Square.className += ' rank' + r2str;
    Square.className += ' file' + f2str;

    if (light > 0) {
        if (IsInFortress(FindSq120(file,rank)) == true) {
            Square.className += ' LightRed';
        } else if (IsInOutpost(FindSq120(file,rank)) > 0) {
            Square.className += ' LightBlue';
        } else {
            Square.className += ' Light';
        }
        
        Square.className += ' Light';
    } else {
        if (IsInFortress(FindSq120(file,rank)) == true) {
            Square.className += ' DarkRed';
        } else if (IsInOutpost(FindSq120(file,rank)) > 0) {
            Square.className += ' DarkBlue';
        } else {
            Square.className += ' Dark';   
        }
    }

    document.getElementById('Board').appendChild(Square);

}

// ClearGUIPieces: Removes all pieces from the GUI.

function ClearGUIPieces() {
    $('.Piece').remove();
}

// RenderBoardPieces: Places the game pieces on the GUI Board according to the current position.

var currentFPN = "qg1pp1gk/nn1nn1nn/8/8/8/8/NN1NN1NN/KG1PP1GQ w";

function RenderBoardPieces() {
    
    var sq;
    var file, rank;
    var rankName;
    var fileName;
    var imgString;
    var pce;

    ClearGUIPieces();

    for(sq = 0; sq < 120; ++sq) {
        pce = square120[sq];
        file = filearray[sq];
        rank = rankarray[sq];

        if(pce >= Pieces.wN && pce <= Pieces.bK) {
            AddGUIPiece(sq, pce);
        }
    }

}

function SetSqSelected(sq) {

    $('.Square').each( function(index) {
        if( (rankarray[sq] == 7 - Math.round($(this).position().top/80)) 
        && ( (filearray[sq] == Math.round($(this).position().left/80)))) {
            $(this).addClass('SqSelected');
        }
    });

    // console.log("Set Square Selected");

}

function DeselectSq(sq) {

    $('.Square').each( function(index) {
        if( (rankarray[sq] == 7 - Math.round($(this).position().top/80)) 
        && ( (filearray[sq] == Math.round($(this).position().left/80)))) {
            $(this).removeClass('SqSelected');
        }
    });

}

var UserMoveFrom = Squares.NO_SQ;
var UserMoveTo = Squares.NO_SQ;

function ClickedSquare(pageX, pageY) {
    // console.log('Clicked Square at' + pageX + ',' + pageY);
    var position = $('#Board').position();
    var workedX = Math.floor(position.left);
    var workedY = Math.floor(position.top);

    pageX = Math.floor(pageX);
    pageY = Math.floor(pageY);

    var file = Math.floor((pageX - workedX) / 80);
    var rank = 7 - Math.floor((pageY - workedY) / 80);

    var sq = FindSq120(file, rank);

    // console.log('Clicked Square: ' + PrintSq(sq));

    SetSqSelected(sq);

    return sq;
}

$(document).on('click', '.Piece', function (e) {
    // console.log('Piece Click');

    if(UserMoveFrom == Squares.NO_SQ) {
        UserMoveFrom = ClickedSquare(e.pageX, e.pageY);
        // console.log("User Move From Set: " + PrintSq(UserMoveFrom))
    } else {
        UserMoveTo = ClickedSquare(e.pageX, e.pageY);
        // console.log("User Move To Set: " + PrintSq(UserMoveTo));
        MakeUserMove();
    }

});

$(document).on('click', '.Square', function (e) {
    // console.log('Square Click');

    if(UserMoveFrom != Squares.NO_SQ) {
        UserMoveTo = ClickedSquare(e.pageX, e.pageY);
        // console.log("User Move To Set: " + PrintSq(UserMoveTo));
        MakeUserMove();
    }

});

function MakeUserMove() {
   
    var index;

    if(UserMoveFrom != Squares.NO_SQ && UserMoveTo != Squares.NO_SQ) {
        
        // console.log("User Move: " + PrintSq(UserMoveFrom) + PrintSq(UserMoveTo))

        var legal = LookupMove(UserMoveFrom, UserMoveTo);

        if(legal == true) {
            MakeMove(UserMoveFrom, UserMoveTo);
        } else if (legal == false) {
            PlayErrorSFX();
        }

        DeselectSq(UserMoveFrom);
        DeselectSq(UserMoveTo);

        UserMoveFrom = Squares.NO_SQ;
        UserMoveTo = Squares.NO_SQ;

    }

}

// function PieceIsOnSq(sq, top, left) {

//     if( (rankarray[sq] == 7 - Math.round($(this).position().top/80)) 
//         && ( (filearray[sq] == Math.round($(this).position().left/80)))) {
//            return true;
//         } else {
//             return false;
//         }

// }

function RemoveGUIPiece(sq) {

    $('.Piece').each( function(index) {
        if( (rankarray[sq] == 7 - Math.round($(this).position().top/80)) 
        && ( (filearray[sq] == Math.round($(this).position().left/80)))) {
           $(this).remove();
        }
    });

}

function AddGUIPiece(sq, pce) {
    
    var file = filearray[sq];
    var rank = rankarray[sq];
    var fileName = "rank" + (rank+1);
    var rankName = "file" + (file+1);
    var pieceFileName;
    pieceFileName = "images/pieces/" + SideChar[PieceCol[pce]] + PceChar[pce].toUpperCase() + ".png";
    var imgString = '<image src="' + pieceFileName + '" class="Piece ' + rankName + ' ' + fileName + '"/>';
    
    $("#Board").append(imgString);

}

function PromoteGUIPiece(sq, prompce) {

    RemoveGUIPiece(sq);
    AddGUIPiece(sq, prompce);

}

function UpdateFPNOut() {

    var rank = RANKS.R_8;
    var file = FILES.F_A;
    var count = 0;
    var fpnString = '';
    var sq;

    for(rank = RANKS.R_8; rank >= RANKS.R_1; rank--) {
        count = 0;
        for(file = FILES.F_A; file <= FILES.F_H; file++) {
            sq = FindSq120(file, rank);
            
            if(square120[sq] == Pieces.Empty) {
                count++;
            } else if(square120[sq] != Pieces.Empty) {
                if(count > 0) {
                    fpnString += count;
                    count = 0;
                }
                
                switch(square120[sq]) {
                    case Pieces.bN: fpnString += 'n'; break;
                    case Pieces.bP: fpnString += 'p'; break;
                    case Pieces.bG: fpnString += 'g'; break;
                    case Pieces.bL: fpnString += 'l'; break;
                    case Pieces.bS: fpnString += 's'; break;
                    case Pieces.bQ: fpnString += 'q'; break;
                    case Pieces.bK: fpnString += 'k'; break;
                    case Pieces.wN: fpnString += 'N'; break;
                    case Pieces.wP: fpnString += 'P'; break;
                    case Pieces.wG: fpnString += 'G'; break;
                    case Pieces.wL: fpnString += 'L'; break;
                    case Pieces.wS: fpnString += 'S'; break;
                    case Pieces.wQ: fpnString += 'Q'; break;
                    case Pieces.wK: fpnString += 'K'; break;
                }

            }
        }
        if(count > 0) {
            fpnString += count;
        }
        if(rank > RANKS.R_1) {
            fpnString += '/';
        }
        count = 0;
    }

    fpnString += ' ';

    if(Board.Side == Colour.White) {
        fpnString += 'w';
    } else if (Board.Side == Colour.Black) {
        fpnString += 'b';
    }
    
    currentFPN = fpnString;

    PrintFPNOut();

}

function PrintFPNOut() {

    UpdateFPNGUI();
    document.getElementById("fpnout").innerHTML = currentFPN;

}

function PrintLastMove(move) {

    if(move == undefined) {
        move = '';
    }

    document.getElementById("moveprint").innerHTML = move;

}

function UpdateMoveListGUI() {

    var total = HistNotation.length;
    var index;
    var move = 0;
    var list = '';

    document.getElementById("MoveList").innerHTML = '';

    for(index = 0; index < total; index++) {
        if(isEven(index) == false) {
            move++;
            if(HistNotation[index] != undefined) {
                list += '  ' + move + '. ' + HistNotation[index];
            } 
        } else {
            if(HistNotation[index] != undefined) {
                list += ', ' + HistNotation[index] + '</br>';
            }
        }
    }

    document.getElementById("MoveList").innerHTML = list;

}

function EnterMove(move) {

    var from;
    var to;
    var file;
    var rank;
    var charCount;

    charCount = move.length;

    for(index = 0; index < 3; index++) {
        switch(move[index]) {
            case 'a': file = FILES.F_A; break;
            case 'b': file = FILES.F_B; break;
            case 'c': file = FILES.F_C; break;
            case 'd': file = FILES.F_D; break;
            case 'e': file = FILES.F_E; break;
            case 'f': file = FILES.F_F; break;
            case 'g': file = FILES.F_G; break;
            case 'h': file = FILES.F_H; break;
            case '1': rank = RANKS.R_1; break;
            case '2': rank = RANKS.R_2; break;
            case '3': rank = RANKS.R_3; break;
            case '4': rank = RANKS.R_4; break;
            case '5': rank = RANKS.R_5; break;
            case '6': rank = RANKS.R_6; break;
            case '7': rank = RANKS.R_7; break;
            case '8': rank = RANKS.R_8; break;
            default: break;
        }
    }

    from = FindSq120(file, rank);

    console.log(from);

    for(index = 0; index < charCount; index++) {
        switch(move[index]) {
            case 'a': file = FILES.F_A; break;
            case 'b': file = FILES.F_B; break;
            case 'c': file = FILES.F_C; break;
            case 'd': file = FILES.F_D; break;
            case 'e': file = FILES.F_E; break;
            case 'f': file = FILES.F_F; break;
            case 'g': file = FILES.F_G; break;
            case 'h': file = FILES.F_H; break;
            case '1': rank = RANKS.R_1; break;
            case '2': rank = RANKS.R_2; break;
            case '3': rank = RANKS.R_3; break;
            case '4': rank = RANKS.R_4; break;
            case '5': rank = RANKS.R_5; break;
            case '6': rank = RANKS.R_6; break;
            case '7': rank = RANKS.R_7; break;
            case '8': rank = RANKS.R_8; break;
            default: break;
        }
    }

    to = FindSq120(file, rank);

    console.log(to);

    var legal = LookupMove(from, to);

    if(legal == true) {
        MakeMove(from, to);
    } else if (legal == false) {
        PlayErrorSFX();
    }

}

function UpdateFPNGUI() {

    pos = $('#UnderBoard');

    if (Board.Side == Colour.Black) {
        pos.removeClass();
        pos.addClass('posBlack');
    } else if (Board.Side == Colour.White) {
        pos.removeClass();
        pos.addClass('posWhite');
    } else {
        pos.removeClass();
        pos.addClass('posBoth');
    }

}

function UpdateEndGameGUI() {

    elem = $('#UnderBoard');

    if(Board.Draw == true) {
        elem.removeClass();
        elem.addClass('posBoth');
        $("#Result").html('Game Over: DRAW');
    }
    if(Board.Winner == Colour.White) {
        elem.removeClass();
        elem.addClass('posWhite');
        $("#Result").html('Game Over: WHITE wins!');
    }
    if(Board.Winner == Colour.Black) {
        elem.removeClass();
        elem.addClass('posBlack');
        $("#Result").html('Game Over: BLACK wins!');
    }

}

function ClearEndGameGUI() {
    $("#Result").html('');
    $("#UnderBoard").removeClass();
}