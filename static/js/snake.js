// DECLARATIONS
// --TOOLING DECLARATIONS--
gridX      = 11;
gridY      = 11;
gridXinit  = 2;
gridYinit  = 2;

//--SNAKE DECLARATIONS--
const upBtnEl    = document.getElementById("btnUpEl");
const downBtnEl  = document.getElementById("btnDownEl");
const leftBtnEl  = document.getElementById("btnLeftEl");
const rightBtnEl = document.getElementById("btnRightEl");
const playSpawnX = gridX + 1;
const playSpawnY = Math.floor((gridY + gridYinit)/2);
const maxSpeed   = 500;
let speed        = maxSpeed;
let gameOn       = false;
let tick         = 0;
let playerDir    = {x: -1, y: 0};
let writeDir     = [];
let snakeBody    = [];
let newSnakeBody = [];
let playerImg    = 1;
let player;
let apple;

// FUNCTIONS

/** Toggles the artwork of sprites relative to the value of tick.
 */
function toggleSprites() {
    var i = tick % 2 + 1
    player.src = imgRoot + `snake${playerImg}head${i}.png`
    snakeBody.forEach((element) => {
        i = i == 1 ? 2 : 1
        element.src = imgRoot + `snake${playerImg}body${i}.png`
    })
}

function makeApple() {
    var badXY = []
    var appleXY;
    var badApple = true;
    if (player != undefined) {
        badXY.push(getSpriteXY(player));
    }
    snakeBody.forEach((element) => { badXY.push(getSpriteXY(element)); });
    while (badApple == true) {
        badApple = false;
        appleXY = {
            x: Math.ceil(Math.random()*(gridX - gridXinit)) + gridXinit,
            y: Math.ceil(Math.random()*(gridY - gridYinit)) + gridYinit
        };
        badXY.forEach((element) => {
            if ((element.x == appleXY.x) && (element.y == appleXY.y)) {
                badApple = true;
            }
        });
    }
    apple = initSprite(appleXY.x, appleXY.y, "apple1.png", ["point"], "apple");
}

/**Is called when the player moves into the same space as the fly. 
 * Removes fly and increases player score.
 */
function eatApple() {
    var growth = {delay: 0, xy: {}}
    growth.delay = snakeBody.length + newSnakeBody.length + 1;
    growth.xy = getSpriteXY(apple);
    newSnakeBody.push(growth);
    apple.remove();
    addScore(100);
    if (score % 5000 == 0) {
        stageLvl();
    } else {
        speed -= 5
        makeApple();
    } 
    console.log(speed)
}

function checkGrow() {
    var keep = []
    newSnakeBody.forEach(function(element, index) { 
        if (element.delay > 0) {
            element.delay -= 1
            keep.push(element)
        } else {
            snakeBody.push(
                initSprite(element.xy.x, element.xy.y, `snake${playerImg}body1.png`, ["player", "hurts"], "tail")
            );
        }
    });
    newSnakeBody = keep;
}

function makeWalls() {
    var i = Math.random() < 0.5 ? {x: 0, y: 1} : {x: 1, y: 0}
    var initWall = {
        x: gridXinit + 2 + Math.floor((gridX - gridXinit - 5)*Math.random()),
        y: gridYinit + 2 + Math.floor((gridY - gridYinit - 5)*Math.random())
    }
    initSprite(initWall.x, initWall.y, "wall.png", ["tile", "hurts", "obst"]);
    initSprite(initWall.x + i.x, initWall.y + i.y, "wall.png", ["tile", "hurts", "obst"]);
    initSprite(initWall.x + 2*i.x, initWall.y + 2*i.y, "wall.png", ["tile", "hurts", "obst"]);
}

/**Initializes level by initializing tile sprites into each row
 */
function initLevel() {
    if (score > 0) { makeWalls(); }
    if (score > 5000) { makeWalls(); }
    for (let y = (gridYinit); y <= gridY; y++) {
        for (let i = gridXinit; i <= gridX; i++) {
            initSprite(i, y, "ground.png", ["tile"]);
        }
    }
    makeApple();
    gameOn = true;
}

/**Deletes all tile elements, pagebreaks and cell spaces.
 */
