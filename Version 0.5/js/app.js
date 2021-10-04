console.log("TressJS v0.5")

Init();

// Init: Calls all required functions for starting the game.

function Init() {
    Hello();
    InitGUISquares();
    console.log("Press New Game to start!");
}

// Hello: Says a warm greeting to anyone who opens the browser console.

function Hello() {
    var time = new Date();
    var hour = time.getHours();
    var greeting = "Good night!"
    
    if(hour < 20 ) {
        greeting = "Good evening!"
    }

    if(hour < 17) {
        greeting = "Good afternoon!"
    }

    if(hour < 12) {
        greeting = "Good morning!"
    }

    if(hour < 5) {
        greeting = "Good night!"
    }

    console.log(greeting);
}

// Sleep

function Sleep(ms) {
    var date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < ms);
} 

// New Game: Initialises a new game from a given position.

function NewGame(fpnStr) {
    ClearEndGameGUI();
    InitMoveHistory();
    ParsePosition(fpnStr);
    RenderBoardPieces();
    GenerateMoves(square120, Board.Side);
    UpdateFPNOut();
    PrintLastMove();
    HistNotation = [];
    UpdateMoveListGUI();
    console.log("Starting Position Set OK!");
    SaveMove(Board.Turn,fpnStr);
    PlayNewSFX();

}

function GameOver() {
    Board.Side = Colour.Both;
    UpdateEndGameGUI();
}

// var Square = document.createElement('div');
// Square.className += 'Square'
// Square.className += ' rank' + 1;
// Square.className += ' file' + 2;
// Square.className += ' LightBlue'
// document.getElementById('Board').appendChild(Square);

// InitGUISquares: Renders all 64 squares to the board.

function InitGUISquares() {

    var light = 0;
    var rank;
    var file;

    for(rank = RANKS.R_1; rank <= RANKS.R_8; rank++) {
        for(file = FILES.F_A; file <= FILES.F_H; file++) {
            MakeGUISquare(light, file, rank);
            // console.log(light, file, rank);
            light ^= 1;
        }
        light ^= 1;
    }
}

// PrintBoardToConsole: Prints the current position to the browser console.

function PrintBoardToConsole() {

    var sq;
    var rank;
    var file;
    var piece;

    console.log("Game Board: ");

    for (rank = RANKS.R_8; rank >= RANKS.R_1; rank--) {
        var line = ((rank+1) + " ");
        for (file = FILES.F_A; file <= FILES.F_H; file++) {
            sq = FindSq120(file, rank);
            piece = square120[sq];
            line += (" " + PceChar[piece] + " ");
        }
        console.log(line);
    }

    var line = "  ";
    for(file = FILES.F_A; file <= FILES.F_H; file++) {
        line += (' ' + FileChar[file] + ' ');
    }
    console.log(line);

    console.log("");

    if (Board.Side == Colour.White) {
        console.log("side: w" );
    } else if (Board.Side == Colour.Black) {
        console.log("side: b");
    } else {
        console.log("side: null");
    }

    console.log(fortressStat);

}

function isEven(value) {
    if(value%2 == 0) {
        return true;
    } else {
        return false;
    }
}