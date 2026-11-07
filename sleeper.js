
document.addEventListener("DOMContentLoaded", () => {

    // ==================================
    // SLEEPER ELEMENTS
    // ==================================

    const enterButton = document.getElementById(
        "enterKiosk"
    );

    const video = document.getElementById(
        "sleeperVideo"
    );


    // ==================================
    // BACKGROUND VIDEO
    // ==================================

    if (video) {

        video.muted = true;
        video.loop = true;

        const playPromise = video.play();

        if (playPromise !== undefined) {

            playPromise.catch(error => {
                console.warn(
                    "Video autoplay was prevented:",
                    error
                );
            });

        }

    }


    // ==================================
    // ENTER THE KIOSK
    // ==================================

    function enterKiosk() {

        window.location.href = "index.html";

    }


    if (enterButton) {

        enterButton.addEventListener(
            "click",
            enterKiosk
        );

    }

});
