let debugMode = false;

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

function clearGrid(){
    for(let currRow = 0;  currRow < numRows; currRow++){
        for(let currCol = 0; currCol < numCols; currCol++){
            document.getElementById(currRow + "-" + currCol).innerHTML = "";
            createdCell.className = 'empty-cell';
        }
    }
}

setUpGrid();

// This is an array of arrays that will emulate the grid and will allow 
// reporting of any finished grids

let tableArray = [];

function setUpArray(){
    tableArray = [];
    for(let row = 0; row< numRows; row ++){
        tableArray.push(Array(numCols));
    }
    return tableArray;
}


setUpArray();

let direction = undefined;
let distRow = undefined;
let distCol = undefined;
let dist = undefined;

function getDistance(direction, distRow , distCol){
    if(debugMode){
        console.log("In getDistance.");
        console.log("Direction is: " + direction);
        console.log("distRow is: " + distRow);
        console.log("distCol is: " + distCol);
    }

    dist = 0;

    if(direction === "N"){
        while(distRow > 0){
            if(debugMode){
                console.log("In N while");
            }
            if(document.getElementById(distRow - 1 + "-" + distCol).innerHTML === ""){
                if(debugMode){
                    console.log("Incrementing N dist");
                }
                dist ++;
                distRow = distRow - 1;

            } else if(document.getElementById(distRow - 1 + "-" + distCol).innerHTML != ""){
                // Return as soon as hit an element that's filled (i.e. don't skip over filled 
                // elements and then keep counting dist with any non-filled elements until running 
                // out of elements to tabulate)
                if(debugMode){
                    console.log("Returning early for N.");
                }
                return dist;
            } 
        }
    }

    if(direction === "S"){
        while(distRow < numRows - 1){
            if(debugMode){
                console.log("In S while");
            }
            if(document.getElementById(distRow + 1 + "-" + distCol).innerHTML === ""){
                if(debugMode){
                    console.log("Incrementing S dist");
                }
                dist ++;
                distRow = distRow + 1;

            } else if(document.getElementById(distRow + 1 + "-" + distCol).innerHTML != ""){
                // Return as soon as hit an element that's filled (i.e. don't skip over filled 
                // elements and then keep counting dist with any non-filled elements until running 
                // out of elements to tabulate)
                if(debugMode){
                    console.log("Returning early for S.");
                }
                return dist;
            } 
        }
    }


    if(direction === "W"){
        while(distCol > 0){
            if(debugMode){
                console.log("In W while");
            }
            if(document.getElementById(distRow + "-" + (distCol - 1)).innerHTML === ""){
                if(debugMode){
                    console.log("Incrementing W dist");
                }
                dist ++;
                distCol = distCol - 1;

            } else if(document.getElementById(distRow + "-" + (distCol - 1)).innerHTML != ""){
                // Return as soon as hit an element that's filled (i.e. don't skip over filled 
                // elements and then keep counting dist with any non-filled elements until running 
                // out of elements to tabulate)
                if(debugMode){
                    console.log("Returning early for W.");
                }
                return dist;
            } 
        }
    }

    if(direction === "E"){
        while(distCol < numCols - 1){
            if(debugMode){
                console.log("In E while");
            }
            if(document.getElementById(distRow + "-" + (distCol + 1)).innerHTML === ""){
                if(debugMode){
                    console.log("Incrementing E dist");
                }
                dist ++;
                distCol = distCol + 1;

            } else if(document.getElementById(distRow + "-" + (distCol + 1)).innerHTML != ""){
                // Return as soon as hit an element that's filled (i.e. don't skip over filled 
                // elements and then keep counting dist with any non-filled elements until running 
                // out of elements to tabulate)
                if(debugMode){
                    console.log("Returning early for E.");
                }
                return dist;
            } 
        }
    }

    return dist;
}


let lastRow = 0;
let lastCol = 0;
// Number of the current cell to fill
let currNum = 1;
let dirSelector = [];
let selectedDir = "";

// Number of full random solves to be done
// and holder for the output state of each 
// solve attempt.
let iterCount = 5000;
let moveHolder = [];
let returnedMove = [];

// This will be a nested array to hold the distances e.g. [['N',8], ['S':2]]
let distHolder = [];

