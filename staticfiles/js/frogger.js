// DECLARATIONS
// --TOOLING DECLARATIONS--
gridX      = 12;
gridY      = 12;
gridXinit  = 1;
gridYinit  = 2;

//--SNAKE DECLARATIONS--
const upBtnEl    = document.getElementById("btnUpEl");
const downBtnEl  = document.getElementById("btnDownEl");
const leftBtnEl  = document.getElementById("btnLeftEl");
const rightBtnEl = document.getElementById("btnRightEl");
const playSpawnX = 6
const playSpawnY = 12
const maxSpeed   = 500;
const DeathImg   = "frog3.PNG";
let speed        = maxSpeed;
let lives        = 0;
let tick         = 0;
let gameOn       = false;
let roadRows     = [];
let waterRows    = [];
let grassRows    = [];
let playerImg    = "frog1.PNG";
let player;
let fly;

// FUNCTIONS

/** Toggles the artwork of sprites relative to the value of tick.
 */
function toggleSprites() {
    var water1PNG = imgRoot + "water1.PNG"
    var water2PNG = imgRoot + "water2.PNG"
    var water1tiles = grid.querySelectorAll(`img[src='${water1PNG}']`)
    var water2tiles = grid.querySelectorAll(`img[src='${water2PNG}']`)
    var fly1PNG = imgRoot + "fly1.PNG"
    var fly2PNG = imgRoot + "fly2.PNG"
    var fly1tiles = grid.querySelectorAll(`img[src='${fly1PNG}']`)
    var fly2tiles = grid.querySelectorAll(`img[src='${fly2PNG}']`)
    water1tiles.forEach((element) => {
        element.src = water2PNG;
    });
    water2tiles.forEach((element) => {
        element.src = water1PNG;
    });
    fly1tiles.forEach((element) => {
        element.src = fly2PNG;
    });
    fly2tiles.forEach((element) => {
        element.src = fly1PNG;
    });
}

/**Initializes appropriate road tile art on the rows specified for level generation with initLevel.
 * @param {Array} y the rows where tiles will be generated
 */
function initRoadRows(y) {
    y.forEach((element) => {
        if (!y.includes(element-1) && !y.includes(element+1)) {
            for (let i = gridXinit; i <= gridX; i++) {
                initSprite(i, element, "road1.PNG", ["tile", "road"]);
            }
        } else if (!y.includes(element-1)) {
            for (let i = gridXinit; i <= gridX; i++) {
                initSprite(i, element, "road2.PNG", ["tile", "road"]);
            }
        } else if (!y.includes(element+1)) {
            for (let i = gridXinit; i <= gridX; i++) {
                initSprite(i, element, "road3.PNG", ["tile", "road"]);
            }
        } else {
            for (let i = gridXinit; i <= gridX; i++) {
                initSprite(i, element, "road4.PNG", ["tile", "road"]);
            }
        }
    });
}

/**Initializes water tiles on the rows specified for level generation with initLevel.
 * @param {Array} y the rows where tiles will be generated
 */
function initWaterRows(y) {
    y.forEach((element) => {
        for (let i = gridXinit; i <= gridX; i++) {
            if ((i + (gridX-1)*element) % 2 == 0) {
                initSprite(i, element, "water1.PNG", ["tile", "water", "hurts"]);
            } else {
                initSprite(i, element, "water2.PNG", ["tile", "water", "hurts"]);
            }
        }
    });
}

/**Initializes grass tiles on the rows specified for level generation with initLevel.
 * @param {Number} y the rows where tiles will be generated
 */
function initGrassRows(y) {
    var bugCell  = 0;
    y.forEach((element) => {
        var obstCell = 0;
        for (let i = gridXinit; i <= gridX; i++) {
            var above = allAtXY(i, (element - 1));
            var obstValid = (!y.includes(element - 1) && (obstCell < gridX/2)) || (!checkXY(above).moveable);
            if (obstValid && (Math.random() <= 0.09375)) {
                initSprite(i, element, "rock1.PNG", ["tile", "obst"]);
                obstCell += 1;
            } else if (obstValid && Math.random() <= 0.28125) {
                initSprite(i, element, "tree1.PNG", ["tile", "obst"]);
                obstCell += 1;
            } else if ((bugCell != 1)&&(Math.random() <= 0.01)) {
                fly = initSprite(i, element, "fly1.PNG", ["tile", "point"], "fly");
                bugCell += 1;
            } else {
                initSprite(i, element, "grass1.PNG", ["tile", "grass"]);
            }
        }
    });
}

// --LEVEL FUNCTIONS--
/**Initializes level by randomly allocating certain
 * types of tiles to certain rows, then initializing them.
 */
function initLevel() {
    roadRows  = []
    waterRows = []
    grassRows = []
    for (let i = gridXinit; i <= gridX; i++) {
        initSprite(i, gridYinit, "grass4.PNG", ["tile"]);
    }
    for (let y = (gridYinit + 1); y < gridY; y++) {
        var roadRow  = 9 - roadRows.length;
        var waterRow = 9 - (document.querySelectorAll('#gameDisplayEl .water').length)/gridX;
        var grassRow = 9 - (document.querySelectorAll('#gameDisplayEl .water').length)/gridX;
        var totalRow = roadRow + waterRow + grassRow;
        if ((score >= 2000) && (totalRow * Math.random() <= roadRow)) {
            roadRows.push(y);
        } else if (((score >= 1000) && !((score >= 2000) && (score <= 3000))) &&
        (totalRow * Math.random() <= roadRow + waterRow))  {
            waterRows.push(y);
        } else {
            grassRows.push(y);
        }
    }
    console.log("road:", roadRows);
    console.log("water:", waterRows);
    console.log("grass:", grassRows);
    initRoadRows(roadRows);
    initWaterRows(waterRows);
    initGrassRows(grassRows);
    for (let i = gridXinit; i <= gridX; i++) {
        initSprite(i, gridY, "grass3.PNG", ["tile"]);
    }
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
    //
    console.log("----CLEARED----")
}

