// DECLARATIONS
// --TOOLING DECLARATIONS--
const startBtnEl = document.getElementById("startBtnEl");
const grid       = document.getElementById("gameDisplayEl");
const gridX      = 12;
const gridY      = 12;
const gridXinit  = 1;
const gridYinit  = 2;
const playSpawnX = gridX-1;
const playSpawnY = gridY/2;
const imgRoot    = "./assets/images_snake/";
let playerImg = 1;
let player;
let active    = false;
let tick      = 0;
let speed     = 500;
let score     = 0;

//--SNAKE DECLARATIONS--
const upBtnEl    = document.getElementById("btnUpEl");
const downBtnEl  = document.getElementById("btnDownEl");
const leftBtnEl  = document.getElementById("btnLeftEl");
const rightBtnEl = document.getElementById("btnRightEl");
let playerDir = {x: -1, y: 0};
let snakeBody = [];
let apple;

// FUNCTIONS
// --TOOLING FUNCTIONS--
/**Returns the tile element on or closest ahead of a given co-ordinate on the grid.
 * @param {Number} x coordinate in grid with left as 1
 * @param {Number} y coordinate in grid with top as 1
*/
function nearestTile(x,y) {
    var element;
    for (let i = 0; i <= grid.childElementCount; i++) {
        var head = document.querySelector(`#gameDisplayEl :nth-child(${i})`);
        if (head == undefined)                                           {}
        else if (!head.classList.contains("tile"))                       {}
        else if (head.style.gridRow < y)                                 {}
        else if ((head.style.gridColumn < x)&&(head.style.gridRow == y)) {}
        else {
            element = head; 
            break;
        }
    }
    return element;
}

/**Returns a node list of all elements at a given co-ordinate on the grid.
 * @param  {Number} x coordinate in grid with left as 1
 * @param  {Number} y coordinate in grid with top as 1
 * @return {NodeList} all elements at a given co-ordinate
*/
function allAtXY(x,y) {
    var elements = [];
    for (let i = 0; i <= grid.childElementCount; i++) {
        var head = document.querySelector(`#gameDisplayEl :nth-child(${i})`);
        if (head == undefined) {}
        else if ((head.style.gridColumn == x)&&(head.style.gridRow == y)) {
            elements.push(head);
        }
    }
    return elements;
}

/**Creates linebreaks between rows in grid and spaces (<small>" "</small>) between cells
 * for non-CSS functionality
 */
function gridHTML() {
    console.log("run HTML");
    for (let i = (gridYinit + 1); i <= gridY; i++) {
        console.log("run linebreak");
        var neighbor = nearestTile(gridXinit,i);
        if (neighbor != undefined) {
            var br = document.createElement('br');
            neighbor.insertAdjacentElement("beforebegin", br);
        }
    }
    for (let j = gridYinit; j <= gridY; j++) {
        for (let i = (gridXinit + 1); i <= gridX; i++) {
            console.log("run cellbreak");
            var neighbor = nearestTile(i,j);
            if (neighbor != undefined) {
                var cell = document.createElement('small');
                cell.innerHTML = " ";
                neighbor.insertAdjacentElement("beforebegin", cell);
            }
        }
    }
}

/**Creates an image with src, id and class 
 * at a specified location on the grid, and
 * appropriate position in the DOM
 * @param {Number} x       column position of image in grid
 * @param {Number} y       row position of image in grid
 * @param {String} src     src of image (in imgRoot)
 * @param {Array } classes Array of strings; classes for image to assume
 * @param {String} id      id for image to assume
 * @return {Node }         the generated element
*/
function initSprite(x, y, src, classes, id) {
    var img = document.createElement('img');
    var neighbor = nearestTile(x,y);
    img.classList.add("sprite");
    img.alt = " ";
    img.style.gridColumn = x;
    img.style.gridRow    = y;
    if (src != undefined) { 
        src = imgRoot.concat(src);
        img.src = src;
    }
    if (classes != undefined) { 
        classes.forEach((element) => { img.classList.add(element); });
    }
    if (id  !== undefined) { img.id  = id; }
    if (neighbor != undefined) {
        neighbor.insertAdjacentElement("beforebegin", img);
    } else {
        grid.appendChild(img);
    }
    if (id  !== undefined) {
        console.log('initSprite(): "#'+id, "created before", neighbor+'"', img);
    }
    return img;
}

/**Returns the grid co-ordinates of a given element
 * @param {Element} element the target HTML element
 * @return {Object}         the ".x" and ".y" values.
*/
function getSpriteXY(element) {
    var x = Number(element.style.gridColumn)
    var y = Number(element.style.gridRow)
    return {x: x, y :y}
}

/**Returns whether a given coordinate on the grid can be moved to by the player.
 * @param  {NodeList} ahead    All elements at a given coordinate
 * @return {Object}            An object of boolean elements named "score" and "death".
*/
function checkXY(ahead) {
    var death    = false;
    var score    = false;
    ahead.forEach((element) => {
        if (element.classList.contains("point")) { score    = true;  }
        if (element.classList.contains("hurts")) { death    = true;  }
    });
    return {death: death, score: score};
}

