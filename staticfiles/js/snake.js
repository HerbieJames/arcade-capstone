// DECLARATIONS
// --TOOLING DECLARATIONS--
gridX      = 11;
gridY      = 11;
gridXinit  = 2;
gridYinit  = 2;

//--SNAKE DECLARATIONS--
const startBtnEl = document.getElementById("startBtnEl");
const hiScoreEl  = document.getElementById("hiScoreScreenEl");
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
    makeApple();
    if (score > 0) { makeWalls(); }
    if (score > 5000) { makeWalls(); }
    for (let y = (gridYinit); y <= gridY; y++) {
        for (let i = gridXinit; i <= gridX; i++) {
            initSprite(i, y, "ground.png", ["tile"]);
        }
    }
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
    player.remove();
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
    ahead = allAtXY(headX, headY);
    setSpriteXY(player, headX, headY);
    setSpriteDeg(player, dirToDeg(playerDir));
    snakeBody.forEach((element) => {
        targetXY = setSpriteXY(element, targetXY.x, targetXY.y);
    })
    if (checkXY(ahead).death == true) { endGame(); }
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
    if      ((e.code === "ArrowUp")    || (e.code === "KeyW")) { moveUp(e);    }
    else if ((e.code === "ArrowDown")  || (e.code === "KeyS")) { moveDown(e);  }
    else if ((e.code === "ArrowLeft")  || (e.code === "KeyA")) { moveLeft(e);  }
    else if ((e.code === "ArrowRight") || (e.code === "KeyD")) { moveRight(e); }
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

function endGame() {
    var scoreEls = [document.getElementById("scoreEl")];
    var txt = document.createElement('p');
    txt.classList.add(`score-area`);
    txt.innerHTML = "GAME OVER";
    grid.appendChild(txt);
    scoreEls.push(txt);
    console.log(scoreEls);
    for (let i = 0; i <= 1; i++) {
        const element = scoreEls[i];
        console.log(element);
        element.style.gridColumnStart = gridXinit;
        element.style.gridColumnEnd   = gridX + 1;
        element.style.gridRowStart    = gridYinit + i;
        element.style.gridRowEnd      = gridY + i;
        element.style.justifyContent  = "center"
      }
    clearLvl();
    setTimeout(function() {
        scoreEls.forEach((element) => {element.remove()});
        hiScoreEl.style.display = "inline"
        startBtnEl.style.display = "flex"
        startReady = true;
    }, 3000);
}

/**Initializes Game
 */
function startUp() {
    if (startReady == true) {
        startReady = false;
        tick = 1;
        score = 0;
        startBtnEl.style.display = "none";
        hiScoreEl.style.display = "none";
        var txt = document.createElement('p');
        txt.classList.add(`score-area`);
        txt.id               = `scoreEl`;
        txt.innerHTML        = "000000";
        txt.style.gridRow    = 1;
        txt.style.gridColumn = 1;
        grid.appendChild(txt);
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