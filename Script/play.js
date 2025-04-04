document.addEventListener("DOMContentLoaded", function () {
  // Select the game rules section and close button
  let gameRules = document.querySelector(".gameRules");
  let closeRulesBtn = document.querySelector("#closeRules");

  // Retrieve the player's name from local storage
  let userName = localStorage.getItem("playerName") || "Player"; // Default name if not found
  let greetings = document.querySelector("#greeting");

  // Update the greeting message
  greetings.textContent = `Hey, ${userName}!! Please read the instructions`;
  greetings.style.fontWeight = "700";
  greetings.style.fontSize = "2em";
  greetings.style.color = "#00FFFF";

  // Close the game rules when the button is clicked
  closeRulesBtn.addEventListener("click", function () {
    gameRules.style.visibility = "hidden";

    // Make the round selection screen visible
    let chooseRounds = document.querySelector(".chooseRounds");
    chooseRounds.style.visibility = 'visible';   //uncomment this
  });

  //-------------------------------------------------------------------------------------------------------------------

  // Select the round selection section
  let chooseRounds = document.querySelector(".chooseRounds");

  // Initially hide the selection screen (opacity 0)
  chooseRounds.style.opacity = "0";

  // Show the selection screen after a delay with a smooth fade-in effect
  setTimeout(function () {
    chooseRounds.style.opacity = "1";
    chooseRounds.style.transition = "opacity 1s ease";

    let selectedRoundValue = null;

    // Add event listeners to all selectable rounds
    document.querySelectorAll(".selectedRound").forEach((selected) => {
      selected.addEventListener("click", function () {
        // Remove the 'selected' class from all options
        document.querySelectorAll(".selectedRound").forEach((option) => {
          option.classList.remove("selected");
        });

        // Add 'selected' class to the clicked option
        this.classList.add("selected");
        selectedRoundValue = this.textContent;
      });
    });

    // Handle the 'Start' button click
    let startRoundBtn = document.querySelector(".startRound");
    startRoundBtn.addEventListener("click", function () {
      if (selectedRoundValue) {
        console.log("Selected Rounds:", selectedRoundValue);

        // Save selected round count to local storage
        localStorage.setItem("selectedRounds", selectedRoundValue);

        // Hide the round selection screen
        chooseRounds.style.display = "none";
        playGameScreen.style.visibility = "visible";
      } else {
        alert("Please select the number of rounds!");
      }
    });
  }, 1000); // Delay before showing the selection screen

  // ----------------------------------------------------
  
  const playGameScreen = document.querySelector(".playGameScreen");
  const currentRoundDisplay = document.querySelector('.currentRoundDisplay h2');
  const userPlay = document.querySelector(".userPlay");
  const playBtn = document.querySelector(".startGame");
  const userMoves = document.querySelectorAll(".userMove");

  let selectedRounds = localStorage.getItem("selectedRounds") || 1;
  localStorage.removeItem("selectedRounds");

  let currentRound = 1;
  let userMoveChoice = null;
  let userMoveId = null;

  // Display player name at the top of userPlay
  const playerNameDisplay = document.createElement("h2");
  playerNameDisplay.textContent = `${userName}`;
  userPlay.prepend(playerNameDisplay);

  // Handle user selecting a move
  userMoves.forEach(move => {
    move.addEventListener("click", function () {
      userMoves.forEach(option => option.classList.remove("selected"));
      this.classList.add("selected");
      userMoveChoice = this.textContent.trim();

      console.log(`You selected: ${userMoveChoice}`);
    });
  });

  // Handle play button click
  playBtn.addEventListener("click", () => {
    if (!userMoveChoice) {
      alert("Please select a move first!");
      return;
    }

    // Map emoji to move ID
    const emojiToId = { "👊": 1, "🤚": 2, "✌️": 3 };
    userMoveId = emojiToId[userMoveChoice];

    console.log(`Your move is: ${userMoveChoice}, ID: ${userMoveId}`);

    if (currentRound <= selectedRounds) {
        currentRoundDisplay.textContent = `Round ${currentRound} of ${selectedRounds}`;
        gameLogic(userMoveId);
        currentRound++;
    }
  });

  // Core game logic function
  const gameLogic = (userMoveId) => {
    const computerMoves = document.querySelectorAll('.computerMove');
    const roboMove = Math.floor(Math.random() * 100 % 3)  + 1; // Random number between 1 and 3
  
    // Highlight the computer's move visually
    computerMoves.forEach(el => el.classList.remove("randomSelected"));
    if (computerMoves[roboMove - 1]) {
      computerMoves[roboMove - 1].classList.add("randomSelected");
    }
  
    const moveMap = {
      1: "👊",
      2: "🤚",
      3: "✌️"
    };
  
    console.log(`🤖 Robo chose: ${moveMap[roboMove]}`);
    console.log(`🧑 ${userName} chose: ${moveMap[userMoveId]}`);
  
    // Game result logic
    if (roboMove === userMoveId) {
      console.log("It's a draw! 🤝");
    } else if (
      (userMoveId === 1 && roboMove === 3) ||
      (userMoveId === 2 && roboMove === 1) ||
      (userMoveId === 3 && roboMove === 2)
    ) {
      console.log(`${userName} wins! 🎉`);
    } else {
      console.log("Robo wins! 🤖");
    }
  };
  
});