function clearLvl() {
    document.querySelectorAll(".tile").forEach((element) => {
        element.remove();
    });
    document.querySelectorAll(".point").forEach((element) => {
        element.remove();
    });
    grid.querySelectorAll("br").forEach((element) => {
        element.remove();
    });
    grid.querySelectorAll("small").forEach((element) => {
        element.remove();
    });
    gameOn = false;
    disableControl();
    speed = maxSpeed - score/100
    if (speed < 300) { speed = 300 }
    console.log("speed:", speed);
    if (player) {
        player.remove();
    }
    player = undefined;
    snakeBody.forEach((element) => {
        element.remove();
    });
    snakeBody = [];
    newSnakeBody = [];
    console.log("----CLEARED----")
}

/**Disables controls, gives points, pauses the game and prepares the next level
 */
function stageLvl() {
    clearLvl();
    setTimeout(function() {
        initLevel();
        gridHTML();
        tick = 1;
    }, speed);
}

/**Creates a sprite with id "player" and src playerImg.
 */
function initPlayer() {
    if (player == undefined) {
        console.log("initPlayer at ", playSpawnX, playSpawnY)
        player = initSprite(playSpawnX, playSpawnY, `snake${playerImg}head1.png`, null, "player");
        playerDir = {x:-1, y:0}
    }
    else if (snakeBody.length < 2) {
        snakeBody.push( 
            initSprite(playSpawnX, playSpawnY, `snake${playerImg}body1.png`, ["player", "hurts"], "tail")
        );
        if (snakeBody.length == 2) {
            enableControl();
        }
    }
}

/**Updates the player's position every tick based on their direction
 * of movement.
 */
function movePlayer(){
    var targetXY = getSpriteXY(player);
    var headX, headY;
    var ahead;
    if (writeDir.length != 0) {
        playerDir = writeDir[0];
        writeDir.shift()
    }
    headX  = targetXY.x + playerDir.x;
    headY  = targetXY.y + playerDir.y;
    if (headX < gridXinit) { headX = gridX; }
    if (headY < gridYinit) { headY = gridY; }
    if (headX > gridX) { headX = gridXinit; }
    if (headY > gridY) { headY = gridYinit; }
    setSpriteXY(player, headX, headY);
    setSpriteDeg(player, dirToDeg(playerDir));
    snakeBody.forEach((element) => {
        targetXY = setSpriteXY(element, targetXY.x, targetXY.y);
    })
    ahead = allAtXY(headX, headY);
    if (newSnakeBody.length != 0) {
        if ((checkXY(ahead).death == true) ||
        ((newSnakeBody[0].xy.x == headX)&&(newSnakeBody[0].xy.y == headY))) {
            endGame();
        }
    } else if (checkXY(ahead).death == true) { endGame(); }
    if (checkXY(ahead).score == true) { eatApple(); }
}

/**Effect of user trigger to move player up
*/
function moveUp(event) {
    if ((writeDir.length == 0) && (playerDir.y == 1)) {
    } else if ((writeDir.length == 0)) { writeDir.push({x: 0, y: -1});
    } else if (writeDir[writeDir.length - 1].y != 0) {
    } else { writeDir.push({x: 0, y: -1}); }
}

/**Effect of user trigger to move player up
*/
function moveDown(event) {
    if ((writeDir.length == 0) && (playerDir.y == -1)) {
    } else if ((writeDir.length == 0)) { writeDir.push({x: 0, y: 1});
    } else if (writeDir[writeDir.length - 1].y != 0) {
    } else { writeDir.push({x: 0, y: 1}); }
}

/**Effect of user trigger to move player light
*/
function moveLeft(event) {
    if ((writeDir.length == 0) && (playerDir.x == 1)) {
    } else if ((writeDir.length == 0)) { writeDir.push({x: -1, y: 0});
    } else if (writeDir[writeDir.length - 1].x != 0) {
    } else { writeDir.push({x: -1, y: 0}); }
}


/**Effect of user trigger to move player right.
*/
function moveRight(event) {
    if ((writeDir.length == 0) && (playerDir.x == -1)) {
    } else if ((writeDir.length == 0)) { writeDir.push({x: 1, y: 0});
    } else if (writeDir[writeDir.length - 1].x != 0) {
    } else { writeDir.push({x: 1, y: 0}); }
}

/**changes the player's movement direction as a keyboard event
 * @param {Event} e keyboard event
 */
