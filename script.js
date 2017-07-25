//Run once DOM is ready for JavaScript to execute
$(document).ready(function(){
  generateGrid();
  labelGrid();

  compSetBoard();
});

var numRows=10;
var numCols=11;

//Generate the battleship board grid
function generateGrid() {
  var markup='';
  var letter='A';
  var number='1';
  
  for(i=0; i<numRows; i++) {
    markup += '<tr>';
    for(j=0; j<numCols; j++) {
      if(j === 0){
        if(number === ':'){
          number = numRows.toString();  // I think this works. I didn't test
          markup += '<td id="' + number + '"class="square"></td>';
        }
        else{
          markup += '<td id="' + j.toString() + number + '"class="square"></td>';
        }
      }
      else{
        markup += '<td id="' + letter + number + '" class="square"></td>';
        letter=incrementChar(letter);
      }
    }
    markup += '</tr>'
    //letter=incrementChar(letter);
    letter='A';
    number=incrementChar(number);
  }
  $('.battleship-grid').append(markup);
}

//Label the fixed portions of battleship grid
function labelGrid() {
  var letter='A';
  var number='1';
  for(i=0; i<numRows; i++){
    insertText('0' + letter, letter);

    if(i === 9){
      var rowLabel = numRows.toString(); // I not 100% if this is what you mean to do here. So revert if this doesn't make sense
      insertText(rowLabel, rowLabel);
    }
    else{
      insertText('0' + number, number);
    }
    letter=incrementChar(letter);
    number=incrementChar(number);
  }
}

// I really like these small helper methods. It makes the actual business logic more readable
//Increments the letter for the square ID (ex: A0, A1, B2, etc...)
function incrementChar(letter) {
  return String.fromCharCode(letter.charCodeAt(0) + 1);
}

//Set grid text based on square ID
function insertText(id, letter) {
  document.getElementById(id).innerHTML = letter;
}

//Random number generator for computer ship placements & direction
function getRandomNumber(min, max) {
  return Math.floor( Math.random() * ( 1 + max - min ) ) + min;
}

//Random letter generator for computer ship placements
function getRandomLetter() {
  return randomLetter=('ABCDEFGHIJ').split('')[(Math.floor(Math.random() * 10 ))];
}

//Random location generator for computer ship placements
function getRandomLocation() {
  var letter=getRandomLetter();
  var number=getRandomNumber(1,10);
  var pos=letter + number;
  return pos;
}

// This guy is very confusing lol.
// I think inheritly it will be, and I'm glad you wrote a lot of 
// comments. 

//Random direction generator for possible computer ship placements
function getRandomDirection(letter, number) {
  //Direction to place - 1 up, 2 right, 3 down, 4 left
  var dir=0;

  /* Checking if randomized location is on the border of the grid */
  //If in first row, ship cannot be placed up
  if(number===1) {
    if(letter==='A'){
      //If also in column A, ship cannot be placed left
      dir=getRandomNumber(2,3);
    }
    else if(letter==='J') {
      //If also in column J, ship cannot be placed right
      dir=getRandomNumber(3,4);
    }
    else{
      dir=getRandomNumber(2,4);
    }
  }
  //If in column A, ship cannot be placed left
  else if(letter==='A'){
    //If also in last row, ship cannot be placed down
    if(number===10){
      dir=getRandomNumber(1,2);
    }
    else{
      dir=getRandomNumber(1,3);
    }
  }
  //If in column J, ship cannot be placed right
  else if(letter==='J'){
    //If also in last row, ship cannot be placed down
    if(number===10){
      dir=getRandomNumber(1,2);
      if(dir===2){
        // not sure what this 4 is for...I would 
        // make it a variable so it is more readable
        dir=4;
      }
    }
    else{
      dir=getRandomNumber(1,3);
      if(dir===2){
        dir=4;
      }
    }
  }
  //If location is not on border, ship can be in any direction
  else{
    // I think you could use the 4 variable here too?
    dir=getRandomNumber(1,4);
  }
  return dir;
}

