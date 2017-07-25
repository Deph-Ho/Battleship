//Run once DOM is ready for JavaScript to execute
$(document).ready(function() {
  startGame();
});

const NUMROWS = 10;
const NUMCOLS = 11;
const FIRSTCOL = 'A';
const OCCUPIED = 'occupied';

const NORTH = 1;
const EAST = 2;
const SOUTH = 3;
const WEST = 4;

//Start game
function startGame() {
  //Set-Up
  generateGrid();
  labelGrid();
  compSetBoard();
}

//Player's turn
function nextMove(square) {
  /*https://stackoverflow.com/questions/41255984/how-to-get-an-id-of-the-clicked-element*/
  if(document.getElementById(id).getAttribute('data') === OCCUPIED){
    setMessage("Hit!");
  }
  else{
    setMessage("Miss");
  }
}


//Generate the battleship board grid
function generateGrid() {
  var markup = '';
  var column = 'A';
  var row = '1';

  for(i=0; i<NUMROWS; i++) {
    markup += '<tr>';
    for(j=0; j<NUMCOLS; j++) {
      if(j === 0){
        if(row === ':'){
          row = NUMROWS.toString();
          markup += '<td id="' + row + '"class="square"></td>';
        }
        else{
          markup += '<td id="' + j.toString() + row + '"class="square"></td>';
        }
      }
      else{
        markup += '<td id="' + column + row + '" class="square"></td>';
        column = incrementChar(column);
      }
    }
    markup += '</tr>'
    column = 'A';
    row = incrementChar(row);
  }
  $('.battleship-grid').append(markup);
}

//Label the fixed portions of battleship grid
function labelGrid() {
  var column = 'A';
  var row = '1';
  for(i=0; i<NUMROWS; i++){
    insertText('0' + column, column);

    if(i === 9){
      var rowLabel = NUMROWS.toString();
      insertText(rowLabel, rowLabel);
    }
    else{
      insertText('0' + row, row);
    }
    column = incrementChar(column);
    row = incrementChar(row);
  }
}

//Place the ships according to ship type(size)
function setShip(size) {
  var pos = getRandomLocation();
  var column = pos[0];
  var row = pos[1];
  var dir = getRandomDirection(column, row);

  //Set ship based on orientation
  switch(dir){
    case NORTH:
        return(setShipNorth(pos, size));
        break;
    case EAST:
        return(setShipEast(pos, size));
        break;
    case SOUTH:
        return(setShipSouth(pos, size));
        break;
    case WEST:
        return(setShipWest(pos, size));
        break;
    default:
      return false;
  }
  return true;
}

//Computer set ships in random locations
function compSetBoard() {
  placeCarrier();
  placeBattleShip();
  placeCruiser();
  placeCruiser();
  placeDestroyer();
}

/* Helper Methods */

//Increments the column for the square ID (ex: A0, A1, B2, etc...)
function incrementChar(column) {
  return String.fromCharCode(column.charCodeAt(0) + 1);
}

//Set grid text based on square ID
function insertText(id, column) {
  document.getElementById(id).innerHTML = column;
}

function setMessage(msg) {
	document.getElementById("message").innerText = msg;
}

//Random row generator for computer ship placements & direction
function getRandomRow(min, max) {
  return Math.floor( Math.random() * ( 1 + max - min ) ) + min;
}

//Random column generator for computer ship placements
function getRandomColumn() {
  return randomColumn = ('ABCDEFGHIJ').split('')[(Math.floor(Math.random() * 10 ))];
}

//Random location generator for computer ship placements
function getRandomLocation() {
  var column = getRandomColumn();
  var row = getRandomRow(1,10);
  var pos = column + row;
  return pos;
}

//Random direction generator for possible computer ship placements
function getRandomDirection(column, row) {
  //Direction to place - 1 NORTH, 2 EAST, 3 SOUTH, 4 WEST
  var dir = 0;
  var lastRow = 10;

  /* Checking if randomized location is on the border of the grid */
  //If in first row, ship cannot be placed up
  if(row === NORTH) {
    if(column === 'A'){
      //If also in column A, ship cannot be placed left
      dir = getRandomRow(EAST, SOUTH);
    }
    else if(column === 'J'){
      //If also in column J, ship cannot be placed right
      dir = getRandomRow(SOUTH, WEST);
    }
    else{
      dir = getRandomRow(EAST, WEST);
    }
  }
  //If in column A, ship cannot be placed left
  else if(column === 'A'){
    //If also in last row, ship cannot be placed down
    if(row === lastRow){
      dir = getRandomRow(NORTH, EAST);
    }
    else{
      dir = getRandomRow(NORTH, SOUTH);
    }
  }
  //If in column J, ship cannot be placed right
  else if(column === 'J'){
    //If also in last row, ship cannot be placed down
    if(row === lastRow){
      dir = getRandomRow(NORTH, EAST);
      //Since getRandomRow returns numbers 1-2, let EAST(2) represent WEST(4)
      if(dir === EAST){
        dir = WEST;
      }
    }
    else{
      dir = getRandomRow(NORTH, SOUTH);
      if(dir === EAST){
        dir = WEST;
      }
    }
  }
  //If location is not on border, ship can be in any direction
  else{
    dir = getRandomRow(NORTH, WEST);
  }
  return dir;
}

