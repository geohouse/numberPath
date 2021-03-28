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
    console.log("In getDistance.");
    console.log("Direction is: " + direction);
    console.log("distRow is: " + distRow);
    console.log("distCol is: " + distCol);

    dist = 0;

    if(direction === "N"){
        while(distRow > 0){
            console.log("In N while");
            if(document.getElementById(distRow - 1 + "-" + distCol).innerHTML === ""){
                console.log("Incrementing N dist");
                dist ++;
                distRow = distRow - 1;

            } else if(document.getElementById(distRow - 1 + "-" + distCol).innerHTML != ""){
                // Return as soon as hit an element that's filled (i.e. don't skip over filled 
                // elements and then keep counting dist with any non-filled elements until running 
                // out of elements to tabulate)
                console.log("Returning early for N.");
                return dist;
            } 
        }
    }

    if(direction === "S"){
        while(distRow < numRows - 1){
            console.log("In S while");
            if(document.getElementById(distRow + 1 + "-" + distCol).innerHTML === ""){
                console.log("Incrementing S dist");
                dist ++;
                distRow = distRow + 1;

            } else if(document.getElementById(distRow + 1 + "-" + distCol).innerHTML != ""){
                // Return as soon as hit an element that's filled (i.e. don't skip over filled 
                // elements and then keep counting dist with any non-filled elements until running 
                // out of elements to tabulate)
                console.log("Returning early for S.");
                return dist;
            } 
        }
    }


    if(direction === "W"){
        while(distCol > 0){
            console.log("In W while");
            if(document.getElementById(distRow + "-" + (distCol - 1)).innerHTML === ""){
                console.log("Incrementing W dist");
                dist ++;
                distCol = distCol - 1;

            } else if(document.getElementById(distRow + "-" + (distCol - 1)).innerHTML != ""){
                // Return as soon as hit an element that's filled (i.e. don't skip over filled 
                // elements and then keep counting dist with any non-filled elements until running 
                // out of elements to tabulate)
                console.log("Returning early for W.");
                return dist;
            } 
        }
    }

    if(direction === "E"){
        while(distCol < numCols - 1){
            console.log("In E while");
            if(document.getElementById(distRow + "-" + (distCol + 1)).innerHTML === ""){
                console.log("Incrementing E dist");
                dist ++;
                distCol = distCol + 1;

            } else if(document.getElementById(distRow + "-" + (distCol + 1)).innerHTML != ""){
                // Return as soon as hit an element that's filled (i.e. don't skip over filled 
                // elements and then keep counting dist with any non-filled elements until running 
                // out of elements to tabulate)
                console.log("Returning early for E.");
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
// directions have a distance of 1. (all other cells have probability of 1-dist1Weight)
let dist1Weight = 0.95;
// The probability of NOT visiting any cell that is distance 2 away (to try and 
// prevent cut-offs of paths that would otherwise be viable 'turn-arounds')
let dist2Weight = 0.55;

// Number of full random solves done
let iterCount = 0;

function makeMove(){

    dirSelector = [];
    selectedDir = "";
    distHolder = initializeDistHolder();
    currDist = 0;
    directionWeights = [];

    console.log(currNum);

    if(currNum === 1){
        let pickRow = Math.floor(Math.random() * numRows);
        let pickCol = Math.floor(Math.random() * numCols);
        console.log("The picked cell is: " + pickRow + "," + pickCol);
        document.getElementById(pickRow + "-" + pickCol).innerHTML = currNum;
        tableArray[pickRow][pickCol] = currNum;
        lastRow = pickRow;
        lastCol = pickCol;
        currNum++;
        return;
    } else{

        console.log(lastRow);
        console.log(lastCol);

        //North check
        if(lastRow > 0 && document.getElementById(lastRow - 1 + "-" + lastCol).innerHTML === ""){
            //dirSelector.push("N");
            console.log("North OK.");
            currDist = getDistance("N", lastRow, lastCol);
            console.log("currDist N is: " + currDist);
            distHolder[0][0] = "N"
            distHolder[0][1] = currDist;

            
        } 

        //South check
        if(lastRow < numRows - 1 && document.getElementById(lastRow + 1 + "-" + lastCol).innerHTML === ""){
            //dirSelector.push("S");
            console.log("South OK.");
            currDist = getDistance("S", lastRow, lastCol);
            console.log("currDist S is: " + currDist);
            //distHolder[1] is for S
            distHolder[1][0] = "S"
            distHolder[1][1] = currDist;
        }

        //West check
        // Need parenths around the lastCol addition/subtraction for it to evaluate correctly.
        if(lastCol > 0 && document.getElementById(lastRow + "-" + (lastCol - 1)).innerHTML === ""){
            //dirSelector.push("W");
            console.log("West OK.");
            currDist = getDistance("W", lastRow, lastCol);
            console.log("currDist W is: " + currDist);
            distHolder[2][0] = "W";
            distHolder[2][1] = currDist;
        } 


        //East check
        if(lastCol < numCols - 1 && document.getElementById(lastRow + "-" + (lastCol + 1)).innerHTML === ""){
            //dirSelector.push("E");
            console.log("East OK.");
            currDist = getDistance("E", lastRow, lastCol);
            console.log("currDist E is: " + currDist); 
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
                console.log("in remove blank dists");
                //console.log("length is: " + Object.keys(distHolder).length);
                //console.log("i is: " + i);
                console.log("key is: " + distHolder[i][0]);
                if(distHolder[i][1] === -1) {
                    console.log("Removing key: " + distHolder[i][0]);
                    // Remove 1 element at index i
                    distHolder.splice(i,1);
                }
            }
            return distHolder;
        }

        // Clean up the distHolder Object to remove any entries with -1 (default)
        // entries, and therefore no distance to travel in that/those direction(s).
        distHolder = removeBlankDists(distHolder);

        console.log("The distHolder keys are: " + Object.keys(distHolder));
        console.log("The distHolder values are: " + Object.values(distHolder));
        
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
            console.log("Matched directions 1 are: " + matchedDirections);


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
                console.log("Matched directions 2 is: " + matchedDirections);
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
        
        console.log("The direction weights are: " + directionWeights);
        
        function selectDir(){
            let sumDirWeights = 0;
            let selectedDir = "";
            let randThresh = 0.0;
            let runningSum = 0;
            for(let i = 0; i < directionWeights.length; i++){
                sumDirWeights += directionWeights[i][1];
            }

            console.log("Sum dir weights is: " + sumDirWeights);

            randThresh = Math.random() * sumDirWeights;
            console.log("The randThresh is: " + randThresh);
            for(let i = 0; i < directionWeights.length; i++){
                runningSum += directionWeights[i][1];
                if(runningSum > randThresh){
                    selectedDir = directionWeights[i][0];
                    console.log("Selected direction is: " + selectedDir);
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
        console.log("Selected dir is: " + selectedDir);
        console.log(tableArray);
        if(selectedDir === "N"){
            document.getElementById(lastRow - 1 + "-" + lastCol).innerHTML = currNum;
            tableArray[lastRow - 1][lastCol] = currNum;
            currNum++;
            lastRow = lastRow - 1;
            return;
        }

        if(selectedDir === "S"){
            document.getElementById(lastRow + 1 + "-" + lastCol).innerHTML = currNum;
            tableArray[lastRow + 1][lastCol] = currNum;
            currNum++;
            lastRow = lastRow + 1;
            return;
        }

        if(selectedDir === "W"){
            document.getElementById(lastRow + "-" + (lastCol - 1)).innerHTML = currNum;
            tableArray[lastRow][lastCol - 1] = currNum;
            currNum++;
            lastCol = lastCol - 1;
            return;
        }

        if(selectedDir === "E"){
            document.getElementById(lastRow + "-" + (lastCol + 1)).innerHTML = currNum;
            tableArray[lastRow][lastCol + 1] = currNum;
            currNum++;
            lastCol = lastCol + 1;
            return;
        }
        
    }

}


let nextButton = document.getElementById("forward-button");
nextButton.addEventListener("click", makeMove); 

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