/**Sets the co-ordiated of a given element on the grid and updates
 * their position in the DOM.
 * @param {Element}  element the target HTML element
 * @param {Number}   x       row position of element in grid
 * @param {Number}   y       column position of element in grid
 * @returns {Object}         the new ".x", ".y" values.
*/
function setSpriteXY(element, x, y) {
    var neighbor = nearestTile(x,y);
    if (neighbor != undefined) { neighbor.before(element); }
    element.style.gridColumn = x;
    element.style.gridRow = y;
    return {x: x, y: y}
}

/**Sets a given element's rotation to a specified angle in degrees.
 * @param {Element} element the target HTML element
 * @param {Number}  deg     orientation to set element where 0 is up
*/
function setSpriteDeg(element, deg) {
    element.style.transform = `rotate(${deg}deg)`;
}

/**Takes a right unit vector and converts it to an angle in degrees from left
 * @param {Object} dir right unit vector
 * @returns {Number}   degrees from left
 */
function dirToDeg(dir){
    var degrees
    if (dir.x == 1) { degrees = 180;}
    else { degrees = 180*(dir.x + 1) + 90*dir.y; }
    return degrees;
}

// --SNAKE FUNCTIONS--

/**Increases the player's score by a specified amount, and updates the display's HTML
 * @param {Number} x amount to increase the player's score by.
 */
function addScore(x) {
    score += x
    var scoreTxt = "";
    for (let i = 1; i <= (6 - Math.floor(Math.log10(score)+1)); i++) { scoreTxt += "0"; }
    scoreTxt += score;
    document.getElementById("scoreEl").innerHTML = scoreTxt;
    console.log(x, "Points! Score:", scoreTxt);
}

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
    addScore(250);
    apple.remove();
    speed -= 10;
    console.log(speed);
}

/**Initializes level by initializing tile sprites into each row
 */
function initLevel() {
    makeApple();
    for (let y = (gridYinit); y <= gridY; y++) {
        for (let i = gridXinit; i <= gridX; i++) {
            initSprite(i, y, "ground.png", ["tile"]);
        }
    }
}

/**Creates a sprite with id "player" and src playerImg.
 */
function initPlayer() {
    player = initSprite(playSpawnX, playSpawnY, `snake${playerImg}head1.png`, null, "player");
    snakeBody.push( 
        initSprite(playSpawnX+1, playSpawnY, `snake${playerImg}body1.png`, ["player", "hurts"])
    );
    enableControl();
}

/**Updates the player's position every tick based on their direction
 * of movement.
 */
function movePlayer(){
    var targetXY = getSpriteXY(player);
    var headX  = targetXY.x + playerDir.x;
    var headY  = targetXY.y + playerDir.y;
    var ahead;
    if (headX < gridXinit) { headX = gridX; }
    if (headY < gridYinit) { headY = gridY; }
    if (headX > gridX) { headX = gridXinit; }
    if (headY > gridY) { headY = gridYinit; }
    ahead = allAtXY(headX, headY);
    if (checkXY(ahead).score == true) { eatApple(); makeApple(); }
    setSpriteXY(player, headX, headY);
    setSpriteDeg(player, dirToDeg(playerDir));
    snakeBody.forEach((element) => {
        targetXY = setSpriteXY(element, targetXY.x, targetXY.y);
    })
}

/**Effect of user trigger to move player up
*/
function moveUp(event) {
    if (playerDir.y != 1) { playerDir = {x: 0, y: -1}; }
    else { console.log("INVALID TURN");}
}

/**Effect of user trigger to move player up
*/
function moveDown(event) {
    if (playerDir.y != -1) { playerDir = {x: 0, y: 1}; }
    else { console.log("INVALID TURN");}
}

/**Effect of user trigger to move player light
*/
function moveLeft(event) {
    if (playerDir.x != 1) { playerDir = {x: -1, y: 0}; }
    else { console.log("INVALID TURN");}
}

/**Effect of user trigger to move player right.
*/
function moveRight(event) {
    if (playerDir.x != -1) { playerDir = {x: 1, y: 0}; }
    else { console.log("INVALID TURN");}
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

/**Initializes Game
 */
function startUp() {
    if (active == false) {
        active = true;
        tick = 1;
        startBtnEl.style.display = "none";
        var txt = document.createElement('p');
        txt.style.color = "white";
        txt.style.backgroundColor = "black";
        txt.classList.add(`score-area`);
        txt.style.gridRow    = 1;
        txt.id = `scoreEl`;
        txt.innerHTML = "000000";
        txt.style.gridColumn = 1;
        grid.appendChild(txt);
        initPlayer();
        initLevel();
        gridHTML();
    }
}

/**Runs every 500, and shuffles through tick values 1 -> 4 (1, 2, 3, 4, 1...)
*/
function delta(){
    if ((active == false) && (tick % 2 == 0)) {
        startBtnEl.innerHTML = startBtnEl.innerHTML == "" ? "START" : "";
    } else if (active == false) {} 
    else {
        movePlayer();
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