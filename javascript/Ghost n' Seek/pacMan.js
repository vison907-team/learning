var score = 0,
gscore = 0,
countblink = 10,
ghost = false;

var player = {
    x:50,
    y:100,
    pacMouth:320,
    pacDirection:0,
    pacSize:32,
    speed:15
}

var enemy = {
    x: 150,
    y: 200,
    speed:10,
    moving: 0,
    dirx: 0,
    diry: 0,
    flash: 0,
    ghosteat: false
}



var powerDot = {
    x: 10,
    y: 10,
    powerup: false,
    pcountdown:0,
    ghostNum:0
}

var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
canvas.height = 400;
canvas.width = 600;
mainImage = new Image();
mainImage.ready = false;
mainImage.onload =checkReady;
mainImage.src = "pac.png"

var keyClick = {} ;
document.addEventListener("keydown", function (event) {
    keyClick[event.keyCode]=true;
    move(keyClick);
},false);
var keyClick = {} ;
document.addEventListener("keyup", function (event) {
   delete keyClick[event.keyCode];
},false);

// Player control
function move(keyClick) {
    if(37 in keyClick) {player.x -= player.speed;player.pacDirection=64}
    if(38 in keyClick) {player.y -= player.speed;player.pacDirection=96}
    if(39 in keyClick) {player.x += player.speed;player.pacDirection=0}
    if(40 in keyClick) {player.y += player.speed;player.pacDirection=32}
    
    // side teleportation
    if (player.x >= (canvas.width-32)) {player.x=0;}
    if (player.y >= (canvas.height-32)) {player.y=0;}
    if (player.x < 0) {player.x=(canvas.width-32);}
    if (player.y < 0) {player.y=(canvas.height-32);}
    if(player.pacMouth == 320){player.pacMouth =352;}else{player.pacMouth =320;}

    render();
}

function checkReady() {
    this.ready = true;
        playGame();
    }


function playGame() {
    render();
    requestAnimationFrame(playGame);
}

function myNum(n) {
    return Math.floor(Math.random()*n);
}

function render() {
    context.fillStyle = "black"
    context.fillRect(0,0,canvas.width,canvas.height);
   
    if(!powerDot.powerup && powerDot.pcountdown < 5) {
        powerDot.x = myNum(420)+30;
        powerDot.y = myNum(250)+30;
        powerDot.powerup = true;
    }

    if(!ghost){
        enemy.ghostNum = myNum(5)*64;
        enemy.x = myNum(450);
        enemy.y = myNum(250)+30;
        ghost = true;
    }

    if(enemy.moving < 0){
        enemy.moving = (myNum(20)*3)+myNum(1);
        enemy.speed = myNum(3)+1;
        enemy.dirx = 0;
        enemy.diry = 0;
        if(powerDot.ghosteat) {enemy.speed = enemy.speed*-1;};
        if(enemy.moving % 2){
            if(player.x < enemy.x) {enemy.dirx = -enemy.speed}else{enemy.dirx = enemy.speed;}
        }else{ 
            if(player.y < enemy.y) {enemy.diry = -enemy.speed}else{enemy.diry = enemy.speed;}
        }
    }

    enemy.moving--;
    enemy.x = enemy.x + enemy.dirx;
    enemy.y = enemy.y + enemy.diry;

    if (enemy.x >= (canvas.width-32)) {enemy.x=0;}
    if (enemy.y >= (canvas.height-32)) {enemy.y=0;}
    if (enemy.x < 0) {enemy.x=(canvas.width-32);}
    if (enemy.y < 0) {enemy.y=(canvas.height-32);}

   //collision detection ghost
   if(player.x <= enemy.x+26 && enemy.x <= (player.x+26) && player.y <= (enemy.y+26) && enemy.y <= (player.y +32)) {
    console.log('ghost');
    if(powerDot.ghosteat) {
        score++;
    }else{
        gscore++;}
    player.x = 10;
    player.y = 100;
    enemy.x = 300;
    enemy.y = 200;
    powerDot.pcountdown=0
}
    
    
    //collision detection powerup
    if(player.x <= powerDot.x && powerDot.x <= (player.x+32) && player.y <= powerDot.y && powerDot.y <= (player.y +32)) {
        console.log('hit');
        powerDot.powerup= false;
        powerDot.pcountdown= 500;
        powerDot.ghostNum= enemy.ghostNum;
        enemy.ghostNum = 384;
        powerDot.x=0;
        powerDot.x=0;
        powerDot.ghosteat = true;
    }
    
    
    if(powerDot.ghosteat) {
        powerDot.pcountdown--;
       if(powerDot.pcountdown<=0) {
          powerDot.ghosteat=false;
          enemy.ghostNum = powerDot.ghostNum;

       }
    }

    if(powerDot.powerup) {
        context.fillStyle = "#ffffff";
        context.beginPath();
        context.arc( powerDot.x, powerDot.y , 10, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
    }

    // enemy flash
    if(countblink>0) {countblink--;}else{countblink=10;
    if(enemy.flash == 0){enemy.flash =32;}else{enemy.flash =0;}}

    context.font = "20px Verdana";
    context.fillStyle = "white"
    context.fillText("Player: "+score+" vs Ghosts: "+gscore,2,18);

    context.drawImage(mainImage, enemy.ghostNum,enemy.flash,32,32,enemy.x,enemy.y,32,32);
    context.drawImage(mainImage, player.pacMouth,player.pacDirection,32,32,player.x,player.y,player.pacSize,player.pacSize);
    
    

}

document.body.appendChild(canvas);
// context.fillText("Hello");