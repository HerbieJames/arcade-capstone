// DECLARATIONS
const startBtnEl = document.getElementById("startBtnEl");
const grid = document.getElementById("gameDisplayEl");
let active = false;
let tick = 0;

// FUNCTIONS
/**Initializes Game
 */
function startUp() {
    if (active == false) {
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