class Mover {
  constructor() {
    this.speed = 5;
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
      if(this.x != this.target.x) {
        this.x += this.speed * ((this.target.x-this.x)/Math.abs(this.target.x-this.x));
      }
      else if(this.y != this.target.y) {
        this.y += this.speed * ((this.target.y-this.y)/Math.abs(this.target.y-this.y));
      }
    }
  }
}

class ChessPiece {
    constructor(x, y, mover) {
      this.radius = 10;

      this.x = x;
      this.y = y;
      this.mover = mover;
  }

  moveTo(x, y) {
    mover.moveTo(this.x, this.y);
    moveTo.toggleMagnet(true);
    mover.moveTo(x, y);
    moveTo.toggleMagnet(false);
  }

  render(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    context.fillStyle="green";
    context.fill();
    console.log("idonedidit");
  }

  update() {
    if(mover.magnetEnabled && equalsWithMargin(this.x, mover.x, mover.radius) && equalsWithMargin(this.y, mover.y, mover.radius)) {
      // We're hanging onto the magnet!
      this.x = mover.x;
      this.y = mover.y;
    }
  }
}

function equalsWithMargin(arg1, arg2, margin) {
  if(arg1 <= arg2+margin && arg1 >= arg2-margin) {
    return true;
  }
  return false;
}

let pieces = [];

let canvas = document.getElementById("scene");
let c = canvas.getContext("2d");

let mover = new Mover();

setInterval(function(){
  c.clearRect(0, 0, 800, 800);

  // Update and draw mover (this simulates our magnet)
  mover.update();
  mover.render(c);

  // Update and render pieces
  for(let i = 0; i < pieces.length; i++) {
    pieces[i].update();
    pieces[i].render(c);
  }

}, 1000/60);
