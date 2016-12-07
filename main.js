let pieces = [];

const canvas = document.getElementById("scene");
const context = canvas.getContext("2d");
let tileSize = 50;
let pieceRadius = 15;

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
  constructor(x, y, team, mover) {

    this.x = x;
    this.y = y;
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

  routeTo(x, y) {
    // positive x = left
    // positive y = up
    let distance = [x-this.x, y-this.y];
    console.log(distance);
    let prevX, prevY;
    if(distance[0] != 0) {
      while(!this.overlaps() && distance[0] != 0) {
        prevX = this.x;
        this.x += distance[0]/Math.abs(distance[0])*this.mover.speed;
        distance[0] -= this.x-prevX;
        console.log(distance)
       // console.log(this.x);
      }
    }
    this.x -= this.mover.speed;
    if(distance[1] != 0) {
      while(!this.overlaps() && distance[1] != 0) {
        prevY = this.y;
        this.y += distance[1]/Math.abs(distance[1])*this.mover.speed;
        distance[1] -= this.y-prevY;
        console.log(distance)
       // console.log(this.x);
      }
      this.x -= this.mover.speed;
    }
  }

  overlaps() {
    // TODO: Do circle-circle intersection instead, will be much cooler
    
    for(let i = 0; i < pieces.length; i++) {
      if(this != pieces[i] && equalsWithMargin(this.x, pieces[i].x, pieceRadius*2) && equalsWithMargin(this.y, pieces[i].y, pieceRadius*2)) {
        return i;
      }
    }
    return false;
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
    for(let row = 1; row <= 8; row++) {
      for(let column = 1; column <= 2; column++) {
        pieces.push(new ChessPiece(row*tileSize-tileSize/2, 6*tileSize*team+column*tileSize-tileSize/2, team, mover));
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