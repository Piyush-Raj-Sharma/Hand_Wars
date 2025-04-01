document.addEventListener("DOMContentLoaded", function () {
    let userCard = document.querySelector('.enterName');
    let userNameBtn = document.querySelector('#nextButton');

    userCard.style.display = 'block';

    userNameBtn.addEventListener('click', function () {
        let userName = document.querySelector('#userName').value.trim();

        if (userName === "") {
            alert("Please enter your name!");
            return;
        }
        // console.log(userName);

        // Save name for future use
        localStorage.setItem("playerName", userName); // playerName (will be used to access later) is the variable name for the 'userName' in the Local Storage

        alert(`Welcome, ${userName}! Let's start the game.`);

        // Redirect to the next game screen or enable the game
        window.location.href = "play.html"; 
    });
});
