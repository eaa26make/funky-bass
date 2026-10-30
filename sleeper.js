
/* ================================
   COPENHAGEN MARATHON
   SLEEPER PAGE JAVASCRIPT
================================ */


/* HTML ELEMENTS */

const enterButton =
  document.getElementById("enterKiosk");

const sleeperVideo =
  document.getElementById("sleeperVideo");


/* ================================
   BACKGROUND VIDEO
================================ */

// Video must stay muted for autoplay
sleeperVideo.muted = true;

// Attempt to play automatically
function playBackgroundVideo() {

  const playPromise = sleeperVideo.play();

  if (playPromise !== undefined) {

    playPromise.catch(function(error) {

      console.warn(
        "Background video could not autoplay:",
        error
      );

    });

  }

}

// Start video
playBackgroundVideo();


/* ================================
   ENTER THE KIOSK
================================ */

// User presses anywhere on the screen

enterButton.addEventListener("click", function() {

  // Open the Home page
  window.location.href = "index.html";

});


/* ================================
   RESUME VIDEO
================================ */

// Resume video when returning to this tab

document.addEventListener("visibilitychange", function() {

  if (!document.hidden) {
    playBackgroundVideo();
  }

});