function initializeDistHolder(){
    distHolder = [['N',-1], ['S',-1], ['W',-1], ['E', -1]];
    return distHolder;
}

let currDist = 0;

let matchedIndices = [];
let matchedDirections = [];
let directionWeights = [];
// The probability of visiting any cell that is distance 1 away ( x however many)
// directions have a distance of 1. (all other cells have probability of 1-dist1Weight). 0.95
// 1.0 (with dist2Weight 0.55) returns average of 40 cells filled over 500 iterations and reliably >= 1 solve/500 runs.
let dist1Weight = 1.0;
// The probability of NOT visiting any cell that is distance 2 away (to try and 
// prevent cut-offs of paths that would otherwise be viable 'turn-arounds'). 0.55
let dist2Weight = 0.7;

// Will be an nested Array returned by makeMoves,
// where the first element in each nested Array is
// the number of moves completed, and the second element
// is the table status array showing what was filled in.
let moveReturn = [];
function makeMoves(){

    while(currNum <= (numRows * numCols)){
        dirSelector = [];
        selectedDir = "";
        distHolder = initializeDistHolder();
        currDist = 0;
        directionWeights = [];
        moveReturn = [];
        if(debugMode){
            console.log(currNum);
        }

        if(currNum === 1){
            let pickRow = Math.floor(Math.random() * numRows);
            let pickCol = Math.floor(Math.random() * numCols);
            if(debugMode){
                console.log("The picked cell is: " + pickRow + "," + pickCol);
            }
            document.getElementById(pickRow + "-" + pickCol).innerHTML = currNum;
            tableArray[pickRow][pickCol] = currNum;
            lastRow = pickRow;
            lastCol = pickCol;
            currNum++;
            //return;
        } else{
            if(debugMode){
                console.log(lastRow);
                console.log(lastCol);
            }

            //North check
            if(lastRow > 0 && document.getElementById(lastRow - 1 + "-" + lastCol).innerHTML === ""){
                //dirSelector.push("N");
                
                currDist = getDistance("N", lastRow, lastCol);
                if(debugMode){
                    console.log("North OK.");
                    console.log("currDist N is: " + currDist);
                }
                distHolder[0][0] = "N"
                distHolder[0][1] = currDist;

                
            } 

            //South check
            if(lastRow < numRows - 1 && document.getElementById(lastRow + 1 + "-" + lastCol).innerHTML === ""){
                //dirSelector.push("S");
                currDist = getDistance("S", lastRow, lastCol);
                
                if(debugMode){
                    console.log("South OK.");
                    console.log("currDist S is: " + currDist);
                }
                //distHolder[1] is for S
                distHolder[1][0] = "S"
                distHolder[1][1] = currDist;
            }

            //West check
            // Need parenths around the lastCol addition/subtraction for it to evaluate correctly.
            if(lastCol > 0 && document.getElementById(lastRow + "-" + (lastCol - 1)).innerHTML === ""){
                //dirSelector.push("W");
                currDist = getDistance("W", lastRow, lastCol);
                if(debugMode){
                    console.log("West OK.");
                    console.log("currDist W is: " + currDist);
                }
                distHolder[2][0] = "W";
                distHolder[2][1] = currDist;
            } 


            //East check
            if(lastCol < numCols - 1 && document.getElementById(lastRow + "-" + (lastCol + 1)).innerHTML === ""){
                //dirSelector.push("E");
                currDist = getDistance("E", lastRow, lastCol);
                if(debugMode){
                    console.log("East OK.");
                    console.log("currDist E is: " + currDist);
                }
                distHolder[3][0] = "E";
                distHolder[3][1] = currDist;
            } 

            function removeBlankDists(distHolder){
                
                // Because this for loop deletes values from the array it's looping through,
                // and does that by index, need to loop through in reverse order to 
                // delete reliably using original index values
                for(let i = distHolder.length - 1; i > -1; i--){
                    // If there's still the default -1 value in the object for the 
                    // currently looped index (direction), then remove  that
                    // direction from the distHolder
                    if(debugMode){
                        console.log("in remove blank dists");
                        //console.log("length is: " + Object.keys(distHolder).length);
                        //console.log("i is: " + i);
                        console.log("key is: " + distHolder[i][0]);
                    }
                    if(distHolder[i][1] === -1) {
                        if(debugMode){
                            console.log("Removing key: " + distHolder[i][0]);
                        }
                        // Remove 1 element at index i
                        distHolder.splice(i,1);
                    }
                }
                return distHolder;
            }

            // Clean up the distHolder Object to remove any entries with -1 (default)
            // entries, and therefore no distance to travel in that/those direction(s).
            distHolder = removeBlankDists(distHolder);

            if(debugMode){
                console.log("The distHolder keys are: " + Object.keys(distHolder));
                console.log("The distHolder values are: " + Object.values(distHolder));
            }
            
            // Returns the indexes of the distHolder that meet the valueToMatch criteria.
            /*
            function which(valueToMatch){
                let indices = [];
                for(let i = 0; i < distHolder.length; i++){
                    if(Object.values(distHolder)[i] === valueToMatch){
                        indices.push(i);
                    }
                }
                return(indices);
            }
            
            */

            // Get the directions that have a distance matching the valueToMatch input
            function getMatchedDirections(valueToMatch){
                let matchedDirs = [];
                let indexVal = undefined;
                let currentKey = "";
                for(let i = 0; i < distHolder.length; i++){
                    
                    if(distHolder[i][1] === valueToMatch){

                        matchedDirs.push(distHolder[i][0]);
                    }
                    /*
                    indexVal = matchedIndices[i];
                    for(let j = 0; j< Object.keys(distHolder).length; j++){
                        currentKey = Object.keys(distHolder)[j];
                        if(current)
                    }
                    */
                    
                }
                return matchedDirs;
            }


            // Create a weighted decision vector to decide where to go next.
            // First, identify any '1' distances. If present,
            // Find any distances that are 1, and go in that direction. If more than one direction === 1,
            // then pick randomly between them.

            //console.log("The dir selector is: " + dirSelector);
            
            

            function inMatchedDirections(input){
                let match = false;
                for (let i = 0; i < matchedDirections.length; i++){
                    if(matchedDirections[i] === input){
                        match = true;
                    }
                }
                return match;
            }

            //matchedIndices = which(1);
            matchedDirections = getMatchedDirections(1);
            
            if(matchedDirections.length > 0){
                if(debugMode){
                    console.log("Matched directions 1 are: " + matchedDirections);
                }


                for(let i = 0; i< distHolder.length; i++){
                    // if the iterated direction of distHolder is in
                    // the matched directions, then add the higher weight to the 
                    // direction. Otherwise add 1-higher weight. 
                    if(inMatchedDirections(distHolder[i][0])){
                        directionWeights[i] = [distHolder[i][0], dist1Weight]; 
                    } else{
                        directionWeights[i] = [distHolder[i][0], 1 - dist1Weight];
                    }
                }
                //console.log("The weight keys are: " + Object.keys(directionWeights));
                //console.log("The weight values are: " + Object.values(directionWeights));

            } else{
                matchedDirections = getMatchedDirections(2);
                if(matchedDirections.length > 0){
                    if(debugMode){
                        console.log("Matched directions 2 is: " + matchedDirections);
                    }
                    // Here, when distance is 2, favor the directions that
                    // DON'T have the distance of 2 to try and prevent
                    // cells going across an otherwise traversable path and cutting it off.
                    // (add !inMatchedDirections to negate the dist application to the matches
                    // and apply it to the non-matches instead)
                    for(let i = 0; i< distHolder.length; i++){
                        if(!inMatchedDirections(distHolder[i][0])){
                            directionWeights[i] = [distHolder[i][0], dist2Weight]; 
                        } else{
                            directionWeights[i] = [distHolder[i][0], 1 - dist2Weight];
                        }
                    }
                } else{
                    // Else set equal weights
                    for(let i = 0; i < distHolder.length; i++){
                        directionWeights[i] = [distHolder[i][0], 1/distHolder.length];
                    }
                }
            }
            
            if(debugMode){
                console.log("The direction weights are: " + directionWeights);
            }
            
            function selectDir(){
                let sumDirWeights = 0;
                let selectedDir = "";
                let randThresh = 0.0;
                let runningSum = 0;
                for(let i = 0; i < directionWeights.length; i++){
                    sumDirWeights += directionWeights[i][1];
                }

                if(debugMode){
                    console.log("Sum dir weights is: " + sumDirWeights);
                }

                randThresh = Math.random() * sumDirWeights;
                if(debugMode){
                    console.log("The randThresh is: " + randThresh);
                }
                for(let i = 0; i < directionWeights.length; i++){
                    runningSum += directionWeights[i][1];
                    if(runningSum > randThresh){
                        selectedDir = directionWeights[i][0];
                        if(debugMode){
                            console.log("Selected direction is: " + selectedDir);
                        }
                        return selectedDir;
                    }
                }
                
            }

            selectedDir = selectDir();
            //console.log("Total dir weights is: " + totalDirWeights);

            // Randomly select one of the directions represented in the dirSelector.
            // This makes sure each possible direction gets the same probability 
            // of selection regardless of the length of the dirSelector array.
            
            //selectedDir = distHolder[Math.floor(Math.random() * distHolder.length)][0];
            if(debugMode){
                console.log("Selected dir is: " + selectedDir);
                console.log(tableArray);
            }
            if(selectedDir === "N"){
                document.getElementById(lastRow - 1 + "-" + lastCol).innerHTML = currNum;
                tableArray[lastRow - 1][lastCol] = currNum;
                currNum++;
                lastRow = lastRow - 1;
                //return;
            }

            if(selectedDir === "S"){
                document.getElementById(lastRow + 1 + "-" + lastCol).innerHTML = currNum;
                tableArray[lastRow + 1][lastCol] = currNum;
                currNum++;
                lastRow = lastRow + 1;
                //return;
            }

            if(selectedDir === "W"){
                document.getElementById(lastRow + "-" + (lastCol - 1)).innerHTML = currNum;
                tableArray[lastRow][lastCol - 1] = currNum;
                currNum++;
                lastCol = lastCol - 1;
                //return;
            }

            if(selectedDir === "E"){
                document.getElementById(lastRow + "-" + (lastCol + 1)).innerHTML = currNum;
                tableArray[lastRow][lastCol + 1] = currNum;
                currNum++;
                lastCol = lastCol + 1;
                //return;
            }

            // This is the case when there are no more possible moves.
            // The last move was the currNum (where there's no move) - 1
            if(selectedDir === undefined){
                // Package the current number and the current
                // state of the table into an Array to return
                moveReturn = [currNum - 1, tableArray];
                return(moveReturn);
            } 
        }
    }
    console.log("SUCCESSFULLY SOLVED!")
    moveReturn = [currNum - 1, tableArray];
    return(moveReturn);
}

