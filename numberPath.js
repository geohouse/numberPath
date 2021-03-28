let numRows = 9;
let numCols = 9;

let mainTable = document.createElement('table');
let tableRow = undefined;
let createdCell = undefined;

document.body.appendChild(mainTable);

//  Use an object to hold the order of the number entries in the grid.
// The keys are the id of cells from top left (0) to lower right (80)
// scanning row by row. The values are the number to display in each cell 
// i.e. the order that cell will be visited in the path (from 1-81)
/*
numberOrder = {
    0: , 1: , 2: , 3: , 4: , 5: , 6: , 7: , 8: , 9: , 10: ,
    11: , 12: , 13: , 14: , 15: , 16: , 17: , 18: , 19: , 20: ,
    21: , 22: , 23: , 24: , 25: , 26: , 27: , 28: , 29: , 30: ,
    31: , 32: , 33: , 34: , 35: , 36: , 37: , 38: , 39: , 40: ,
    41: , 42: , 43: , 44: , 45: , 46: , 47: , 48: , 49: , 50: ,
    51: , 52: , 53: , 54: , 55: , 56: , 57: , 58: , 59: , 60: ,
    61: , 62: , 63: , 64: , 65: , 66: , 67: , 68: , 69: , 70: ,
    71: , 72: , 73: , 74: , 75: , 76: , 77: , 78: , 79: , 80: 
}
*/

// 1 array per row, wrapped in a larger array to make 2-D
let rowHolder = [
[47, 48, 51, 52, 81, 74, 73, 70, 69],
[46, 49, 50, 53, 80, 75, 72, 71, 68],
[45, 40, 39, 54, 79, 76, 65, 66, 67],
[44, 41, 38, 55, 78, 77, 64, 63, 62],
[43, 42, 37, 56, 57, 58, 59, 60, 61],
[34, 35, 36, 1, 2, 3, 4, 5, 6],
[33, 32, 25, 24, 19, 18, 13, 12, 7],
[30, 31, 26, 23, 20, 17, 14, 11, 8],
[29, 28, 27, 22, 21, 16, 15, 10, 9]
];

console.log("rowHolder is: " + rowHolder);

console.log(rowHolder[0][3]);

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
            // Add the path order number to the cell
            createdCell.innerHTML = rowHolder[currRow][currCol];
            // initialize as non-path (will find the path in a later function)
            createdCell.className = 'non-path';
            
            tableRow.appendChild(createdCell)
        }
    }
}

// Find the way through the grid and highlight the cells as it goes in a different color

function highlightPath(){
    /*
    if(pathNum === (numRows * numCols)){
        clearInterval(animateInterval);
    }
    */
    console.log("Path num is: " + pathNum);
    if(pathNum === 1){
        for(let currRow = 0;  currRow < numRows; currRow++){
            //console.log("Curr row is: " + currRow);
            for(let currCol = 0; currCol < numCols; currCol++){
                //console.log("Curr col is: " + currCol)
                currEntry = rowHolder[currRow][currCol]
                if(currEntry === 1){
                    currVisitedCoords = [currRow, currCol];
                    document.getElementById(currRow + "-" + currCol).className = "chosen-path";
                    lastVisitedCoords = currVisitedCoords;
                    pathNum++;
                }
            }
        }
    } else{
        console.log("In else.");
        console.log("Path num in else is: " + pathNum);
        console.log(lastVisitedCoords[0]);
        console.log(lastVisitedCoords[1]);
        // Check the 4 possible directions around the last cell to find
        // the next highest number.

        // Check North if not the first row
        if(lastVisitedCoords[0] > 0){
            //console.log("In N check");
            if(rowHolder[lastVisitedCoords[0] - 1][lastVisitedCoords[1]] === pathNum){
                console.log("in if.")
                currVisitedCoords = [lastVisitedCoords[0] - 1, lastVisitedCoords[1]]
                document.getElementById(currVisitedCoords[0] + "-" + currVisitedCoords[1]).className = "chosen-path";
                lastVisitedCoords = currVisitedCoords;
                pathNum++;
                console.log("Going to the North cell.");
                // If this is being run manually, then return to prevent 
                // double moves. Else if running automatically, let it 
                // continue
                if(!isToggled){
                    return;
                }
            }
        }

        // Check South if not the last row
        if(lastVisitedCoords[0] < numRows - 1){
            //console.log("In S check");
            if(rowHolder[lastVisitedCoords[0] + 1][lastVisitedCoords[1]] === pathNum){
                console.log("in if.")
                currVisitedCoords = [lastVisitedCoords[0] + 1, lastVisitedCoords[1]]
                document.getElementById(currVisitedCoords[0] + "-" + currVisitedCoords[1]).className = "chosen-path";
                lastVisitedCoords = currVisitedCoords;
                pathNum++;
                console.log("Going to the South cell.");
                // If this is being run manually, then return to prevent 
                // double moves. Else if running automatically, let it 
                // continue
                if(!isToggled){
                    return;
                }
            }
        }

        // Check West if not the first col
        if(lastVisitedCoords[1] > 0){
            //console.log("In W check");
            if(rowHolder[lastVisitedCoords[0]][lastVisitedCoords[1] - 1] === pathNum){
                console.log("in if.")
                currVisitedCoords = [lastVisitedCoords[0], lastVisitedCoords[1] - 1]
                document.getElementById(currVisitedCoords[0] + "-" + currVisitedCoords[1]).className = "chosen-path";
                lastVisitedCoords = currVisitedCoords;
                pathNum++;
                console.log("Going to the West cell.");
                // If this is being run manually, then return to prevent 
                // double moves. Else if running automatically, let it 
                // continue
                if(!isToggled){
                    return;
                }
            }
        }

        // Check East if not the last col
        if(lastVisitedCoords[1] < numCols - 1){
            //console.log("In E check");
            //console.log(lastVisitedCoords[0]);
            //console.log(lastVisitedCoords[1] + 1);
            //console.log(rowHolder[5][4]);
            if(rowHolder[lastVisitedCoords[0]][lastVisitedCoords[1] + 1] === pathNum){
                //console.log("in if.")
                currVisitedCoords = [lastVisitedCoords[0], lastVisitedCoords[1] + 1]
                document.getElementById(currVisitedCoords[0] + "-" + currVisitedCoords[1]).className = "chosen-path";
                lastVisitedCoords = currVisitedCoords;
                pathNum++;
                console.log("Going to the East cell.");
                // If this is being run manually, then return to prevent 
                // double moves. Else if running automatically, let it 
                // continue
                if(!isToggled){
                    return;
                }
            }
        }
    }
    
    if(isToggled === true && pathNum <= (numRows * numCols)){
        window.requestAnimationFrame(highlightPath)
    } 
}

setUpGrid();

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



