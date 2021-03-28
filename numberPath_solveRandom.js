let numRows = 9;
let numCols = 9;

let mainTable = document.createElement('table');
let tableRow = undefined;
let createdCell = undefined;

document.body.appendChild(mainTable);

// Initialize the table by looping through the desired number of rows first, creating those
// then looping through the desired number of columns, adding a cell in each row for 
// each desired column. Set the ID of each table cell to be the <rowNum>-<colNum> (0-based)
function setUpGrid(){
    for(let currRow = 0;  currRow < numRows; currRow++){
        //console.log("Curr row is: " + currRow);
        tableRow = document.createElement('tr');
        mainTable.appendChild(tableRow);
        
        for(let currCol = 0; currCol < numCols; currCol++){
            //console.log("Curr col is: " + currCol);
            createdCell = document.createElement('td');
            createdCell.id = currRow + "-" + currCol;
            createdCell.className = 'empty-cell';
            // Add the path order number to the cell
            //createdCell.innerHTML = rowHolder[currRow][currCol];
            // initialize as non-path (will find the path in a later function)
            //createdCell.className = 'non-path';
            
            tableRow.appendChild(createdCell)
        }
    }
}

setUpGrid();

function clearGrid(){
    for(let currRow = 0;  currRow < numRows; currRow++){
        for(let currCol = 0; currCol < numCols; currCol++){
            document.getElementById(currRow + "-" + currCol).innerHTML = "";
            createdCell.className = 'empty-cell';
        }
    }
}

let lastRow = 0;
let lastCol = 0;
// Number of the current cell to fill
let currNum = 1;
let endNum = 0;
let dirSelector = [];
let selectedDir = "";

// Number of full random solves to be done
let iterCount = 200;
let numMoveHolder = [];

function makeMoves(){

    while(currNum <= (numRows * numCols)){
        dirSelector = [];
        selectedDir = "";

        console.log("currNum is: " + currNum);
        if(currNum === 1){
            let pickRow = Math.floor(Math.random() * numRows);
            let pickCol = Math.floor(Math.random() * numCols);
            console.log("The picked cell is: " + pickRow + "," + pickCol);
            document.getElementById(pickRow + "-" + pickCol).innerHTML = currNum;
            lastRow = pickRow;
            lastCol = pickCol;
            currNum++;
            //return;
        } else{

            console.log(lastRow);
            console.log(lastCol);

            //North check
            if(lastRow > 0 && document.getElementById(lastRow - 1 + "-" + lastCol).innerHTML === ""){
                dirSelector.push("N");
                console.log("North OK.")
            }
            //South check
            if(lastRow < numRows - 1 && document.getElementById(lastRow + 1 + "-" + lastCol).innerHTML === ""){
                dirSelector.push("S");
                console.log("South OK.")
            }
            //West check
            // Need parenths around the lastCol addition/subtraction for it to evaluate correctly.
            if(lastCol > 0 && document.getElementById(lastRow + "-" + (lastCol - 1)).innerHTML === ""){
                dirSelector.push("W");
                console.log("West OK.")
            }
            //East check
            if(lastCol < numCols - 1 && document.getElementById(lastRow + "-" + (lastCol + 1)).innerHTML === ""){
                dirSelector.push("E");
                console.log("East OK.") 
            }

            // Randomly select one of the directions represented in the dirSelector.
            // This makes sure each possible direction gets the same probability 
            // of selection regardless of the length of the dirSelector array.
            selectedDir = dirSelector[Math.floor(Math.random() * dirSelector.length)];
            console.log("Selected dir is: " + selectedDir);

            if(selectedDir === "N"){
                document.getElementById(lastRow - 1 + "-" + lastCol).innerHTML = currNum;
                currNum++;
                lastRow = lastRow - 1;
                //return;
            }

            if(selectedDir === "S"){
                document.getElementById(lastRow + 1 + "-" + lastCol).innerHTML = currNum;
                currNum++;
                lastRow = lastRow + 1;
                //return;
            }

            if(selectedDir === "W"){
                document.getElementById(lastRow + "-" + (lastCol - 1)).innerHTML = currNum;
                currNum++;
                lastCol = lastCol - 1;
                //return;
            }

            if(selectedDir === "E"){
                document.getElementById(lastRow + "-" + (lastCol + 1)).innerHTML = currNum;
                currNum++;
                lastCol = lastCol + 1;
                //return;
            }

            // This is the case when there are no more possible moves.
            // The last move was the currNum (where there's no move) - 1
            if(selectedDir === undefined){
                return(currNum - 1);
            }
        }


    }

}

for(let iter = 0; iter < iterCount; iter ++){
    currNum = 1;
    clearGrid();
    endNum = makeMoves();
    numMoveHolder.push(endNum);
    

}


//let nextButton = document.getElementById("forward-button");
//nextButton.addEventListener("click", makeMove); 

/*
for(currNum = 1; currNum <= (numRows * numCols); currNum++){
    makeMove();
    console.log(currNum);
}
*/
 

/*
//function highlightPath(){
let lastMarkedValue = 0;
let lastVisitedCoords = [0][0];
let currVisitedCoords = [0][0];
let currEntry = 0;
let pathNum = 1;
    //for(let pathNum = 1; pathNum <= (numRows * numCols); pathNum ++){
    //for(let pathNum = 1; pathNum <= 15; pathNum ++){    
        // If needing to find the start point for the first number in the array
    //let animateInterval = setInterval(highlightNextCell, 10);
        //highlightNextCell(pathNum);
// The function highlightPath CAN see/set all global vars defined above.
// This IS NOT the case if these vars are defined in a function that calls another function (with the animation call) instead.
let isToggled = undefined;
function queryCheckStatus(){
    isToggled = toggle.checked;
    console.log("isToggled is: " + isToggled);
    // Turn on the auto-animation if toggled, otherwise move manually when the 
    // button is pushed
    if(isToggled){
        window.requestAnimationFrame(highlightPath);
    } 
}
let toggle = document.getElementById("toggle");
toggle.addEventListener("click", queryCheckStatus);
let nextButton = document.getElementById("forward-button");
nextButton.addEventListener("click", highlightPath); 
*/