//Place the ships according to ship type(size)
function setShip(size){
  var pos=getRandomLocation();
  
  // LetterA - what is the significance of this variable? 
  // A name that puts it into the context of the game 
  // would be a much better name - like 
  // first row? first column? etc...
  var letterA='A';
  var letter=pos[0];
  var number=pos[1];
  var dir=getRandomDirection(letter, number);

  //Set ship based on orientation
  switch(dir){
      // what does case 1, 2, 3... mean? Is this veritcal? horizontal...
      // #2: Each case could be a function on its own...You should
      // aim for smaller functions
    case 1:
        if(number<size){
          return false;
        }
        for(i=0; i<size; i++){
          // should make occupied a variable and use it everywhere below
          if(document.getElementById(pos).getAttribute('data') === 'occupied'){
            return false;
          }
          pos=letter + String.fromCharCode(pos.charCodeAt(1) - 1);
        }
        //5 Spaces can be occupied
        pos=letter + number;
        for(j=0; j<size; j++){
          document.getElementById(pos).setAttribute('data','occupied');
          document.getElementById(pos).innerHTML='X';
          pos=letter + String.fromCharCode(pos.charCodeAt(1) - 1);
        }
        break;
    case 2:
        if(letter>(String.fromCharCode(letterA.charCodeAt(0) + (size-1)))){
          return false;
        }
        for(i=0; i<size; i++){
          if(document.getElementById(pos).getAttribute('data')==='occupied'){
            return false;
          }
          // Looks like you use this String.fromCharCode(pos.charCodeAt(0) + 1) + number;
          // function a few times. It would be a good helper function
          pos=String.fromCharCode(pos.charCodeAt(0) + 1) + number;
        }
        //5 Spaces can be occupied
        pos=letter + number;
        console.log("Size: " + size);

        for(j=0; j<size; j++){
          document.getElementById(pos).setAttribute('data','occupied');
          document.getElementById(pos).innerHTML='X';
          pos=String.fromCharCode(pos.charCodeAt(0) + 1) + number;
          console.log("After: " + pos);

        }
        break;
    case 3:
        if(number>size){
          return false;
        }
        for(i=0; i<size; i++){
          if(document.getElementById(pos).getAttribute('data')==='occupied'){
            return false;
          }
          pos=letter + String.fromCharCode(pos.charCodeAt(1) + 1);

        }
        //5 Spaces can be occupied
        pos=letter + number;
        for(j=0; j<size; j++){
          document.getElementById(pos).setAttribute('data','occupied');
          document.getElementById(pos).innerHTML='X';
          pos=letter + String.fromCharCode(pos.charCodeAt(1) + 1);
        }
        break;
    case 4:
        if(letter<(String.fromCharCode(letterA.charCodeAt(0) + (size-1)))) {
          return false;
        }
        for(i=0; i<size; i++){
          if(document.getElementById(pos).getAttribute('data')==='occupied') {
            return false;
          }
          pos=String.fromCharCode(pos.charCodeAt(0) - 1) + number;
        }
        //5 Spaces can be occupied
        pos=letter + number;
        for(j=0; j<size; j++) {
          document.getElementById(pos).setAttribute('data','occupied');
          document.getElementById(pos).innerHTML='X';
          pos=String.fromCharCode(pos.charCodeAt(0) - 1) + number;
        }
        break;
    default:
      return false;
  }
  return true;
}

//Computer set ships in random locations
function compSetBoard() {
  // VERY Concise! I like it
  placeCarrier();
  placeBattleShip();
  placeCruiser();
  placeCruiser();
  placeDestroyer();
}

//5 Spaces
function placeCarrier() {
  var result=false;
  while(!result) {
    result=setShip(5);
  }
}

//4 Spaces
function placeBattleShip() {
  var result=false;
  while(!result){
    result=setShip(4);
  }
}

//3 Spaces
function placeCruiser() {
  var result=false;
  while(!result){
    result=setShip(3);
  }
}

//2 Spaces
function placeDestroyer() {
  var result=false;
  while(!result){
    result=setShip(2);
  }
}