for(let iter = 0; iter < iterCount; iter ++){
    currNum = 1;
    clearGrid();
    setUpArray();
    returnedMove = makeMoves();
    moveHolder.push(returnedMove);
}

// Report the results
let numCellsFinished = 0;
let arrayFinished = [];
// For calculating statistics and displaying the best solve attempt found in the random iterations.
let sumCellFilled = 0;
let meanNumCellsFilled = 0.0;
let bestIterNumCellsFilled = 0;
let bestIterNum = undefined;
// Keep track of how many iterations gave a complete puzzle
let numCompleted = 0;
for(let i = 0; i < iterCount; i++){
    numCellsFinished = moveHolder[i][0];
    console.log("For iteration #" + (i + 1) + " " + numCellsFinished + " cells were filled.");
    sumCellFilled += numCellsFinished;
    if(numCellsFinished === numRows * numCols){
        console.log("Successfully finished iteration #" + (i + 1));
        arrayFinished.push(moveHolder[i][1]);
        console.log(arrayFinished);
        numCompleted += 1;
    }

    if(numCellsFinished > bestIterNumCellsFilled){
        bestIterNumCellsFilled = numCellsFinished;
        bestIterNum = i + 1;
    }

}

meanNumCellsFilled = sumCellFilled / iterCount;

