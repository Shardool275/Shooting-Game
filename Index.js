var player
var shots = []
var targets = []
var maxMisses = 10

var amountOfShots = 5
var rof = 20
var spawnrate

var amountOfTargets = 8
var ingame

function setup() {
  fill(255,255,255)
  
  misses = 0
  level = 1
  hits = 0
  
  leveling = false
  spawnrate = 200
  
  currentShot = 0
  rofCountDown = rof
  
  currentSpawn = 0
  spawnCountDown = spawnrate
  
  createCanvas(500,500)
  
  player = new playerObject()
  for(var i = 0; i < amountOfShots; i ++){
    shots.push(new shotObject())
    shots[i].inAction = false
  }
  for(var i = 0; i < amountOfTargets; i ++){
    targets.push(new targetObject())
    targets[i].inAction = false
  }
}
/*

THE DRAW LOOP

*/
function draw() {
  
  background (0)
  if(ingame){
  //update player
  player.display()
  player.move()
  
  //firing && currentShot cycling
  if(keyIsDown(ENTER) && rofCountDown == 0){
    shots[currentShot].fire()
    currentShot ++
  }
  if(currentShot >= amountOfShots){
    currentShot = 0
  }
  
  //updating the shots
  for(var i = 0; i < amountOfShots; i ++){
    shots[i].move()
    shots[i].display()
  }
  //rofCountDown update 
  if(rofCountDown > 0){
    rofCountDown = rofCountDown - 1
  }
  //Spawnrate update 
  if(spawnCountDown > 0){
    spawnCountDown = spawnCountDown - 1
  }

  //spawning
  if(spawnCountDown <= 0){
    targets[currentSpawn].spawn()
    currentSpawn ++
    spawnCountDown = spawnrate
  }
  if(currentSpawn >= amountOfTargets){
    currentSpawn = 0
  }
    //leveling
  if(hits % 10 == 0 && leveling == true){
    level = level + 1
    leveling = false
    spawnrate = round(spawnrate / level) + 50
  }

  //Update the targets
  for(var i = 0; i < amountOfTargets; i ++){
    targets[i].move()
    targets[i].getshot()
    targets[i].display()
    fill (255,255,255)
    textSize(20)
    text("Score: " + hits,width -150 ,40)
    text("Level: " + level, width -150 ,80)
    text(misses + " / " + maxMisses, width -150 ,120)
    }
    if(maxMisses == misses){
      ingame = false
    }
  }
  else{
    textSize(50)
    text("score: " + hits, width/4, height/2)
    textSize(25)
    text("press ENTER" , width/4, height/2 + 100)
    textSize(15)
    text("W,S and ENTER to play" , width/4, height/2 + 150)

    if(keyIsDown(ENTER)){
      setup()
      ingame = true
    }
  }
}
/*

THE DRAW LOOP

*/
//THE PLAYER
function playerObject(){
  this.x = 50
  this.y = 100

  this.speed = 5

  this.lenth = 30
  this.height = 10
  this.dirleft = false
  
  this.display = function(){
    triangle(
      /*point 1*/ this.x,                         this.y + this.height,
      /*point 2*/ this.x+this.lenth,              this.y,
      /*point 3*/ this.x+this.lenth*this.dirleft, this.y - this.height
      )
  }
  this.move = function(){
    if(keyIsDown(83) && this.y < height-80){
      this.y = this.y + this.speed
    }
    if(keyIsDown(87) && this.y > 80){
      this.y = this.y - this.speed
    }
  }
}

// SHOTS
function shotObject(){
  
  this.x = 0
  this.y = 0

  this.inAction = false

  this.speed = 10
  this.size = 5
  
  this.fire = function(){
    if(!this.inAction){
      this.inAction = true
      this.x = player.x + player.lenth
      this.y = player.y - player.height * 1/2
      rofCountDown = rof
    }
  }
  this.move = function(){
    if(this.inAction){
    this.x = this.x + this.speed
    }
    if(this.x > width){
      this.inAction = false
    }

  }
  this.display = function(){
    if(this.inAction){
      rect(
        this.x,this.y,
        this.size * 4,this.size
      )
    }
  }
}
//THE TARGETS
function targetObject() {
  
  this.x = 0
  this.y = 0
  this.inAction = false
  
  this.size = 30
  this.xSpeed
  this.ySpeed

  this.maxXspeed = 3

  this.move = function(){
    if(this.inAction){
      this.x = this.x - this.xSpeed
      this.y = this.y + this.ySpeed
      
    //if missed detection
      if(this.x < -50){
        misses ++
        this.inAction = false
        this.x = width * 2
      }
    }
  }
  this.getshot = function(){
    if(this.inAction){
      for(var i = 0; i < amountOfShots; i ++){
        if(
            shots[i].inAction                  &&
            shots[i].x >= this.x               &&
            shots[i].x <= this.x + this.size   &&
            shots[i].y >= this.y               &&
            shots[i].y <= this.y + this.size
          ){
            this.inAction = false
            shots[i].inAction = false
            hits ++
            leveling = true
        }
      }
    }
  }
  this.display = function(){
    if(this.inAction){
      rect(this.x,this.y,this.size,this.size)
    }
  }
  this.spawn = function(){
    if(!this.inAction){
    this.y = random(100, height - 100)
    this.x = width + this.size + 10
    this.inAction = true
    this.ySpeed = 0
    this.xSpeed = random(this.maxXspeed) + level / 5
    }
  }
}