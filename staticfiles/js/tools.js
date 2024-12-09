// DECLARTIONS 
const grid    = document.getElementById("gameDisplayEl");
const startBtnEl = document.getElementById("startBtnEl");
const hiScoreEl  = document.getElementById("hiScoreScreenEl");
const submitEl   = document.getElementById("submitBtnEl");
const retryEl   = document.getElementById("retryBtnEl");
const imgRoot = ImgsPath;
let gridX      = 11;
let gridY      = 11;
let gridXinit  = 2;
let gridYinit  = 2;
let score      = 0;
let scoreEl;
let nameEl;

// FUNCTIONS
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
        // console.log('initSprite(): "#'+id, "created before", neighbor+'"', img);
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
 * @returns {Object}         the old ".x", ".y" values.
*/
function setSpriteXY(element, x, y) {
    var neighbor = nearestTile(x,y);
    if (neighbor != undefined) { neighbor.before(element); }
    oldX = getSpriteXY(element).x
    oldY = getSpriteXY(element).y
    element.style.gridColumn = x;
    element.style.gridRow = y;
    return {x: oldX, y: oldY}
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

/**Increases the player's score by a specified amount, and updates the display's HTML
 * @param {Number} x amount to increase the player's score by.
 */
function addScore(x) {
    score += x
    var scoreTxt = "";
    for (let i = 1; i <= (6 - Math.floor(Math.log10(score)+1)); i++) { scoreTxt += "0"; }
    scoreTxt += score;
    document.getElementById("id_value").setAttribute("value", scoreTxt)
    console.log(x+ " Points! Score: "+ scoreTxt);
}

let startReady = true;

function tryStartUp() {
    try {
        startUp(); 
    } catch (error) { 
       console.log(error);
       document.getElementById("startBtnEl").innerHTML = "OUT OF ORDER";
    }
}

setTimeout(document.addEventListener('keyup', tryStartUp), 1500);