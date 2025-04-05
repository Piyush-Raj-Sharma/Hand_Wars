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
        chooseRounds.style.visibility = "hidden";
        playGameScreen.style.visibility = "visible";
      } else {
        alert("Please select the number of rounds!");
      }
    });
  }, 1000); // Delay before showing the selection screen

  // ----------------------------------------------------

  const playGameScreen = document.querySelector(".playGameScreen");
  const currentRoundDisplay = document.querySelector(".currentRoundDisplay h2");
  const userPlay = document.querySelector(".userPlay");
  const playBtn = document.querySelector(".startGame");
  const userMoves = document.querySelectorAll(".userMove");

  let selectedRounds = localStorage.getItem("selectedRounds") || 1;
  localStorage.removeItem("selectedRounds");

  let currentRound = 1;
  currentRoundDisplay.textContent = `Round ${currentRound} of ${selectedRounds}`;
  let userMoveChoice = null;
  let userMoveId = null;

  // Display player name at the top of userPlay
  const playerNameDisplay = document.createElement("h2");
  playerNameDisplay.textContent = `${userName}`;
  userPlay.prepend(playerNameDisplay);

  // Handle user selecting a move
  userMoves.forEach((move) => {
    move.addEventListener("click", function () {
      userMoves.forEach((option) => option.classList.remove("selected"));
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
    const computerMoves = document.querySelectorAll(".computerMove");
    const roboMove = Math.floor((Math.random() * 100) % 3) + 1; // Random number between 1 and 3

    // Highlight the computer's move visually
    //Brings the RoboMove in the center;
    computerMoves.forEach((el) =>
      el.classList.remove("randomSelected", "flex-1", "flex-2", "flex-3")
    );
    if (computerMoves[roboMove - 1]) {
      computerMoves[roboMove - 1].classList.add("randomSelected", "flex-2");
    }

    let sideOrders = ["flex-1", "flex-3"];
    let sideIndex = 0;

    computerMoves.forEach((element, index) => {
      //logic to bring it to center
      if (index !== roboMove - 1) {
        //computer move is 0 based index, while roboMOve is generating 1,2,3
        element.classList.add(sideOrders[sideIndex]);
        sideIndex++;
      }
    });

    const moveMap = {
      1: "👊",
      2: "🤚",
      3: "✌️",
    };

    console.log(`🤖 Robo chose: ${moveMap[roboMove]}`);
    console.log(`🧑 ${userName} chose: ${moveMap[userMoveId]}`);

    // Game result logic
    if (roboMove === userMoveId) {
      winnerPopUp("draw");
      console.log("It's a draw! 🤝");
    } else if (
      (userMoveId === 1 && roboMove === 3) ||
      (userMoveId === 2 && roboMove === 1) ||
      (userMoveId === 3 && roboMove === 2)
    ) {
      winnerPopUp(userName);
      megaConfettiInGameArea();
      sideConfetti();

      // console.log(`${userName} wins! 🎉`);
    } else {
      winnerPopUp("Robo");
      console.log("Robo wins! 🤖");
    }
  };

  const winnerPopUp = (result) => {
    const resultPopup = document.createElement("div");
    resultPopup.classList.add("resultPopup");
  
    const resultContent = document.createElement("div");
    resultContent.classList.add("resultContent");
  
    const h2 = document.createElement("h2");
    const winnerEmoji = document.createElement("h1");
    const winnerName = document.createElement("h1");
  
    if (result === userName) {
      resultPopup.classList.add("user-win");
      h2.textContent = "The Winner is :";
      winnerEmoji.textContent = "🎉";
      winnerName.textContent = `${userName}`;
    } else if (result === "Robo") {
      resultPopup.classList.add("robo-win");
      h2.textContent = "Robo Wins!";
      winnerEmoji.textContent = "🤖";
      winnerName.textContent = "Robo";
    } else {
      resultPopup.classList.add("draw");
      h2.textContent = "It's a Draw!";
      winnerEmoji.textContent = "🤝";
      winnerName.textContent = "Draw";
    }
  
    const nextRoundBtn = document.createElement("button");
    nextRoundBtn.textContent = "Next Round";
    nextRoundBtn.classList.add("nextRound");
  
    // 🔥 THIS IS THE KEY PART
    nextRoundBtn.addEventListener("click", () => {
      // Remove the result popup
      resultPopup.remove();
  
      // Reset user selection
      userMoves.forEach((option) => option.classList.remove("selected"));
      userMoveChoice = null;
  
      // Reset computer move visuals
      document.querySelectorAll(".computerMove").forEach((el) =>
        el.classList.remove("randomSelected", "flex-1", "flex-2", "flex-3")
      );
  
      // Update round counter and display
      if (currentRound <= selectedRounds) {
        currentRoundDisplay.textContent = `Round ${currentRound} of ${selectedRounds}`;
      } else {
        // 🎮 Game Over
        alert("🎮 Game Over! Thanks for playing!");
      
        // Hide game screen and show round selection again
        playGameScreen.style.visibility = "hidden";
        chooseRounds.style.visibility = "visible";
      
        // Optional: Reset current round and user move
        currentRound = 1;
        userMoveChoice = null;
      
        // Optional: Clear previous round selection visually
        document.querySelectorAll(".selectedRound").forEach((option) => {
          option.classList.remove("selected");
        });
      
        // Optional: Reset current round display
        currentRoundDisplay.textContent = `Round ${currentRound} of ${selectedRounds}`;
      
        // Optional: Show greeting again
        greetings.textContent = `Hey, ${userName}!! Please read the instructions`;
      }
      
    });
  
    resultContent.appendChild(h2);
    resultContent.appendChild(winnerEmoji);
    resultContent.appendChild(winnerName);
    resultContent.appendChild(nextRoundBtn);
    resultPopup.appendChild(resultContent);
  
    const gameArea = document.querySelector(".gameArea");
    gameArea.appendChild(resultPopup);
  };
  
  // ---------------------------CONFETTI-----------------------

  function sideConfetti() {
    confetti({
      particleCount: 150,
      spread: 180,
      origin: { x: 0 }, // Left side
      zIndex: 999,
    });

    confetti({
      particleCount: 150,
      spread: 180,
      origin: { x: 1 }, // Right side
      zIndex: 999,
    });
  }

  const confettiCanvas = document.getElementById("confettiCanvas");
  const myConfetti = confetti.create(confettiCanvas, {
    resize: true,
    useWorker: true,
  });

  function megaConfettiInGameArea() {
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      origin: { y: 0.6 },
      zIndex: 9999,
      colors: ["#00ffff", "#ff00ff", "#ffff00", "#00ff00", "#ff0000"],
      shapes: ["square", "circle"],
    };

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
      }

      const particleCount = 100 * (timeLeft / duration);

      // Left burst
      myConfetti({
        ...defaults,
        particleCount,
        spread: 60,
        origin: { x: Math.random() * 0.2, y: Math.random() * 0.3 },
      });

      // Right burst
      myConfetti({
        ...defaults,
        particleCount,
        spread: 60,
        origin: { x: 1 - Math.random() * 0.2, y: Math.random() * 0.3 },
      });
    }, 200);
  }
});
