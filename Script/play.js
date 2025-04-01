document.addEventListener('DOMContentLoaded', function(){

    let gameRules = document.querySelector('.gameRules');
    let closeRulesBtn = document.querySelector('#closeRules');

    let userName = localStorage.getItem('playerName'); // access the playerName from the local Storage which is actualy the userName.
    let greetings = document.querySelector('#greeting');
    greetings.textContent = `Hey, ${userName}!! please read the instructions`;
    greetings.style.fontWeight = 700;
    greetings.style.fontSize = 2 +"em";
    greetings.style.color = "#00FFFF";

    closeRulesBtn.addEventListener('click', function(){
        gameRules.style.display = 'none';

        let gameScreen = document.querySelector('.gameScreen');
        gameScreen.style.display = 'flex';
    })


//-------------------------------------------------------------------------------------------------------------------


    let chooseRounds = document.querySelector('.chooseRounds');

    // Initially hide the selection screen
    chooseRounds.style.opacity = '0';
    chooseRounds.style.display = 'flex';

    // Show after 2 seconds with a smooth fade-in
    setTimeout(function () {
        chooseRounds.style.opacity = '1';
        chooseRounds.style.transition = 'opacity 1s ease';

        let selectedRoundValue = null;

        // Handle round selection
        document.querySelectorAll('.selectedRound').forEach(selected => {
            selected.addEventListener('click', function () {

                // Remove selection from all options
                document.querySelectorAll('.selectedRound').forEach(option => {
                    option.classList.remove('selected');
                });

                this.classList.add('selected');
                selectedRoundValue = this.textContent;
            });
        });

        let startRoundBtn = document.querySelector('.startRound');
        startRoundBtn.addEventListener('click', function () {
            if (selectedRoundValue) {
                console.log("Selected Rounds:", selectedRoundValue);
                localStorage.setItem("selectedRounds", selectedRoundValue); // Save for next screen
                chooseRounds.style.display = 'none';
            } else {
                alert("Please select the number of rounds!");
            }
        });

    }, 1000);


})

