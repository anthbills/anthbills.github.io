var moveSound = new Audio("/js/sounds/move.wav");
var captureSound = new Audio("/js/sounds/capture.wav");
var promoteSound = new Audio("/js/sounds/promote.wav");
var errorSound = new Audio("/js/sounds/error.wav");
var newSound = new Audio("js/sounds/newgame.wav");
var backSound = new Audio("js/sounds/back.wav");

function PlayMoveSFX() {
    var move = moveSound.cloneNode();
    move.play();
}

function PlayCaptureSFX() {
    var cap = captureSound.cloneNode();
    cap.play();
}

function PlayPromoteSFX() {
    var prom = promoteSound.cloneNode();
    prom.play();
}

function PlayErrorSFX() {
    var err = errorSound.cloneNode();
    err.play();
}

function PlayNewSFX() {
    var newSFX = newSound.cloneNode();
    newSFX.play();
}

function PlayBackSFX() {
    var backSFX = backSound.cloneNode();
    backSFX.play();
}