function buttonMove(e) {
    if((e.code === "ArrowUp") || (e.code === "KeyW")) { 
        moveUp(e);
        upBtnEl.classList.add("pressed");
        setTimeout(function(){ upBtnEl.classList.remove("pressed"); }, 50);
    }
    else if ((e.code === "ArrowDown") || (e.code === "KeyS")) { 
        moveDown(e);  
        downBtnEl.classList.add("pressed");
        setTimeout(function(){ downBtnEl.classList.remove("pressed"); }, 50);
    }
    else if ((e.code === "ArrowLeft") || (e.code === "KeyA")) { 
        moveLeft(e);  
        leftBtnEl.classList.add("pressed");
        setTimeout(function(){ leftBtnEl.classList.remove("pressed"); }, 50);
    }
    else if ((e.code === "ArrowRight")|| (e.code === "KeyD")) { 
        moveRight(e);
        rightBtnEl.classList.add("pressed");
        setTimeout(function(){ rightBtnEl.classList.remove("pressed"); }, 50);
    }
}

/**Enables the controls for the player for starting, resuming or reseting.
 */
function enableControl() {
    upBtnEl.addEventListener("click", moveUp);
    downBtnEl.addEventListener("click", moveDown);
    leftBtnEl.addEventListener("click", moveLeft);
    rightBtnEl.addEventListener("click", moveRight);
    document.addEventListener('keyup', buttonMove);
}

/**Disables the controls for the player for dying, pausing or reseting.
 */
function disableControl() {
    upBtnEl.removeEventListener('click', moveUp);
    downBtnEl.removeEventListener('click', moveDown);
    leftBtnEl.removeEventListener('click', moveLeft);
    rightBtnEl.removeEventListener('click', moveRight);
    document.removeEventListener('keyup', buttonMove);
}

function typeName() {
    nameEl = document.getElementById('id_alias');
    nameEl.classList.add(`score-area`);
    nameEl.style.display = "block"
    nameEl.focus();
    nameEl.select();
    submitEl.style.display = "block";
}

function tryAgain(e) {
    if (e.code == "Escape") {
        document.removeEventListener('keyup', tryAgain);
        scoreEl.setAttribute("value", "000000");
        document.getElementById("id_alias").setAttribute("value", "AAAAAA");
        document.getElementById("id_alias").innerHTML = "AAAAAA";
        document.getElementById("id_alias").disabled = false;
        document.getElementById("submitBtnEl").innerText = "Insert Name";
        document.getElementById("gameDisplayEl").removeAttribute("action");
        hiScoreEl.style.display  = "inline";
        startBtnEl.style.display = "flex";
        nameEl.style.display     = "none";
        submitEl.style.display   = "none";
        retryEl.style.display    = "none";
        scoreEl.style.display    = "none";
        document.getElementById("gameOverEl").style.display = "none";
        startReady = true;
        startUp();
    }
}

function endGame() {
    var txt = document.createElement('p');
    txt.classList.add(`score-area`);
    txt.innerHTML = "GAME OVER";
    txt.id = "gameOverEl"
    grid.appendChild(txt);
    txt.style.gridColumnStart = gridXinit;
    txt.style.gridColumnEnd   = gridX + 1;
    txt.style.gridRowStart    = gridYinit;
    txt.style.gridRowEnd      = gridY;
    txt.style.justifyContent  = "center"
    clearLvl();
    typeName();
    document.addEventListener('keyup', tryAgain)
    retryEl.style.display = "block";
}

/**Initializes Game
 */
function startUp() {
    console.log("startReady =", startReady)
    if (startReady == true) {
        startReady = false;
        tick = 1;
        score = 0;
        hiScoreEl.style.display = "none";
        scoreEl = document.getElementById('id_value');
        console.log(scoreEl);
        scoreEl.classList.add(`score-area`);
        scoreEl.style.display = "block"
        initLevel();
        gridHTML();
        console.log("ImgRoot:");
        console.log(imgRoot);
    }
}

/**Runs every 500, and shuffles through tick values 1 -> 4 (1, 2, 3, 4, 1...)
*/
function delta(){
    if ((gameOn == false) && (tick % 2 == 0)) {
        startBtnEl.innerHTML = startBtnEl.innerHTML == "" ? "START" : "";
    } else if (gameOn == false) {
    } else {
        initPlayer();
        toggleSprites();
        movePlayer();
        checkGrow();
    }
    tick += tick == 4 ? (-3) : 1;
    setTimeout(delta, speed);
}

// SCRIPT
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false); //<-- Disables keyboard controls over page navigation.

delta(); //<-- Runs a set of game functions every "tick" (500)