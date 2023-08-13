console.log("aplication work!");
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
//----------Sprites and Graphic-
let player = new Image();
let BG = new Image();
let Road = new Image();
let asteroid = new Image();
let asteroids = [];
let star = new Image();
let stars = [];
let revel = false;
let gameOver = new Image();
let live = new Image();
player.src = './assets/car.png';
BG.src = './assets/BG.jpg';
asteroid.src = './assets/asteroid.png';
gameOver.src = './assets/game-over.png'
live.src = './assets/live.png'
star.src = './assets/live.png'
//Sounds//
let sounds = true;
let main = new Audio();
let endgame = new Audio();
let colission = new Audio();
let takelife = new Audio();
main.src="./assets/sounds/main.mp3"
endgame.src = "./assets/sounds/endgame.mp3"
colission.src = "./assets/sounds/colission.mp3"
takelife.src = "./assets/sounds/takelife.mp3"
//Coordinates for Objects
asteroids[0]={
    x: 100,
    y: 0
}
stars[0]={
    x: 100,
    y: 0
}
let widthCanv = canvas.width;
let heigthCanv = canvas.height;
xPosition = (widthCanv - player.width) / 2;
yPosition = heigthCanv - player.height - 24;
yPositionBG = 0;
//------Variables-----
let lifeCount = 3;
let maxLive = 4;
let revelTime = 1000;
let score = 0;
//Player Movement//
document.addEventListener('keydown', playerMovement);
function playerMovement(event){
    if(xPosition > 0){
        if(event.keyCode === 65){
            xPosition -=10;
        } 
    }
    if(xPosition < widthCanv - player.width){
        if(event.keyCode === 68){
            xPosition += 10;
        }  
    }    
}
//Canvas and Draw the Page//
function draw(){
    //Main Sound
    if(sounds){
        main.play();
    }
    //Background and Player
    ctx.drawImage(BG, 0, 0);
    ctx.drawImage(player, xPosition, yPosition);
    //Scores
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(score, canvas.width/1.25, 25);
    //Asteroids and Quantitys
    const maxAsteroids = 1000; // Максимальное количество астероидов
        // Asteroids
    for (let i = 0; i < asteroids.length; i++) {
        ctx.drawImage(asteroid, asteroids[i].x, asteroids[i].y);
        asteroids[i].y++;
        //Space between Spawn
        if (asteroids[i].y === 200) {
            if (asteroids.length < maxAsteroids) {
                asteroids.push({
                    x: Math.floor(Math.random() * 320) - asteroid.width,
                    y: -10,
                });
            }
        }
        //Destroy the Asteroids out of Window and add the Score
        if(asteroids[i].y >= canvas.height){
            asteroids.splice(i,1);
            score += 10;
        }
        // Collision with Asteroid and Spawn of new Life Score
        if(yPosition <= asteroids[i].y
            && xPosition - player.width / 3 <= asteroids[i].x
            && xPosition + player.width / 3 >= asteroids[i].x ){
                asteroids.splice(i,1);
                playerRevel(); 
                createStars();
                score -= 100;
            }        
    }
    // Spawn of Stars and Collision
    for (let i = stars.length - 1; i >= 0; i--) {
        ctx.drawImage(star, stars[i].x, stars[i].y);
        stars[i].y += 2;
        //Destroy star if outside of window
        if (stars[i].y >= canvas.height) {
            stars.splice(i, 1);
        } else if (
            yPosition <= stars[i].y &&
            xPosition - player.width <= stars[i].x &&
            xPosition + player.width >= stars[i].x
        ) {
            score += 50;
            stars.splice(i, 1);
            addLife();
        }
    }
    checkLives();
    if (lifeCount > 0){   
        requestAnimationFrame(draw);
    }
}
//------------------------- HUD with Lifes
function checkLives(){
    if(lifeCount <= maxLive){
        for(let i = 0; i < lifeCount; i++){
            ctx.drawImage(live, live.width + 15 * i, 10);
        }
    }
}
// Minus Life if collision and draw the endgame and Scores
function playerRevel(){
    if(!revel){
        colission.play();
        //revel = true;
        lifeCount --;
        if(lifeCount ==0){
            endgame.play();
            main.pause();
            setTimeout(() => (ctx.drawImage(gameOver,canvas.width - gameOver.width -25,200),100));
            ctx.font = "32px Arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`Your Score ${score}`, canvas.width/2, canvas.height /2);
            ctx.fillText(`Space to restart`, canvas.width/2, canvas.height /2 + 50);
            document.addEventListener("keydown", restart);
        }   
    }
}
// Spawn a star
function createStars() {
    if (lifeCount < 3) {
        stars.push({
            x: Math.floor(Math.random() * (canvas.width - star.width)),
            y: -10,
        });
    }
}
// Add Life
function addLife(){
    takelife.play();
    lifeCount ++;
}
// Restart the game
function restart(event){
    if(event.keyCode=="32"){
        location.reload();
    }
}
asteroid.onload = draw;