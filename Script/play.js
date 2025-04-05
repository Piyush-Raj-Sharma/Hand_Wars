document.addEventListener("DOMContentLoaded", function () {
  // ELEMENT SELECTORS
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);
  const $$$ = (tag) => document.createElement(tag);

  const gameRules = $(".gameRules");
  const closeRulesBtn = $("#closeRules");
  const chooseRounds = $(".chooseRounds");
  const greetings = $("#greeting");
  const playGameScreen = $(".playGameScreen");
  const currentRoundDisplay = $(".currentRoundDisplay h2");
  const userPlay = $(".userPlay");
  const playBtn = $(".startGame");
  const userMoves = $$(".userMove");
  const computerMoves = $$(".computerMove");
  const rulesBtn = $(".rulesBtn");
  const leaderBoard = $(".bottom-container");
  const leaderboardList = $("#leaderboardList"); // FIXED selector (was wrong before)

  // Session Scores Display
  const userScoreDisplay = $("#userScore");
  const roboScoreDisplay = $("#roboScore");

  // Player info
  const userName = localStorage.getItem("playerName") || "Player";
  greetings.textContent = `Hey, ${userName}!! Please read the instructions`;
  greetings.style.fontWeight = "700";
  greetings.style.fontSize = "2em";
  greetings.style.color = "#00FFFF";

  // Game Variables
  let selectedRoundValue = null;
  let selectedRounds = localStorage.getItem("selectedRounds");
  let currentRound = 1;
  let userMoveChoice = null;
  let userScore = 0;
  let roboScore = 0;

  // ✅ Initial Load: Render Leaderboard
  renderRecentGames();

  // Confetti setup
  const confettiCanvas = document.getElementById("confettiCanvas");
  const myConfetti = confetti.create(confettiCanvas, {
    resize: true,
    useWorker: true,
  });

  // EVENT: Close Rules (Got It button)
  closeRulesBtn.addEventListener("click", () => {
    gameRules.style.visibility = "hidden";
    chooseRounds.style.visibility = "visible";
    chooseRounds.style.opacity = "0";

    setTimeout(() => {
      chooseRounds.style.opacity = "1";
      chooseRounds.style.transition = "opacity 1s ease";
    }, 100);
  });

  // EVENT: Round Selection
  $$(".selectedRound").forEach((btn) => {
    btn.addEventListener("click", function () {
      $$(".selectedRound").forEach((b) => b.classList.remove("selected"));
      this.classList.add("selected");
      selectedRoundValue = this.textContent;
    });
  });

  // EVENT: Start Game Button (after round selected)
  $(".startRound").addEventListener("click", () => {
    if (selectedRoundValue) {
      localStorage.setItem("selectedRounds", selectedRoundValue);
      selectedRounds = selectedRoundValue;
      currentRound = 1;
      userScore = 0;
      roboScore = 0;

      chooseRounds.style.visibility = "hidden";
      playGameScreen.style.visibility = "visible";

      playerNameDisplay.textContent = `${userName}`;
      currentRoundDisplay.textContent = `Round ${currentRound} of ${selectedRounds}`;
      updateScoreBoard();
    } else {
      alert("Please select the number of rounds!");
    }
  });

  // Display Player Name
  const playerNameDisplay = $$$("h2");
  playerNameDisplay.textContent = `${userName}`;
  userPlay.prepend(playerNameDisplay);

  // Handle user move selection
  userMoves.forEach((move) => {
    move.addEventListener("click", function () {
      userMoves.forEach((m) => m.classList.remove("selected"));
      this.classList.add("selected");
      userMoveChoice = this.textContent.trim();
    });
  });

  // EVENT: Play Game
  playBtn.addEventListener("click", () => {
    if (!userMoveChoice) {
      alert("Please select a move first!");
      return;
    }

    const emojiToId = { "👊": 1, "🤚": 2, "✌️": 3 };
    const userMoveId = emojiToId[userMoveChoice];

    if (currentRound <= selectedRounds) {
      currentRoundDisplay.textContent = `Round ${currentRound} of ${selectedRounds}`;
      gameLogic(userMoveId);
      currentRound++;
    }
  });

  // GAME LOGIC
  function gameLogic(userMoveId) {
    const roboMove = Math.floor(Math.random() * 3) + 1;

    computerMoves.forEach((el) => el.classList.remove("randomSelected", "flex-1", "flex-2", "flex-3"));

    if (computerMoves[roboMove - 1]) {
      computerMoves[roboMove - 1].classList.add("randomSelected", "flex-2");
    }

    let sideOrders = ["flex-1", "flex-3"];
    let sideIndex = 0;
    computerMoves.forEach((el, index) => {
      if (index !== roboMove - 1) {
        el.classList.add(sideOrders[sideIndex]);
        sideIndex++;
      }
    });

    if (roboMove === userMoveId) {
      winnerPopUp("draw");
    } else if (
      (userMoveId === 1 && roboMove === 3) ||
      (userMoveId === 2 && roboMove === 1) ||
      (userMoveId === 3 && roboMove === 2)
    ) {
      userScore++;
      winnerPopUp(userName);
      megaConfettiInGameArea();
      sideConfetti();
    } else {
      roboScore++;
      winnerPopUp("Robo");
    }

    updateScoreBoard();
  }

  function updateScoreBoard() {
    userScoreDisplay.textContent = `${userName} : ${userScore}`;
    roboScoreDisplay.textContent = `Robo : ${roboScore}`;
  }

  function winnerPopUp(result) {
    setTimeout(() => {
      const resultPopup = $$$("div");
      resultPopup.classList.add("resultPopup");

      const resultContent = $$$("div");
      resultContent.classList.add("resultContent");

      const h2 = $$$("h2");
      const winnerEmoji = $$$("h1");
      const winnerName = $$$("h1");

      if (result === userName) {
        resultPopup.classList.add("user-win");
        h2.textContent = "The Winner is:";
        winnerEmoji.textContent = "🎉";
        winnerName.textContent = userName;
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

      const nextRoundBtn = $$$("button");
      nextRoundBtn.classList.add("nextRound");
      nextRoundBtn.textContent = "Next Round";

      nextRoundBtn.addEventListener("click", () => {
        resultPopup.remove();
        userMoves.forEach((opt) => opt.classList.remove("selected"));
        userMoveChoice = null;
        computerMoves.forEach((el) =>
          el.classList.remove("randomSelected", "flex-1", "flex-2", "flex-3")
        );

        if (currentRound <= selectedRounds) {
          currentRoundDisplay.textContent = `Round ${currentRound} of ${selectedRounds}`;
        } else {
          alert("🎮 Game Over! Thanks for playing!");
          onSeriesComplete();
          resetGame();
        }
      });

      resultContent.append(h2, winnerEmoji, winnerName, nextRoundBtn);
      resultPopup.appendChild(resultContent);
      $(".gameArea").appendChild(resultPopup);
    }, 500);
  }

  function resetGame() {
    currentRound = 1;
    userScore = 0;
    roboScore = 0;
    userMoveChoice = null;
    selectedRoundValue = null;

    playGameScreen.style.visibility = "hidden";
    chooseRounds.style.visibility = "visible";

    $$(".selectedRound").forEach((el) => el.classList.remove("selected"));
    currentRoundDisplay.textContent = `Round ${currentRound} of ${selectedRounds}`;
    greetings.textContent = `Hey, ${userName}!! Please read the instructions`;

    updateScoreBoard();
  }

  // Confetti Effects
  function sideConfetti() {
    setTimeout(() => {
      confetti({ particleCount: 150, spread: 180, origin: { x: 0 }, zIndex: 999 });
      confetti({ particleCount: 150, spread: 180, origin: { x: 1 }, zIndex: 999 });
    }, 500);
  }

  function megaConfettiInGameArea() {
    setTimeout(() => {
      const duration = 2000;
      const animationEnd = Date.now() + duration;
      const defaults = {
        origin: { y: 0.6 },
        zIndex: 9999,
        colors: ["#00ffff", "#ff00ff", "#ffff00", "#00ff00", "#ff0000"],
        shapes: ["square", "circle"],
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) clearInterval(interval);

        const particleCount = 100 * (timeLeft / duration);
        myConfetti({ ...defaults, particleCount, spread: 60, origin: { x: Math.random() * 0.2, y: Math.random() * 0.3 } });
        myConfetti({ ...defaults, particleCount, spread: 60, origin: { x: 1 - Math.random() * 0.2, y: Math.random() * 0.3 } });
      }, 200);
    }, 1000);
  }

  // Show Rules Button
  rulesBtn.addEventListener("click", () => {
    gameRules.classList.add("blur-filter");
    gameRules.style.visibility = "visible";
  });

  // ✅ LocalStorage: Game Session Logic
  function getRecentGames() {
    return JSON.parse(localStorage.getItem("recentGames")) || [];
  }

  function saveGameSession(userScore, roboScore) {
    const winner = userScore > roboScore ? `${userName}` : userScore < roboScore ? "Robo" : "Draw";
    const timeStamp = new Date().toLocaleDateString();

    const newSession = { userScore, roboScore, winner, timeStamp };

    let recentGames = getRecentGames();
    recentGames.push(newSession);

    if (recentGames.length > 3) {
      recentGames = recentGames.slice(-3);
    }

    localStorage.setItem("recentGames", JSON.stringify(recentGames));
    renderRecentGames();
  }

  function renderRecentGames() {
    leaderboardList.innerHTML = "";
    const recentGames = getRecentGames().slice().reverse();

    if (recentGames.length === 0) {
      leaderboardList.innerHTML = "<li>No sessions played yet.</li>";
      return;
    }

    recentGames.forEach((game, index) => {
      const listItem = $$$("li");
      listItem.innerHTML = `
        <strong>Game ${recentGames.length - index}</strong>: ${game.winner}
        <span>Score: You ${game.userScore} - Robo ${game.roboScore}</span>
        <span>Date: ${game.timeStamp}</span>`;
      leaderboardList.appendChild(listItem);
    });
  }

  function onSeriesComplete() {
    const userScore = parseInt($("#userScore").textContent.split(":")[1].trim());
    const roboScore = parseInt($("#roboScore").textContent.split(":")[1].trim());
    saveGameSession(userScore, roboScore);
  }
});
