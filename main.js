let pieces = [];
let board = [
  [true, true, true, true, true, true, true, true],
  [true, true, true, true, true, true, true, true],
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],
  [true, true, true, true, true, true, true, true],
  [true, true, true, true, true, true, true, true]
];
const canvas = document.getElementById("scene");
const context = canvas.getContext("2d");
let tileSize = canvas.width/8;
let pieceRadius = tileSize*0.60/2;

class Mover {
  constructor() {
    this.speed = 1;
    this.radius = 20;

    this.x = 0;
    this.y = 0;
    this.magnetEnabled = false;
    this.target = null;
  }

  moveTo(x, y) {
    this.target = {x: x, y: y};
  }

  toggleMagnet(enable) {
    this.magnetEnabled = enable;
  }

  render(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    context.fillStyle="red";
    context.fill();
  }

  update() {
    if(this.target != null) {
      if(this.x != this.target.x && equalsWithMargin(this.x, this.target.x, this.speed)) {
        this.x = this.target.x;
      }
      else if(this.x != this.target.x) {
        this.x += this.speed * ((this.target.x-this.x)/Math.abs(this.target.x-this.x));
      }
      else if(this.y != this.target.y &&equalsWithMargin(this.y, this.target.y, this.speed)) {
        this.y = this.target.y;
      }
      else if(this.y != this.target.y) {
        this.y += this.speed * ((this.target.y-this.y)/Math.abs(this.target.y-this.y));
      }
    }
  }
}

class ChessPiece {
  constructor(boardColumn, boardRow, team, mover) {
    this.boardColumn = boardColumn;
    this.boardRow = boardRow;

    this.x = boardColumn*tileSize-tileSize/2;
    this.y = 6*tileSize*team+boardRow*tileSize-tileSize/2;

    this.mover = mover;
    this.team = team;
  }
  render(context) {
    context.beginPath();
    context.arc(this.x, this.y, pieceRadius, 0, 2*Math.PI);
    if(this.team == 1) {
      context.fillStyle="green";
    } else if(this.team == 0){
      context.fillStyle="blue";
    }
    context.fill();
  }

  update() {
    //if(mover.magnetEnabled && equalsWithMargin(this.x, mover.x, mover.radius) && equalsWithMargin(this.y, mover.y, mover.radius)) {
    if(this.mover.magnetEnabled && equalsWithMargin(this.mover.x, this.x, this.mover.speed) && equalsWithMargin(this.mover.y, this.y, this.mover.speed)) {
      // We're hanging onto the magnet!
      this.x = this.mover.x;
      this.y = this.mover.y;
    }
  }

  routeTo(boardColumn, boardRow) {
    let route;
    let tempBoard = board;
    for(let pushes = 0; pushes < pieces.length; pushes++) {
      let pushesUsed = 0; 
      // Let's see if we can find a path with the least amount of pushes

      let availableTiles = [];
      let position = [this.x, this.y];
      availableTiles.push([position[0], position[1], 0]);
      while(availableTiles.length < 20) {
        let tempAvailable = [];
        for (var i = 0; i < availableTiles.length; i++) {
          tempAvailable.concat([
            [availableTiles[i][0]+1, availableTiles[i][1], availableTiles[i][2]+1], 
            [availableTiles[i][0]-1, availableTiles[i][1], availableTiles[i][2]+1],
            [availableTiles[i][0], availableTiles[i][1]+1, availableTiles[i][2]+1],
            [availableTiles[i][0], availableTiles[i][1]-1, availableTiles[i][2]+1]
          ]);
          console.log(tempAvailable); 
          console.log(availableTiles.length);
          availableTiles.concat(tempAvailable);
        }
        
      }
      console.log(availableTiles);

    }
  }
}

function equalsWithMargin(arg1, arg2, margin) {
  if(arg1 <= arg2+margin && arg1 >= arg2-margin) {
    return true;
  }
  return false;
}

function update() {
  mover.update();

  for(let i = 0; i < pieces.length; i++) {
    pieces[i].update();
  }

}

function render() {
  // Clear the canvas
  context.clearRect(0, 0, 800, 800);

  // Draw the board
  context.beginPath();
  context.fillStyle = "black";
  for(let i = 0; i < 4; i++) {
    for(let j = 0; j < 8; j++) {
      context.rect(2*tileSize*i+tileSize*(j%2), tileSize*j, tileSize, tileSize);
    }
  }
  context.fill();

  mover.render(context);

  for(let i = 0; i < pieces.length; i++) {
    pieces[i].render(context);

  }
}

function init() {
  for(let team = 0; team <= 1; team++) {
    for(let column = 1; column <= 8; column++) {
      for(let row = 1; row <= 2; row++) {
        pieces.push(new ChessPiece(column, row, team, mover));
      }
    }
  }

  // Main loop
  setInterval(function(){
    update(mover, pieces);
    render(mover, pieces, context);
  }, 1000/60);
}


const mover = new Mover();
init();
