
document.addEventListener("DOMContentLoaded", () => {

    // Prototype countdown starts at 01:23:47.

    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    if (!hoursElement || !minutesElement || !secondsElement) {
        return;
    }

    const startingSeconds = 1 * 3600 + 23 * 60 + 47;
    const startTime = Date.now();

    function updateCountdown() {

        const elapsedSeconds = Math.floor(
            (Date.now() - startTime) / 1000
        );

        const remainingSeconds = Math.max(
            0,
            startingSeconds - elapsedSeconds
        );

        const hours = Math.floor(remainingSeconds / 3600);

        const minutes = Math.floor(
            (remainingSeconds % 3600) / 60
        );

        const seconds = remainingSeconds % 60;

        hoursElement.textContent =
            String(hours).padStart(2, "0");

        minutesElement.textContent =
            String(minutes).padStart(2, "0");

        secondsElement.textContent =
            String(seconds).padStart(2, "0");

    }

    updateCountdown();

    setInterval(updateCountdown, 1000);

});
