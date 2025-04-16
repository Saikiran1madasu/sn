// Utility functions
function hideElement(selector) {
    const element = document.querySelector(selector);
    if (element) element.style.display = "none";
}

function showElement(selector, displayStyle = "block") {
    const element = document.querySelector(selector);
    if (element) element.style.display = displayStyle;
}

function setTextContent(selector, text) {
    const element = document.querySelector(selector);
    if (element) element.textContent = text;
}

// On DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
    const preLoader = document.querySelector(".pre-loader");
    if (preLoader) {
        preLoader.style.transition = "opacity 2s";
        preLoader.style.opacity = "0";
        setTimeout(() => {
            hideElement(".pre-loader");
        }, 2000);
    }

    // URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    let spinParam = urlParams.get('id') || '6500'; // Default value

    // Main content display
    hideElement(".pre-loader");
    showElement("main", "flex");

    // Initialize valid time timer
    const validTime = document.querySelector(".valid_time");
    if (validTime) {
        showElement(".valid_time", "flex");

        let endTime = new Date(Date.now() + 90000); // 1 min 30 sec from now
        const updateTimer = () => {
            const now = new Date();
            const timeLeft = endTime - now;

            const mins = Math.floor((timeLeft / 1000 / 60) % 60);
            const secs = Math.floor((timeLeft / 1000) % 60);

            setTextContent(".mins", mins.toString().padStart(2, '0'));
            setTextContent(".secs", secs.toString().padStart(2, '0'));

            if (timeLeft > 0) {
                setTimeout(updateTimer, 1000);
            }
        };
        updateTimer();
    }

    // Trigger spin when the hand is clicked
    const hand = document.querySelector('.hand');
    if (hand) {
        hand.addEventListener('click', function () {
            const spinButton = document.getElementById("spin");
            if (spinButton) spinButton.click();
        });
    }

    // Handle the spin logic
    const spinButton = document.getElementById("spin");
    if (spinButton) {
        spinButton.addEventListener("click", function () {
            const wheel = document.getElementById("wheel");
            const pointer = document.querySelector(".pointer");
            const audio = document.getElementById("myAudio");

            if (audio) audio.play();
            hideElement(".hand");
            if (pointer) pointer.classList.add("pointer-toggle");

            let degree;
            switch (spinParam) {
                case '4000': degree = 4020; break;
                case '9500': degree = 4200; break;
                case '6500': degree = 4441; break;
                case '8000': degree = 4140; break;
                case '3000': degree = 3960; break;
                case '2000': degree = 4259; break;
                case '5000': degree = 3840; break;
                default: 
                    degree = 4441;
                    spinParam = '6500';
                    setTextContent('.amount', '₹ ' + spinParam + '.00');
            }

            if (wheel) {
                wheel.style.transition = "transform 4s ease-out";
                wheel.style.transform = `rotate(${degree}deg)`;
            }

            // Post-spin logic
            setTimeout(() => {
                const coinsAudio = document.getElementById('coins_audio');
                if (coinsAudio) coinsAudio.play();
                if (pointer) pointer.classList.remove("pointer-toggle");

                document.querySelectorAll('.segment').forEach(segment => {
                    segment.classList.add('dull');
                    if (segment.getAttribute('data-value') === spinParam) {
                        segment.classList.add('highlight');
                        const textContent = segment.firstElementChild.innerHTML;
                        segment.firstElementChild.innerHTML = `You won <br>${textContent}<br> Bonus`;

                        showElement('.fireworks-con');

                        let count = 0;
                        const targetAmount = parseInt(spinParam, 10);

                        const interval = setInterval(() => {
                            const winnerCheer = document.getElementById('winner_cheer');
                            if (winnerCheer) winnerCheer.play();

                            if (count < targetAmount) {
                                count += Math.ceil(targetAmount / 50);
                                if (count > targetAmount) count = targetAmount;
                                setTextContent('.amount', '₹ ' + count + '.00');
                            } else {
                                clearInterval(interval);
                            }
                        }, 30);

                        // Limited time offer popup
                        setTimeout(() => {
                            let minutes = 0;
                            let seconds = 59;
                            const timer = setInterval(function () {
                                if (minutes === 0 && seconds === 0) {
                                    clearInterval(timer);
                                    setTextContent('#timer', 'Limited Time Offer: 00:00 minutes remaining!');
                                } else {
                                    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                                    setTextContent('#timer', 'Limited Time Offer: ' + display);
                                    seconds -= 1;
                                    if (seconds < 0) {
                                        minutes -= 1;
                                        seconds = 59;
                                    }
                                }
                            }, 1000);

                            showElement('#canvas');
                            showElement('.popup-model', "flex");
                            document.body.style.overflow = 'hidden';
                        }, 3000);

                        setTextContent('.prize-money', '₹ ' + spinParam);
                    }
                });
            }, 4000);

            // Claim button functionality
            const claimButton = document.querySelector('.claim-amount');
            if (claimButton) {
                claimButton.addEventListener('click', () => {
                    window.location.href = "https://www.google.com/";
                });
            }
        });
    }
});
