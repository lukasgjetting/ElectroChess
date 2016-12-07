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
      this.radius = 10;

      this.x = x;
      this.y = y;
      this.mover = mover;
      this.team = team;
      console.log(this.team);
  }
  render(context) {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
    console.log(this.team);
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
}

function equalsWithMargin(arg1, arg2, margin) {
  if(arg1 <= arg2+margin && arg1 >= arg2-margin) {
    return true;
  }
  return false;
}

function init() {
  let pieces = [];

  const canvas = document.getElementById("scene");
  const c = canvas.getContext("2d");
  let tileSize = 50;


  for(let team = 0; team <= 1; team++) {
    for(let row = 1; row <= 2; row++) {
      for(let column = 0; column < 7; column++) {
        pieces.push(new ChessPiece(row*tileSize-tileSize/2, column*tileSize-tileSize/2, team, mover))
      }
    }
  }

  // Main loop
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
}


  const mover = new Mover();  
init();