//Returns the adjacent north position from pos
function decrementPosVertically(pos, column) {
  return column + String.fromCharCode(pos.charCodeAt(1) - 1);
}

//Returns the adjacent west position from pos
function decrementPosHorizontally(pos, row) {
  return String.fromCharCode(pos.charCodeAt(0) - 1) + row;
}

//Returns the adjacent south position from pos
function incrementPosVertically(pos, row) {
  return String.fromCharCode(pos.charCodeAt(0) + 1) + row;
}

//Returns the adjacent east position from pos
function incrementPosHorizontally(pos, column) {
  return column + String.fromCharCode(pos.charCodeAt(1) + 1);
}

//Computer set ship in north orientation
function setShipNorth(pos, size) {
  var column = pos[0];
  var row = pos[1];

  if(row<size){
    return false;
  }
  for(i=0; i<size; i++){
    if(document.getElementById(pos).getAttribute('data') === OCCUPIED){
      return false;
    }
    pos = decrementPosVertically(pos, column);
  }
  //Ship can be placed on map
  pos = column + row;
  for(j=0; j<size; j++){
    document.getElementById(pos).setAttribute('data', OCCUPIED);
    document.getElementById(pos).innerHTML = 'X';
    pos = decrementPosVertically(pos, column);
  }
  return true;
}

//Computer set ship in east orientation
function setShipEast(pos, size) {
  var column = pos[0];
  var row = pos[1];

  if(column>(String.fromCharCode(FIRSTCOL.charCodeAt(0) + (size - 1)))){
    return false;
  }
  for(i=0; i<size; i++){
    if(document.getElementById(pos).getAttribute('data') === OCCUPIED){
      return false;
    }
    pos = incrementPosVertically(pos, row);
  }
  //Ship can be placed on map
  pos = column + row;
  for(j=0; j<size; j++){
    document.getElementById(pos).setAttribute('data', OCCUPIED);
    document.getElementById(pos).innerHTML = 'X';
    pos = incrementPosVertically(pos, row);
  }
  return true;
}

//Computer set ship in south orientation
function setShipSouth(pos, size) {
  var column = pos[0];
  var row = pos[1];

  if(row>size){
    return false;
  }
  for(i=0; i<size; i++){
    if(document.getElementById(pos).getAttribute('data')=== OCCUPIED){
      return false;
    }
    pos = incrementPosHorizontally(pos, column);
  }
  //Ship can be placed on map
  pos = column + row;
  for(j=0; j<size; j++){
    document.getElementById(pos).setAttribute('data', OCCUPIED);
    document.getElementById(pos).innerHTML = 'X';
    pos = incrementPosHorizontally(pos, column);
  }
  return true;
}

//Computer set ship in west orientation
function setShipWest(pos, size) {
  var column = pos[0];
  var row = pos[1];

  if(column<(String.fromCharCode(FIRSTCOL.charCodeAt(0) + (size - 1)))) {
    return false;
  }
  for(i=0; i<size; i++){
    if(document.getElementById(pos).getAttribute('data') === OCCUPIED) {
      return false;
    }
    pos = decrementPosHorizontally(pos, row);
  }
  //Ship can be placed on map
  pos = column + row;
  for(j=0; j<size; j++) {
    document.getElementById(pos).setAttribute('data', OCCUPIED);
    document.getElementById(pos).innerHTML = 'X';
    pos = decrementPosHorizontally(pos, row);
  }
  return true;
}

//5 Spaces
function placeCarrier() {
  var result = false;
  while(!result) {
    result = setShip(5);
  }
}

//4 Spaces
function placeBattleShip() {
  var result = false;
  while(!result){
    result = setShip(4);
  }
}

//3 Spaces
function placeCruiser() {
  var result = false;
  while(!result){
    result = setShip(3);
  }
}

//2 Spaces
function placeDestroyer() {
  var result = false;
  while(!result){
    result = setShip(2);
  }
}
