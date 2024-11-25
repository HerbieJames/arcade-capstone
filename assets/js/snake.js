// DECLARATIONS
const startBtnEl = document.getElementById("startBtnEl");
const grid       = document.getElementById("gameDisplayEl");
const gridX      = 12;
const gridY      = 12;
const gridXinit  = 1;
const gridYinit  = 2;
const imgRoot    = "./assets/images_snake/";
let playerImg = "snake1head1.png";
let player;
let active = false;
let tick = 0;

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

/**Initializes level by initializing tile sprites into each row
 */
function initLevel() {
    for (let y = (gridYinit); y < gridY; y++) {
        for (let i = gridXinit; i <= gridX; i++) {
            initSprite(i, y, "ground.png", ["tile"]);
        }
    }
}

/**Initializes Game
 */
function startUp() {
    if (active == false) {
        active = true;
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
    }
}

/**Runs every 500 //*, and shuffles through tick values 1 -> 4 (1, 2, 3, 4, 1...)
*/
function delta(){
    if ((active == false) && (tick % 2 == 0)) {
        startBtnEl.innerHTML = startBtnEl.innerHTML == "" ? "START" : "";
    } else if (active == false) {} 
    else {
        // *
    }
    tick += tick == 4 ? (-3) : 1;
    setTimeout(delta, 500); //*
}

// SCRIPT
delta();