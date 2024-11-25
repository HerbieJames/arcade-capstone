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
let playerImg = "snake1head1.png";
let player;
let tail;
let snakeBody = [];
let active    = false;
let tick      = 0;

//--SNAKE DECLARATIONS--
const upBtnEl    = document.getElementById("btnUpEl");
const downBtnEl  = document.getElementById("btnDownEl");
const leftBtnEl  = document.getElementById("btnLeftEl");
const rightBtnEl = document.getElementById("btnRightEl");
let playerDir = [-1,0];

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
    var x = element.style.gridColumn
    var y = element.style.gridRow
    return {x: x, y :y}
}

/**Moves a given element on the grid a specified distance and updates their position in the DOM.
 * @param {Element}  element the target HTML element
 * @param  {Number}  x       row distance where positive is right
 * @param  {Number}  y       column distance where posititve is down
 * @return {Object}          the new ".x", ".y" values.
*/
function moveSprite(element, x, y) {
    var currentX = element.style.gridColumn;
    var currentY = element.style.gridRow;
    var targetX  = currentX - -x;
    var targetY  = currentY - -y;
    var neighbor;
    if (targetX < gridXinit) { targetX = gridX; }
    if (targetY < gridYinit) { targetY = gridY; }
    element.style.gridColumn = targetX;
    element.style.gridrow    = targetY;
    neighbor = nearestTile(targetX, targetY);
    if (neighbor != undefined) { neighbor.before(element); }
    return {x: targetX, y: targetY}
}

/**Sets the co-ordiated of a given element on the grid and updates their position in the DOM.
 * @param {Element} element the target HTML element
 * @param {Number}  x       row position of element in grid
 * @param {Number}  y       column position of element in grid
*/
function setSpriteXY(element, x, y) {
    var neighbor = nearestTile(x,y);
    if (neighbor != undefined) { neighbor.before(element); }
    element.style.gridColumn = x;
    element.style.gridRow = y;
}

/**Initializes level by initializing tile sprites into each row
 */
function initLevel() {
    for (let y = (gridYinit); y <= gridY; y++) {
        for (let i = gridXinit; i <= gridX; i++) {
            initSprite(i, y, "ground.png", ["tile"]);
        }
    }
}

/**Creates a sprite with id "player" and src playerImg.
 */
function initPlayer() {
    player = initSprite(playSpawnX, playSpawnY, playerImg, null, "player");
    tail = initSprite(playSpawnX+1, playSpawnY, "snake1tail1.png", ["snake", "entity"], "tail");
    snakeBody.push(tail);
    enableControl();
}

/** Toggles the artwork of sprites relative to the value of tick.
 */
function toggleSprites() {
    if (tick % 2 ==0) {
        player.src = imgRoot + "snake1head1.png"
        tail.src   = imgRoot + "snake1tail2.png"
    } else {
        player.src = imgRoot + "snake1head2.png"
        tail.src   = imgRoot + "snake1tail1.png"
    }
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
        initLevel();
        gridHTML();
        initPlayer();
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
    setTimeout(delta, 500);
}

// --SNAKE FUNCTIONS--
/**Updates the player's position every tick based on their direction
 * of movement.
 */
function movePlayer(){
    var targetX = player.style.gridColumn;
    var targetY = player.style.gridRow;
    console.log(moveSprite(player, playerDir[0], playerDir[1]));
    setSpriteXY(snakeBody[0], targetX ,targetY);
}

/**Effect of user trigger to move player up
*/
function moveUp(event) {
    playerDir = [0, -1]
}

/**Effect of user trigger to move player up
*/
function moveDown(event) {
    playerDir = [0, 1]
}

/**Effect of user trigger to move player light
*/
function moveLeft(event) {
    playerDir = [-1, 0]
}

/**Effect of user trigger to move player right.
*/
function moveRight(event) {
    playerDir = [1, 0]
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

// SCRIPT
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false); //<-- Disables keyboard controls over page navigation.

delta(); //<-- Runs a set of game functions every "tick" (500)