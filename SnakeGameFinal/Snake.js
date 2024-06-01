// Date: June 10, 2024
// Version: 2.7
// Project: Javascript, Final project, Snake Game


// =================  VARIABLES  =================

let Board = [
	["W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
	["W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W"],
	["W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W"],
	["W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W"],
	["W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W"],
	["W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W"],
	["W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W"],
	["W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W"],
	["W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W"],
	["W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W"],
	["W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W"],
	["W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W"],
	["W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W"],
	["W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W"],
	["W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W"],
	["W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W"],
	["W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W"],
	["W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W"],
	["W", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "W"],
	["W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W", "W"],
]
// S for human snake, A for apple, W for wall, . for empty space, AI for AI snake, DAI for dead AI snake

let Snake = [
	[2,10],
	[3,10],
	[4,10],
	// [5,10],
	// [6,10],
	// [7,10],
]

let AISnakes = [
	// [
		// [2,16],
		// [3,16],
		// [4,16],
	// ],
]

let DeadAISnakes = [];

let Direction = "right";
let Timer = null;
let Apple = null;
let GameStatus = "IDLE";

let Score = 0;
let Level = 1;
let ApplesPerLevel = 3;

// We use a function, so anywhere can call it, so we dont repeat code
const speed = () => 200 - Level * 20;

let wallLevel = {
    1: 'wall_level1',
    2: 'wall_level2',
    3: 'wall_level3',
    4: 'wall_level4',
    5: 'wall_level5',
}
let levelBackground = {
    1: 'white',
    2: 'lightyellow',
    3: '#b8e0ea',
    4: '#f5d8fc',
    5: '#ffef97',
}


// =================  FUNCTIONS  =================

function CreateApple() {
    // Creating a random x and y positions
    let xRandomPos = Math.floor(Math.random() * 20);
    let yRandomPos = Math.floor(Math.random() * 20);

    // If that position falls on a non-blank space, then make new random positions
    while (Board[yRandomPos][xRandomPos] != ".") {
        xRandomPos = Math.floor(Math.random() * 20);
        yRandomPos = Math.floor(Math.random() * 20);
    }

    // Set apple position
    Apple = [xRandomPos, yRandomPos];
}

function MoveSnake(){

	// Don't move if the game is over
	if(GameStatus == "OVER") return;

	if(IgnoreNextTicket) {
		IgnoreNextTicket = false;
		return;
	}

	let isGrowing = false;

	//Get x and y positions of snake head
	let xPosSnakeHead = Snake[Snake.length - 1][0];
	let yPosSnakeHead = Snake[Snake.length - 1][1];

	//Check for deadly collisions
	//Current position of head
	let xPosHeadNext = Snake[Snake.length - 1][0];
	let yPosHeadNext = Snake[Snake.length - 1][1];

	//Update to next position
	if (Direction == "right") xPosHeadNext++;
	if (Direction == "left") xPosHeadNext--;
	if (Direction == "up") yPosHeadNext--;
	if (Direction == "down") yPosHeadNext++;

	// Check if we hit a wall or another snake
	if (Board[yPosHeadNext][xPosHeadNext] == "W" || Board[yPosHeadNext][xPosHeadNext] == "S" || Board[yPosHeadNext][xPosHeadNext] == "AI") {
		GameOver();
		return ;
	}

	// Check if hit apple
	if (Board[yPosHeadNext][xPosHeadNext] == "A") {
		isGrowing = true;

		let appleXPos = Apple[0];
		let appleYPos = Apple[1];
		Board[appleYPos][appleXPos] = ".";
		Apple = null;

		// CreateApple();

		Score += 1;
		document.getElementById("score").innerHTML = "Score: " + Score;
		if(Score >= ApplesPerLevel){
            NextLevel();
		}

		// Don't steal the "level up" alert
		if(Score > 0) AlertText("Delicious! " + "🍎".repeat(Score));

	}

	// Append (add) another segment to the snake
	if (Direction == "right") {
		Snake.push([xPosSnakeHead + 1, yPosSnakeHead]);
	}
	if (Direction == "left") {
		Snake.push([xPosSnakeHead - 1, yPosSnakeHead]);
	}
	if (Direction == "up") {
		Snake.push([xPosSnakeHead, yPosSnakeHead - 1]);
	}
	if (Direction == "down") {
		Snake.push([xPosSnakeHead, yPosSnakeHead + 1]);
	}

	if (!isGrowing) {
		// Fix the board - replace blank space
		// Get x and y positions of snake tail
		let xPosSnakeTail = Snake[0][0];
		let yPosSnakeTail = Snake[0][1];
		Board[yPosSnakeTail][xPosSnakeTail] = ".";

		// Remove the last segment from the Snake array
		Snake.shift();
	}

	// Redraw board
	DrawBoard();
}

var alertTimeout; // Declare a variable to hold the timeout ID

function AlertText(message) {
    var alertElement = document.getElementById("alert");
    alertElement.innerHTML = message;
    alertElement.style.display = "block"; // Ensure the alert is visible when setting a message
    alertElement.style.animation = "none"; // Reset animation
    alertElement.offsetHeight; // Trigger reflow to restart animation

    // Apply pop-in animation
    alertElement.style.animation = "popIn 0.5s forwards";

    // Clear the previous timeout if it exists
    if (alertTimeout) {
        clearTimeout(alertTimeout);
    }

    // Set a new timeout and store its ID
    alertTimeout = setTimeout(function() {
        // Apply fade-out animation
        alertElement.style.animation = "fadeOut 0.5s forwards";
        // Hide the alert after the fade-out animation
        // setTimeout(function() {
        //     alertElement.style.display = "none";
        // }, 500); // Match the duration of the fadeOut animation
    }, 3000);
}

function NextLevel(){
    Score = 0;
    Level = Level + 1;
	AlertText("Level up! " + "🚀".repeat(Level));

    document.getElementById("level").innerHTML = "Level: " + Level;

    // Adjust snake speed
    clearInterval(Timer);
    Timer = setInterval(Tick, speed());

	UpdateBackground();

	// Clear all AI snakes from the Board
    Board = Board.map(row => row.map(cell => cell === "AI" ? "." : cell));

    // Add additional AI Snakes to meet the level quota
    let existingAISnakesCount = AISnakes.length;
    let requiredAISnakesCount = Level - 1;
    let newAISnakesCount = requiredAISnakesCount - existingAISnakesCount;

    for (let i = 0; i < newAISnakesCount; i++) {
        CreateAISnake();
    }
}

function UpdateBackground() {
    document.body.style.backgroundColor = levelBackground[Level <= 5 ? Level : 5];

    // Update background particles
    const newLeafImage = wallLevel[Level <= 5 ? Level : 5] + '.png';

    // Select all leaves and update their background image
    const leaves = document.querySelectorAll('.leaf');
    leaves.forEach(leaf => {
        leaf.style.backgroundImage = `url(${newLeafImage})`;
    });
}

function DrawBoard(){

	ClearGrid();

	let _Board = JSON.parse(JSON.stringify(Board));

	// Add Dead AI Snakes to _Board
	for (let i in DeadAISnakes) {
        let xPosOfDeadAISnake = DeadAISnakes[i][0];
        let yPosOfDeadAISnake = DeadAISnakes[i][1];
        _Board[yPosOfDeadAISnake][xPosOfDeadAISnake] = "DAI"; // Use "DAI" for dead AI snakes
    }

	// Add Snake to Board
	for (let i in Snake) {
		let xPosOfSnake = Snake[i][0];
		let yPosOfSnake = Snake[i][1];
		_Board[yPosOfSnake][xPosOfSnake] = "S";
		Board[yPosOfSnake][xPosOfSnake] = "S";
	}

	// Add AI Snake to _Board
	for (let i in AISnakes) {
		for (let j in AISnakes[i]) {
			let xPosOfSnake = AISnakes[i][j][0];
			let yPosOfSnake = AISnakes[i][j][1];
			_Board[yPosOfSnake][xPosOfSnake] = "AI";
			Board[yPosOfSnake][xPosOfSnake] = "AI";
		}
	}

	// Add Apple to _Board
	if(Apple == null) CreateApple();
	let xPosApple = Apple[0];
	let yPosApple = Apple[1];
	_Board[yPosApple][xPosApple] = "A";
	Board[yPosApple][xPosApple] = "A";


	// Draw board
	for (let y = 0; y < _Board.length; y++) {
		for (let x = 0; x < _Board[y].length; x++) {
			if (_Board[y][x] == "W") AddBlock(x, y, "wall " + wallLevel[Level <= 5 ? Level : 5]);
			else if (_Board[y][x] == ".") AddBlock(x, y, "white");
			else if (_Board[y][x] == "S") AddBlock(x, y, GameStatus == "OVER" ? "deadSnake" : "snakeHuman");
			else if (_Board[y][x] == "A") AddBlock(x, y, "apple");
			else if (_Board[y][x] == "AI") AddBlock(x, y, "snakeAI");
			else if (_Board[y][x] == "DAI") AddBlock(x, y, "deadAI"); // Draw dead AI snakes
		}
	}
}

// KeyPressed will automatically get an event parameter
let IgnoreNextTicket = false;
function KeyPressed(event) {
	const previousDirection = Direction;
    // event.keyCode is the code of the key that is pressed
    if (event.keyCode == 38 && Direction != "down") Direction = "up";
    if (event.keyCode == 40 && Direction != "up") Direction = "down";
    if (event.keyCode == 37 && Direction != "right") Direction = "left";
    if (event.keyCode == 39 && Direction != "left") Direction = "right";

	// If the direction was changed, move the snake immediately
	if(previousDirection != Direction) {
		IgnoreNextTicket = false;
		MoveSnake();
		IgnoreNextTicket = true;
	}
}

function Boost(event){

	if(GameStatus == "OVER") return;

    if (event.key === "Shift") {

		// Boost!
		if(event.type === "keydown"){
			clearInterval(Timer);
			Timer = setInterval(Tick, speed() / 2);
		}

		// Unboost!
		else {
			clearInterval(Timer);
			Timer = setInterval(Tick, speed());
		}

    }
}

function GameOver() {
	GameStatus = "OVER";
	clearInterval(Timer);
	Timer = null;



	DrawBoard();
	AlertText("🚫🐍 Game Over! 🐍🚫")
	UpdateHighscore();


}

function UpdateHighscore() {
    // Check highscore in local storage
    let highscore = localStorage.getItem("highscore");
    if (highscore === null || Level > parseInt(highscore, 10)) {
        localStorage.setItem("highscore", Level);
        AlertText("New Level Highscore! 🏆");
    }

	document.getElementById("highscore").innerHTML = "Highscore: " + highscore;

}

function StartGame() {
	AlertText("Start 🐍!");
    DrawBoard();

	UpdateHighscore();

    Timer = setInterval(Tick, 200);
    document.addEventListener("keydown", KeyPressed);

    document.addEventListener("keydown", Boost);
    document.addEventListener("keyup", Boost);

}

let aiSnakeMoveInterval = 3; // Change this value to control AI snake speed
let tickCounter = 0;

// The main logic loop of our program
function Tick() {

	if(GameStatus == "OVER") return;

    MoveSnake();

	// Move AI snakes every X ticks
	tickCounter++;
	if (tickCounter >= aiSnakeMoveInterval) {
		MoveAllAISnakes();
		tickCounter = 0; // Reset counter after moving AI snakes
	}
}

function MoveAllAISnakes() {
    for (let i in AISnakes) {
        const Dead = MoveAISnake(AISnakes[i]);
		if (Dead === 'dead') {
			AISnakes.splice(i, 1); // Remove the dead AI snake
		}
    }
}


setTimeout(()=>{

	// If the space key was pressed, then start the game
    document.addEventListener("keydown", (event)=> {
		if (event.code == 'Space') StartGame();
	});

	CreateApple();
    DrawBoard();
	Tick();
}, 200)


// =================  AI SNAKE =================
function CalculateDistance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function MoveAISnake(AISnake) {
	if (AISnake.length === 0) {
        return; // If the AI snake is empty, do nothing
    }

    let xPosAISnakeHead = AISnake[AISnake.length - 1][0];
    let yPosAISnakeHead = AISnake[AISnake.length - 1][1];

    let appleXPos = Apple[0];
    let appleYPos = Apple[1];

    let possibleMoves = [
        { direction: "right", x: xPosAISnakeHead + 1, y: yPosAISnakeHead },
        { direction: "left", x: xPosAISnakeHead - 1, y: yPosAISnakeHead },
        { direction: "up", x: xPosAISnakeHead, y: yPosAISnakeHead - 1 },
        { direction: "down", x: xPosAISnakeHead, y: yPosAISnakeHead + 1 }
    ];

    // Filter out moves that would hit a wall 
    possibleMoves = possibleMoves.filter(move => Board[move.y][move.x] !== "W");

    // Find the move that brings the snake closest to the apple
    let bestMove = possibleMoves.reduce((best, move) => {
        let distance = CalculateDistance(move.x, move.y, appleXPos, appleYPos);
        if (distance < best.distance) {
            return { direction: move.direction, x: move.x, y: move.y, distance: distance };
        }
        return best;
    }, { distance: Infinity });

	// Check if the next move is an apple
	let isGrowing = Board[bestMove.y][bestMove.x] == "A";

	// Move the AI snake
	AISnake.push([bestMove.x, bestMove.y]);

	// If AI snake hits another AI snake or human snake, mark it as dead
	if (Board[bestMove.y][bestMove.x] == "W" || Board[bestMove.y][bestMove.x] == "S") {

		DeadAISnakes.push(...AISnake); // Add dead AI snake positions to DeadAISnakes

		for (let segment of AISnake) {
			Board[segment[1]][segment[0]] = ".";
			return 'dead';
		}
		AISnake.length = 0; // Empty the AI snake array to stop it from moving

		AlertText("AI Snake Died! 🐍");

		return;
	}

	// Remove the last segment if not growing
	if (!isGrowing) {
		let xPosAISnakeTail = AISnake[0][0];
		let yPosAISnakeTail = AISnake[0][1];
		Board[yPosAISnakeTail][xPosAISnakeTail] = ".";
		AISnake.shift();
	} else {
		AlertText("AI Ate Apple! 🖥️");
		let appleXPos = Apple[0];
		let appleYPos = Apple[1];
		Board[appleYPos][appleXPos] = ".";
		CreateApple();
	}
}

// Function to create a new AI Snake
function CreateAISnake() {
    let newAISnake = [];

    // Create a random initial position for the AI Snake
    let xRandomPos = Math.floor(Math.random() * 20);
    let yRandomPos = Math.floor(Math.random() * 20);

    // If the position is not empty, find a new position
    while (Board[yRandomPos][xRandomPos] !== ".") {
        xRandomPos = Math.floor(Math.random() * 20);
        yRandomPos = Math.floor(Math.random() * 20);
    }

    // Create the AI Snake with a length of 3 at the initial position
    newAISnake.push([xRandomPos, yRandomPos]);
    for (let i = 1; i < 3; i++) {
        // Ensure the new segment is within the board and empty
        let newX = xRandomPos;
        let newY = yRandomPos + i;
        if (newY < 20 && Board[newY][newX] === ".") {
            newAISnake.push([newX, newY]);
        } else {
            break;
        }
    }

    // Add the new AI Snake to the AISnakes array
    AISnakes.push(newAISnake);
}



// =================  CREATE BACKGROUND  =================
function CreateLeavesBackground(numberOfLeaves) {
    const leavesContainer = document.createElement('div');
    leavesContainer.classList.add('leaves-container');

    for (let i = 0; i < numberOfLeaves; i++) {
        const leaf = document.createElement('div');
        leaf.classList.add('leaf');

        // Start leaves offscreen at random positions
        leaf.style.left = `${Math.random() * 150}%`;
        leaf.style.top = `${-Math.random() * 100}vh`; // Position them above the screen

        // Add random initial rotation
        const randomInitialRotation = Math.random() * 360; // Random initial rotation angle between 0 and 360 degrees
        leaf.style.transform = `rotate(${randomInitialRotation}deg)`;

        leaf.style.animationDuration = `${15 + Math.random() * 10}s`;
        leaf.style.animationDelay = `${Math.random() * 10}s`;
        leavesContainer.appendChild(leaf);
    }

    document.body.appendChild(leavesContainer);
}
setTimeout(()=>CreateLeavesBackground(400), 1000);