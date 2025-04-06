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
  const leaderboardList = $("#leaderboardList");
  const rulesOverlay = $("#rulesOverlay");

  const userScoreDisplay = $("#userScore");
  const roboScoreDisplay = $("#roboScore");

  const userName = localStorage.getItem("playerName") || "Player";
  greetings.textContent = `Hey, ${userName}!! Please read the instructions`;
  greetings.style.fontWeight = "700";
  greetings.style.fontSize = "2em";
  greetings.style.color = "#00FFFF";

  let selectedRoundValue = null;
  let selectedRounds = localStorage.getItem("selectedRounds");
  let currentRound = 1;
  let userMoveChoice = null;
  let userScore = 0;
  let roboScore = 0;

  renderRecentGames();

  const confettiCanvas = document.getElementById("confettiCanvas");
  const myConfetti = confetti.create(confettiCanvas, {
    resize: true,
    useWorker: true,
  });

  function hideRules() {
    gameRules.style.visibility = "hidden";
    chooseRounds.style.visibility = "visible";
    chooseRounds.style.opacity = "0";

    setTimeout(() => {
      chooseRounds.style.opacity = "1";
      chooseRounds.style.transition = "opacity 1s ease";
    }, 100);
  }

  closeRulesBtn.addEventListener("click", () => {
    localStorage.setItem("rulesSeen", "true");
    hideRules();
  });

  const rulesSeen = localStorage.getItem("rulesSeen");

  if (rulesSeen === "true") {
    hideRules();
  } else {
    gameRules.style.visibility = "visible";
    chooseRounds.style.visibility = "hidden";
  }

  $$(".selectedRound").forEach((btn) => {
    btn.addEventListener("click", function () {
      $$(".selectedRound").forEach((b) => b.classList.remove("selected"));
      this.classList.add("selected");
      selectedRoundValue = this.textContent;
    });
  });

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

  const playerNameDisplay = $$$("h2");
  playerNameDisplay.textContent = `${userName}`;
  userPlay.prepend(playerNameDisplay);

  userMoves.forEach((move) => {
    move.addEventListener("click", function () {
      userMoves.forEach((m) => m.classList.remove("selected"));
      this.classList.add("selected");
      userMoveChoice = this.textContent.trim();
    });
  });

  playBtn.addEventListener("click", () => {
    if (!userMoveChoice) {
      alert("Please select a move first!");
      return;
    }

    if (currentRound > selectedRounds) {
      alert("All rounds are completed!");
      return;
    }

    const emojiToId = { "👊": 1, "🤚": 2, "✌️": 3 };
    const userMoveId = emojiToId[userMoveChoice];

    currentRoundDisplay.textContent = `Round ${currentRound} of ${selectedRounds}`;
    gameLogic(userMoveId);
  });

  function gameLogic(userMoveId) {
    const roboMove = Math.floor(Math.random() * 3) + 1;

    computerMoves.forEach((el) =>
      el.classList.remove("randomSelected", "flex-1", "flex-2", "flex-3")
    );

    if (computerMoves[roboMove - 1]) {
      computerMoves[roboMove - 1].classList.add("randomSelected", "flex-2");
    }

    const sideOrders = ["flex-1", "flex-3"];
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
      // megaConfettiInGameArea();
      sideConfetti();
    } else {
      roboScore++;
      emojiConfetti();
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

        currentRound++;
        if (currentRound <= selectedRounds) {
          currentRoundDisplay.textContent = `Round ${currentRound} of ${selectedRounds}`;
        } else {
          onSeriesComplete();
          showGameOverPopup();
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

  // Create the confetti instance on the <body> with a high zIndex
const myConfettii = confetti.create(document.body, {
  resize: true,
  useWorker: true,
  zIndex: 10001, // Must be higher than .rulesOverlay z-index (1000)
});


  function sideConfetti() {
    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 180,
        origin: { x: 0 },
        zIndex: 99999,
      });
      confetti({
        particleCount: 150, 
        spread: 180,
        origin: { x: 1 },
        zIndex: 99999,
      });
    }, 500);
  }

  function megaConfettiInGameArea() {
    setTimeout(() => {
      const duration = 2000;
      const animationEnd = Date.now() + duration;
      const defaults = {
        origin: { y: 0.6 },
        zIndex: 9999999,
        colors: ["#00ffff", "#ff00ff", "#ffff00", "#00ff00", "#ff0000"],
        shapes: ["square", "circle"],
      };
  
      // ⬇ Manually set z-index and pointer-events for the canvas
      const canvas = document.querySelector("canvas.confetti-canvas");
      if (canvas) {
        canvas.style.zIndex = "9999999";
        canvas.style.position = "fixed";
        canvas.style.pointerEvents = "none";
        canvas.style.top = "0";
        canvas.style.left = "0";
      }
  
      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) clearInterval(interval);
  
        const particleCount = 100 * (timeLeft / duration);
        myConfetti({
          ...defaults,
          particleCount,
          spread: 60,
          origin: { x: Math.random() * 0.2, y: Math.random() * 0.3 },
        });
        myConfetti({
          ...defaults,
          particleCount,
          spread: 60,
          origin: { x: 1 - Math.random() * 0.2, y: Math.random() * 0.3 },
        });
      }, 200);
    }, 1000);
  }
  
  function emojiConfetti() {
    const interval = setInterval(function () {
      const emoji = document.createElement('div');
      const X = Math.random() * 100; // Horizontal position (vw)
      const Y = Math.random() * 100; // Horizontal position (vw)
      const rotate = Math.random() * 360;
      let emojiIndex = Math.trunc(Math.random()* 3);
  
      const emojiList = ['😂', '😝', '😜'];
      console.log(emojiIndex);
      
      emoji.textContent =` ${emojiList[emojiIndex]}`;
      // console.log(` ${emojiList[emojiIndex]}`);
      
      emoji.classList.add('emoji');
      emoji.style.left = `${X}vw`;
      emoji.style.transform = `rotate(${rotate}deg)`;
  
      document.querySelector('.gameArea').appendChild(emoji);
  
      // Remove emoji after animation ends (5s)
      setTimeout(() => {
        emoji.remove();
      }, 3000);
    }, 70); // Every 100ms
  
    // Optional: Stop confetti after 5 seconds
    setTimeout(() => clearInterval(interval), 3000);
  }
  

  function showGameOverPopup() {
    const overlay = $$$("div");
    overlay.classList.add("gameOverOverlay");

    const resultPopup = $$$("div");
    resultPopup.classList.add("gameOverPopup");

    const resultContent = $$$("div");
    resultContent.classList.add("gameOverContent");

    const h2 = $$$("h2");
    h2.textContent = "🎮 Game Over!";
    h2.style.color = "#fff";

    const winnerEmoji = $$$("h1");
    const winnerName = $$$("h1");

    if (userScore > roboScore) {
      winnerEmoji.textContent = "🏆";
      winnerName.textContent = `${userName} Wins the Series!`;
      megaConfettiInGameArea();
    } else if (roboScore > userScore) {
      emojiConfetti();
      winnerEmoji.textContent = "🤖";
      winnerName.textContent = "Robo Wins the Series!";
    } else {
      winnerEmoji.textContent = "🤝";
      winnerName.textContent = "It's a Draw!";
    }

    winnerName.style.marginBottom = "1rem";

    const playAgainBtn = $$$("button");
    playAgainBtn.classList.add("gameOverBtn");
    playAgainBtn.textContent = "Play Again";
    playAgainBtn.addEventListener("click", () => {
      overlay.remove();
      resultPopup.remove();
      resetGame();
    });

    const exitBtn = $$$("button");
    exitBtn.classList.add("gameOverBtn", "exitBtn");
    exitBtn.textContent = "Exit";
    exitBtn.addEventListener("click", () => {
      localStorage.removeItem("rulesSeen");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 100);
    });

    resultContent.append(h2, winnerEmoji, winnerName, playAgainBtn, exitBtn);
    resultPopup.appendChild(resultContent);

    overlay.appendChild(resultPopup);
    $(".gameArea").appendChild(overlay);
  }

  let isRulesVisible = false;

  rulesBtn.addEventListener("click", () => {
    isRulesVisible = !isRulesVisible;

    rulesOverlay.classList.toggle("show", isRulesVisible);
    closeRulesBtn.style.visibility = "hidden";
    // Toggle visibility of close button and game rules
    rulesBtn.textContent = isRulesVisible ? "Close Rules" : "Rules";
    gameRules.style.visibility = isRulesVisible ? "visible" : "hidden";
  });

  closeRulesBtn.addEventListener("click", () => {
    localStorage.setItem("rulesSeen", "true");

    rulesOverlay.classList.remove("show");
    rulesBtn.textContent = "Rules";

    closeRulesBtn.style.visibility = "hidden";
    gameRules.style.visibility = "hidden";

    isRulesVisible = false;
  });

  document.querySelector(".dev-info").addEventListener("click", () => {
    // Remove existing if already present
    const existing = document.querySelector(".dev-info-overlay");
    if (existing) existing.remove();
  
    // Create overlay
    const overlay = document.createElement("div");
    overlay.classList.add("dev-info-overlay");
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      backdrop-filter: blur(8px);
      background-color: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 99999;
    `;
  
    // Create popup
    const popup = document.createElement("div");
    popup.classList.add("dev-info-popup");
    popup.style.cssText = `
      background: rgba(1, 44, 44, 0.47);
      border: 2px solid #00ffff;
      padding: 40px 50px;
      border-radius: 20px;
      box-shadow: 0 0 30px #00ffff;
      text-align: center;
      color: #fff;
      max-width: 500px;
      width: 90%;
      position: relative;
      font-family: 'Orbitron', sans-serif;
    `;
  
    popup.innerHTML = `
      <img src="Assets/piyush-ghibli.png" alt="Piyush Raj" style="width: 150px; height: 150px; object-fit: cover; border-radius: 50%; box-shadow: 0 0 15px #00ffff; margin-bottom: 20px;" />
      <h2 style="font-size: 28px; margin: 10px 0;">Piyush Raj</h2>
      <p style="font-size: 16px; margin-bottom: 20px;">Web Developer | JavaScript & MERN Enthusiast</p>
      <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 30px;">
        <a href="https://github.com/Piyush-Raj-Sharma" target="_blank">
          <img src="Assets/github.png" alt="LinkedIn" style="width: 35px; filter: drop-shadow(0 0 1px #00ffff);" />
        </a>
        <a href="https://github.com/Piyush-Raj-Sharma" target="_blank">
          <img src="Assets/instagram.png" alt="GitHub" style="width: 35px; filter: drop-shadow(0 0 1px #00ffff);" />
        </a>
        <a href="https://linkedin.com/in/piyush-raj-sharma" target="_blank">
          <img src="Assets/linkedin.png" alt="Instagram" style="width: 35px; filter: drop-shadow(0 0 1px #00ffff);" />
        </a>
      </div>
      <button class="close-dev-info" style="padding: 8px 20px; font-size: 14px; background: #00ffff; border: none; border-radius: 10px; color: #000; cursor: pointer; box-shadow: 0 0 10px #00ffff;">Close</button>
    `;
  
    // Append to overlay
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  
    // Close button
    popup.querySelector(".close-dev-info").addEventListener("click", () => {
      overlay.remove();
    });
  });
  
  

  function getRecentGames() {
    return JSON.parse(localStorage.getItem("recentGames")) || [];
  }

  function saveGameSession(userScore, roboScore) {
    const winner =
      userScore > roboScore
        ? `${userName}`
        : userScore < roboScore
        ? "Robo"
        : "Draw";
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
    const userScore = parseInt(
      $("#userScore").textContent.split(":")[1].trim()
    );
    const roboScore = parseInt(
      $("#roboScore").textContent.split(":")[1].trim()
    );
    saveGameSession(userScore, roboScore);
  }
});
