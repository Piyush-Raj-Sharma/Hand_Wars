document.addEventListener("DOMContentLoaded", function () {
    const userCard = document.querySelector('.enterName');
    const userNameBtn = document.querySelector('#nextButton');

    userCard.style.display = 'block';

    userNameBtn.addEventListener('click', function () {
        const userName = document.querySelector('#userName').value.trim();

        if (userName === "") {
            alert("Please enter your name!");
            return;
        }

        // Save name to localStorage
        localStorage.setItem("playerName", userName);

        // Reset rulesSeen flag so rules will be shown on next screen
        localStorage.removeItem("rulesSeen");

        // Redirect to game screen and show rules
        window.location.href = "play.html?showRules=true";
    });
});