console.log("The mean number of cells filled from these iterations was: " + meanNumCellsFilled);

console.log("Iteration: " + bestIterNum + " had the most cells filled: " + bestIterNumCellsFilled);



// The bestIterNum is 1-based, but need 0-based for the Array index.
//let bestIterArray = moveHolder[bestIterNum - 1][1];

// Define the cells that should be shown to present the puzzle ready to solve
let cellsToShow = [
    "0-0", "0-2", "0-4", "0-6", "0-8",
    "2-0", "2-8",
    "4-0", "4-8",
    "6-0", "6-8",
    "8-0", "8-2", "8-4", "8-6", "8-8"
];

// As a measure of the rough difficulty, tabulate how long each of the 'loops' that need to be filled in 
// between initially filled in 
// values is. The longer loop length, the harder the puzzle.
function calcLoopLengths(currArray){
    let currCellToShow = undefined;
    let currCellToShow_row = undefined;
    let currCellToShow_col = undefined;
    let initialCellValueHolder = [];
    for(i = 0; i < cellsToShow.length; i++){
        // e.g. "0-2"
        currCellToShow = cellsToShow[i];
        // Javascript slices strings similar to Python!
        currCellToShow_row = currCellToShow[0];
        currCellToShow_col = currCellToShow[2];
        initialCellValueHolder.push(currArray[currCellToShow_row][currCellToShow_col]);
    }

    // Sort the initialCellValueHolder ascending. Need the helper function to tell sort
    // how we want the elements sorted (if return < 0, a is ordered before b; if return >0, b is ordered before a)
    initialCellValueHolder = initialCellValueHolder.sort(function(a, b){return a - b});
    let loopLengths = []
    let currVal = 0;
    let nextVal = 0;
    for(let j = 0; j < initialCellValueHolder.length - 1; j++){
        currVal = initialCellValueHolder[j];
        nextVal = initialCellValueHolder[j + 1];
        loopLengths.push(nextVal - currVal);
    }
    return loopLengths;
}