/**Disables controls, gives points, pauses the game and prepares the next level
 */
function stageLvl() {
    clearLvl();
    addScore(1000);
    setTimeout(function() {
        initLevel();
        gridHTML();
        setPlayer(playSpawnX, playSpawnY);
        tick = 1;
    }, speed);
}

/**Creates a sprite with id "player" and src playerImg.
 */
function initPlayer() {
    initSprite(gridXinit, gridYinit, playerImg, null, "player");
    player = document.getElementById("player");
}

/**Sets the player's coordinates to the centre of the bottom row
 */
function setPlayer(x, y) {
    active = true;
    setSpriteXY(player, x, y);
    setTimeout(enableControl, 250);
    player.src = imgRoot + playerImg;
}

/**Removes the player and determines whether to continue or end the game.
 */
function endPlayer() {
    if (active == true) {
        var life;
        active = false;
        disableControl();
        player.src = imgRoot + DeathImg;
        allAtXY(gridX + 1 - lives, 1).forEach((element) => {
            if (element.classList.contains("life")) { life = element; }
        });
        console.log("lives:", lives);
        if (lives != 0) { 
            life.remove();
            lives -= 1
            console.log("life lost:", life, lives, "left")
            setTimeout(function() { setPlayer(playSpawnX, playSpawnY);}, 1000);
        } else { setTimeout(endGame, 1000); }
    }
}

function eatFly() {
    console.log("lives:", lives);
    addScore(250);
    initSprite(fly.style.gridColumn, fly.style.gridRow, "grass2.PNG", ["tile"]);
    fly.remove();
    initSprite(gridX - lives, 1, playerImg, ["life"]);
    lives += 1
    console.log("lives:", lives);
}

/**Effect of user trigger to move player up
*/
function moveUp(event) {
    var ahead = allAtXY(player.style.gridColumn, (player.style.gridRow - 1));
    setSpriteDeg(player, 0);
    if (checkXY(ahead).moveable) {
        moveSprite(player, 0, -1);
        if (checkXY(ahead).death) {   endPlayer(); }
        else if (checkXY(ahead).score) { eatFly(); }
    }
    if (player.style.gridRow == gridYinit) { stageLvl(); }
}

/**Effect of user trigger to move player up
*/
function moveDown(event) {
    var ahead = allAtXY(player.style.gridColumn, (player.style.gridRow - -1));
    setSpriteDeg(player, 180);
    if (checkXY(ahead).moveable) {
        moveSprite(player, 0, 1);
        if (checkXY(ahead).death) {   endPlayer(); }
        else if (checkXY(ahead).score) { eatFly(); }
    }
}

/**Effect of user trigger to move player light
*/
function moveLeft(event) {
    var ahead = allAtXY((player.style.gridColumn - 1), player.style.gridRow);
    setSpriteDeg(player, -90);
    if (checkXY(ahead).moveable) {
        moveSprite(player, -1, 0);
        if (checkXY(ahead).death) {   endPlayer(); }
        else if (checkXY(ahead).score) { eatFly(); }
    }
}


/**Effect of user trigger to move player right.
*/
function moveRight(event) {
    var ahead = allAtXY((player.style.gridColumn - -1), player.style.gridRow);
    setSpriteDeg(player, 90);
    if (checkXY(ahead).moveable) {
        moveSprite(player, 1, 0);
        if (checkXY(ahead).death) {   endPlayer(); }
        else if (checkXY(ahead).score) { eatFly(); }
    }
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

function typeName() {
    nameEl = document.getElementById('id_alias');
    nameEl.classList.add(`score-area`);
    nameEl.style.display = "block"
    nameEl.focus();
    nameEl.select();
    submitEl.style.display = "block";
}

function tryAgain(e) {
    console.log(e.code)
    if (e.code = "Escape") {
        document.removeEventListener('keyup', tryAgain);
        hiScoreEl.style.display  = "inline";
        startBtnEl.style.display = "flex";
        nameEl.style.display     = "none";
        submitEl.style.display   = "none";
        retryEl.style.display    = "none";
        scoreEl.style.display    = "none";
        document.getElementById("gameOverEl").style.display = "none";
        startReady = true;
    }
}

function endGame() {
    var txt = document.createElement('p');
    txt.classList.add(`score-area`);
    txt.innerHTML = "GAME OVER";
    txt.id = "gameOverEl";
    grid.appendChild(txt);
    txt.style.gridColumnStart = gridXinit;
    txt.style.gridColumnEnd   = gridX + 1;
    txt.style.gridRowStart    = gridYinit;
    txt.style.gridRowEnd      = gridY;
    txt.style.justifyContent  = "center"
    player.remove();
    clearLvl();
    typeName();
    setTimeout(function() {
        document.addEventListener('keyup', tryAgain)
        retryEl.style.display = "block";
    }, 3000);
}

/**Initializes Game
 */
function startUp() {
    if (startReady == true) {
        startReady = false;
        tick = 1;
        score = 0;
        hiScoreEl.style.display = "none";
        scoreEl = document.getElementById('id_value');
        scoreEl.classList.add(`score-area`);
        scoreEl.style.display = "block"
        initPlayer();
        initLevel();
        setPlayer(playSpawnX, playSpawnY)
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
        toggleSprites();
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