function displayGrid(currArray, isToggled){
    clearGrid();
    let currCellToShow = undefined;
    let currCellToShow_row = undefined;
    let currCellToShow_col = undefined;

    if(isToggled){
        console.log("test");
        for(i = 0; i < cellsToShow.length; i++){
            // e.g. "0-2"
            currCellToShow = cellsToShow[i];
            // Javascript slices strings similar to Python!
            currCellToShow_row = currCellToShow[0];
            currCellToShow_col = currCellToShow[2];
            document.getElementById(currCellToShow).innerHTML = currArray[currCellToShow_row][currCellToShow_col];
        }
    } else{
        for(let currRow = 0;  currRow < numRows; currRow++){
            for(let currCol = 0; currCol < numCols; currCol++){
                
                    if(currArray[currRow][currCol] != undefined){
                        document.getElementById(currRow + "-" + currCol).innerHTML = currArray[currRow][currCol];
                    }
                }
            }
        }
}

// Use the calculated loop lengths to assign puzzle difficulty
function assignPuzzleDifficulty(){

    let meanLoopLength = calcMean(loopLengths);
    let medianLoopLength = calcMedian(loopLengths);
    console.log("The mean loop length is: " + meanLoopLength);
    console.log("The median loop length is: " + medianLoopLength);

    if(meanLoopLength > 5 && medianLoopLength > 2){
        console.log("The puzzle is hard");
        document.getElementById("puzzle-diff").className = "hard";
        document.getElementById("puzzle-diff").innerHTML = "Hard";
    } else if((meanLoopLength > 5 && medianLoopLength == 2) || meanLoopLength > 4){
        console.log("The puzzle is medium");
        document.getElementById("puzzle-diff").className = "medium";
        document.getElementById("puzzle-diff").innerHTML = "Medium";
    } else{
        console.log("The puzzle is easy");
        document.getElementById("puzzle-diff").className = "easy";
        document.getElementById("puzzle-diff").innerHTML = "Easy";
    }

}

function makeNewDiv(idToGive){
    var newDiv = document.createElement('div');
    newDiv.id = idToGive;
    // Allow CSS styling using the class "trace"
    newDiv.className = "trace";
    document.body.appendChild(newDiv);
}


function topHalf(cellID){
    topHalfCellID = cellID + "-th";
    makeNewDiv(topHalfCellID);
    // input cellID in form of "0-0"
    // Get the dimensions of the bounding rectangle of the table cell.
    var dims = document.getElementById(cellID).getBoundingClientRect();
    console.log("dim top is: " + dims.top);
    console.log("dim left is: " + dims.left);
    document.getElementById(topHalfCellID).style.width = (dims.width/4) + "px";
    document.getElementById(topHalfCellID).style.height = dims.height/2 + "px";
    // Need to set position to absolute first otherwise setting the .left and .top doesn't do anything.
    document.getElementById(topHalfCellID).style.position = "absolute";
    document.getElementById(topHalfCellID).style.left = (dims.left + ((3/8) * dims.width)) + "px";
    document.getElementById(topHalfCellID).style.top = dims.top + "px";

}

function bottomHalf(cellID){
    bottomHalfCellID = cellID + "-bh";
    makeNewDiv(bottomHalfCellID);
    // input cellID in form of "0-0"
    // Get the dimensions of the bounding rectangle of the table cell.
    var dims = document.getElementById(cellID).getBoundingClientRect();
    console.log("dim top is: " + dims.top);
    console.log("dim left is: " + dims.left);
    document.getElementById(bottomHalfCellID).style.width = (dims.width/4) + "px";
    document.getElementById(bottomHalfCellID).style.height = dims.height/2 + "px";
    // Need to set position to absolute first otherwise setting the .left and .top doesn't do anything.
    document.getElementById(bottomHalfCellID).style.position = "absolute";
    document.getElementById(bottomHalfCellID).style.left = (dims.left + ((3/8) * dims.width)) + "px";
    document.getElementById(bottomHalfCellID).style.top = (dims.top + (dims.height/2)) + "px";

}

function leftHalf(cellID){
    leftHalfCellID = cellID + "-lh";
    makeNewDiv(leftHalfCellID);
    // input cellID in form of "0-0"
    // Get the dimensions of the bounding rectangle of the table cell.
    var dims = document.getElementById(cellID).getBoundingClientRect();
    console.log("dim top is: " + dims.top);
    console.log("dim left is: " + dims.left);
    document.getElementById(leftHalfCellID).style.width = (dims.width/2) + "px";
    document.getElementById(leftHalfCellID).style.height = (dims.height/4) + "px";
    // Need to set position to absolute first otherwise setting the .left and .top doesn't do anything.
    document.getElementById(leftHalfCellID).style.position = "absolute";
    document.getElementById(leftHalfCellID).style.left = dims.left + "px";
    document.getElementById(leftHalfCellID).style.top = dims.top + ((3/8) * dims.height) + "px";

}

function rightHalf(cellID){
    rightHalfCellID = cellID + "-rh";
    makeNewDiv(rightHalfCellID);
    // input cellID in form of "0-0"
    // Get the dimensions of the bounding rectangle of the table cell.
    var dims = document.getElementById(cellID).getBoundingClientRect();
    console.log("dim top is: " + dims.top);
    console.log("dim left is: " + dims.left);
    document.getElementById(rightHalfCellID).style.width = (dims.width/2) + "px";
    document.getElementById(rightHalfCellID).style.height = (dims.height/4) + "px";
    // Need to set position to absolute first otherwise setting the .left and .top doesn't do anything.
    document.getElementById(rightHalfCellID).style.position = "absolute";
    document.getElementById(rightHalfCellID).style.left = (dims.left + ((1/2) * dims.width)) + "px";
    document.getElementById(rightHalfCellID).style.top = (dims.top + ((3/8) * dims.height)) + "px";

}

function traceCell(currArray, currRow, currCol, pathNum, direction){
    let dirIncrement = 0;
    if(direction === 'next'){
        dirIncrement = 1;
        
    }

    if(direction === 'last'){
        dirIncrement = -1;
    }
    //console.log("dirIncrement is: " + dirIncrement);
    //console.log("currRow is: " + currRow + " currCol is: " + currCol + " pathNum is: " + pathNum);
    // N
    if(currRow > 0 && currArray[currRow - 1][currCol] === pathNum + dirIncrement){
        nextDirection = 'N';
        //console.log("tracing N");
        topHalf(currRow + "-" + currCol);
    }
    // S
    if(currRow < (numRows - 1) && currArray[currRow + 1][currCol] === pathNum + dirIncrement){
        nextDirection = 'S';
        //console.log("tracing S");
        bottomHalf(currRow + "-" + currCol);
    }
    // W
    if(currCol > 0 && currArray[currRow][currCol - 1] === pathNum + dirIncrement){
        nextDirection = 'W';
        //console.log("tracing W");
        leftHalf(currRow + "-" + currCol);
    }
    // E
    if(currCol < (numCols - 1) && currArray[currRow][currCol + 1] === pathNum + dirIncrement){
        nextDirection = 'E';
        //console.log("tracing E");
        rightHalf(currRow + "-" + currCol);
    }

}




function tracePath(currArray, isToggled){

    let lastDirection = "";
    let currVisitedCoords = [];
    let nextDirection = "";
    let currRow = 0;
    let currCol = 0;

    // Clear any previous traces regardless of whether the check box is toggled or not
    document.querySelectorAll('.trace').forEach(element => element.remove());

    if(!isToggled){

        for(let pathNum = 1; pathNum <= numCols * numRows; pathNum ++){

            console.log("Path num is: " + pathNum);
            if(pathNum === 1){
                for(let currRow = 0;  currRow < numRows; currRow++){
                    //console.log("Curr row is: " + currRow);
                    for(let currCol = 0; currCol < numCols; currCol++){
                        
                        //console.log("Curr col is: " + currCol)
                        currEntry = currArray[currRow][currCol]
                        if(currEntry === 1){
                            currVisitedCoords = [currRow, currCol];
                            //makeVerticalTrace(currRow + "-" + currCol);
                            //makeHorizontalTrace(currRow + "-" + currCol);
                            traceCell(currArray, currRow, currCol, pathNum, "next");
                            //document.getElementById(currRow + "-" + currCol).className = "chosen-path";
                            lastVisitedCoords = currVisitedCoords;
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
                    if(currArray[lastVisitedCoords[0] - 1][lastVisitedCoords[1]] === pathNum){
                        console.log("in if.")
                        currVisitedCoords = [lastVisitedCoords[0] - 1, lastVisitedCoords[1]];
                        currRow = currVisitedCoords[0];
                        currCol = currVisitedCoords[1];
                        lastVisitedCoords = currVisitedCoords;
                        console.log("Going to the North cell.");
                        traceCell(currArray, currRow, currCol, pathNum, "next");
                        traceCell(currArray, currRow, currCol, pathNum, "last");
                        
                    }
                }

                // Check South if not the last row
                if(lastVisitedCoords[0] < numRows - 1){
                    //console.log("In S check");
                    if(currArray[lastVisitedCoords[0] + 1][lastVisitedCoords[1]] === pathNum){
                        console.log("in if.")
                        currVisitedCoords = [lastVisitedCoords[0] + 1, lastVisitedCoords[1]];
                        currRow = currVisitedCoords[0];
                        currCol = currVisitedCoords[1];
                        lastVisitedCoords = currVisitedCoords;
                        console.log("Going to the South cell.");
                        traceCell(currArray, currRow, currCol, pathNum, "next");
                        traceCell(currArray, currRow, currCol, pathNum, "last");
                        
                    }
                }

                // Check West if not the first col
                if(lastVisitedCoords[1] > 0){
                    //console.log("In W check");
                    if(currArray[lastVisitedCoords[0]][lastVisitedCoords[1] - 1] === pathNum){
                        console.log("in if.")
                        currVisitedCoords = [lastVisitedCoords[0], lastVisitedCoords[1] - 1];
                        currRow = currVisitedCoords[0];
                        currCol = currVisitedCoords[1];
                        lastVisitedCoords = currVisitedCoords;
                        console.log("Going to the West cell.");
                        traceCell(currArray, currRow, currCol, pathNum, "next");
                        traceCell(currArray, currRow, currCol, pathNum, "last");
                        
                    }
                }

                // Check East if not the last col
                if(lastVisitedCoords[1] < numCols - 1){
                    //console.log("In E check");
                    //console.log(lastVisitedCoords[0]);
                    //console.log(lastVisitedCoords[1] + 1);
                    //console.log(rowHolder[5][4]);
                    if(currArray[lastVisitedCoords[0]][lastVisitedCoords[1] + 1] === pathNum){
                        //console.log("in if.")
                        currVisitedCoords = [lastVisitedCoords[0], lastVisitedCoords[1] + 1];
                        currRow = currVisitedCoords[0];
                        currCol = currVisitedCoords[1];
                        lastVisitedCoords = currVisitedCoords;
                        console.log("Going to the East cell.");
                        traceCell(currArray, currRow, currCol, pathNum, "next");
                        traceCell(currArray, currRow, currCol, pathNum, "last");
                        
                    }
                }
            }
        } 
    }
}



let numPuzzlesFinished = arrayFinished.length;
let currentPuzzleDisplayed = 1;
let loopLengths = [];

document.getElementById("numGenerated").innerHTML = numCompleted + " full puzzles found!"

// If a complete puzzle was found, by default display the first finished puzzle.
if(numPuzzlesFinished > 0){
    displayGrid(arrayFinished[0])
    currentPuzzleDisplayed = 1;
    loopLengths = calcLoopLengths(arrayFinished[(currentPuzzleDisplayed - 1)]);
    console.log("The loop lengths are: " + loopLengths);
    assignPuzzleDifficulty();
    tracePath(arrayFinished[(currentPuzzleDisplayed - 1)]);
}



function incrementPuzzleDisplay(){
    // Increment if possible, otherwise loop back to the first puzzle
    if(currentPuzzleDisplayed < numPuzzlesFinished){
        return(currentPuzzleDisplayed += 1);
    } else{
        return(1);
    }
}

function decrementPuzzleDisplay(){
    // Decrement if possible, otherwise loop back to the last puzzle
    if(currentPuzzleDisplayed > 1){
        return(currentPuzzleDisplayed -= 1);
    } else{
        return(numPuzzlesFinished);
    }
}

let isToggled = false;

function checkToggleStatus(){
    isToggled = toggle.checked;
    // update the displayGrid and whether the solved path is shown every time the box is checked or not  
    displayGrid(arrayFinished[(currentPuzzleDisplayed - 1)], isToggled);
    tracePath(arrayFinished[(currentPuzzleDisplayed - 1)], isToggled);
    return isToggled;
}

let toggle = document.getElementById("toggle");
toggle.addEventListener("click", checkToggleStatus);

function calcMean(inputArray){
    let sum = 0;
    let mean = 0;
    for(let i = 0; i < inputArray.length; i++){
        sum += inputArray[i];
    }
    mean = sum / inputArray.length;
    return mean;
}

function calcMedian(inputArray){
    
    let median = 0;
    let halfIndex = 0;
    // Sort the loop lengths ascending. Need the helper function to tell sort
    // how we want the elements sorted (if return < 0, a is ordered before b; if return >0, b is ordered before a)
    inputArray = inputArray.sort(function(a, b){return a - b});

    if(inputArray.length % 2 === 0){
        halfIndex = inputArray.length / 2;
        let firstNum = inputArray[halfIndex];
        let secondNum = inputArray[halfIndex + 1];
        median = (firstNum + secondNum) / 2;
    } else{
        halfIndex = Math.floor(inputArray.length / 2)
        median = inputArray[halfIndex];
    }
    return median;
}

function nextPuzzle(){

    currentPuzzleDisplayed = incrementPuzzleDisplay();
    console.log("In next. and current puzzle num is:" + currentPuzzleDisplayed);
    // Subtract 1 to convert to 0-based indexing into the holder array
    displayGrid(arrayFinished[(currentPuzzleDisplayed - 1)], isToggled);
    loopLengths = calcLoopLengths(arrayFinished[(currentPuzzleDisplayed - 1)]);
    console.log("The loop lengths are: " + loopLengths);
    assignPuzzleDifficulty();
    tracePath(arrayFinished[(currentPuzzleDisplayed - 1)], isToggled);
}

function prevPuzzle(){
    currentPuzzleDisplayed = decrementPuzzleDisplay();
    console.log("In prev. and current puzzle num is:" + currentPuzzleDisplayed);
    // Subtract 1 to convert to 0-based indexing into the holder array
    displayGrid(arrayFinished[(currentPuzzleDisplayed - 1)], isToggled);
    loopLengths = calcLoopLengths(arrayFinished[(currentPuzzleDisplayed - 1)]);
    console.log("The loop lengths are: " + loopLengths);
    assignPuzzleDifficulty();
    tracePath(arrayFinished[(currentPuzzleDisplayed - 1)], isToggled);
}

let nextButton = document.getElementById("forward-button");
nextButton.addEventListener("click", nextPuzzle); 

let prevButton = document.getElementById("backward-button");
prevButton.addEventListener("click", prevPuzzle); 







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


