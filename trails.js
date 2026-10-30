
/* ================================
   COPENHAGEN MARATHON
   COURSE INFO - JAVASCRIPT
================================ */


/* SETTINGS */

const totalDistance = 42.195;


// SVG ICONS

const icons = {
  water: "assets/icons/iconWater.svg",
  drink: "assets/icons/iconDrink.svg",
  food: "assets/icons/iconFood.svg"
};


/* ================================
   AID STATION DATA
================================ */

/*
  Temporary demonstration positions.

  km = position on marathon timeline
  x = horizontal percentage on the map
  y = vertical percentage on the map

  Replace these with final Figma positions.
*/

const stations = {

  water: [
    { km: 4, x: 25, y: 47 },
    { km: 8, x: 35, y: 48 },
    { km: 12, x: 42, y: 65 },
    { km: 16, x: 35, y: 80 },
    { km: 20, x: 48, y: 84 },
    { km: 24, x: 56, y: 70 },
    { km: 28, x: 61, y: 55 },
    { km: 32, x: 65, y: 40 },
    { km: 36, x: 57, y: 23 },
    { km: 40, x: 51, y: 32 }
  ],

  drink: [
    { km: 4, x: 26, y: 45 },
    { km: 8, x: 35, y: 48 },
    { km: 12, x: 57, y: 18 },
    { km: 16, x: 60, y: 44 },
    { km: 20, x: 61, y: 61 },
    { km: 24, x: 54, y: 67 },
    { km: 28, x: 63, y: 77 },
    { km: 32, x: 52, y: 82 },
    { km: 36, x: 33, y: 90 },
    { km: 40, x: 41, y: 96 }
  ],

  food: [
    { km: 8, x: 35, y: 48 },
    { km: 24, x: 57, y: 18 },
    { km: 36, x: 63, y: 77 }
  ]
};


/* ================================
   HTML ELEMENTS
================================ */

const filterButtons =
  document.querySelectorAll(".filter-button");

const timelineMarkers =
  document.getElementById("timelineMarkers");

const foodStations =
  document.getElementById("foodStations");

const mapMarkers =
  document.getElementById("mapMarkers");


// No filter selected initially

let activeFilter = null;


/* ================================
   HELPER FUNCTIONS
================================ */

// Convert kilometres into timeline percentage

function getTimelinePosition(km) {
  return 5 + (km / totalDistance) * 90;
}


// Create an SVG image

function createIcon(type) {

  const image = document.createElement("img");

  image.src = icons[type];
  image.alt = "";

  return image;
}


/* ================================
   FOOD STATIONS
================================ */

function renderFoodStations() {

  foodStations.innerHTML = "";

  stations.food.forEach(station => {

    const foodStation = document.createElement("div");

    foodStation.classList.add("food-station");

    if (activeFilter === "food") {
      foodStation.classList.add("active");
    }

    foodStation.style.left =
      getTimelinePosition(station.km) + "%";


    // Food icon box

    const iconBox = document.createElement("div");

    iconBox.classList.add("food-station-icon");

    iconBox.appendChild(createIcon("food"));


    // Vertical connecting line

    const line = document.createElement("div");

    line.classList.add("food-station-line");


    // Add elements

    foodStation.appendChild(iconBox);
    foodStation.appendChild(line);

    foodStations.appendChild(foodStation);

  });
}


/* ================================
   TIMELINE MARKERS
================================ */

function renderTimeline() {

  timelineMarkers.innerHTML = "";

  // Default = black water icons

  const type = activeFilter || "water";


  stations[type].forEach(station => {

    const marker = document.createElement("div");

    marker.classList.add("timeline-marker");

    // Yellow when selected

    if (activeFilter !== null) {
      marker.classList.add("active");
    }

    // Horizontal position

    marker.style.left =
      getTimelinePosition(station.km) + "%";


    // Add icon

    marker.appendChild(createIcon(type));

    timelineMarkers.appendChild(marker);

  });
}


/* ================================
   MAP MARKERS
================================ */

function renderMap() {

  // Remove previous markers

  mapMarkers.innerHTML = "";

  // No markers when no filter is active

  if (activeFilter === null) {
    return;
  }


  // Add markers for selected category

  stations[activeFilter].forEach(station => {

    const marker = document.createElement("div");

    marker.classList.add("map-marker");

    // Map position

    marker.style.left = station.x + "%";
    marker.style.top = station.y + "%";


    // Add category icon

    marker.appendChild(createIcon(activeFilter));

    mapMarkers.appendChild(marker);

  });
}


/* ================================
   UPDATE BUTTONS
================================ */

function updateButtons() {

  filterButtons.forEach(button => {

    const isActive =
      button.dataset.filter === activeFilter;

    button.classList.toggle("active", isActive);

    button.setAttribute(
      "aria-pressed",
      String(isActive)
    );

  });
}


/* ================================
   UPDATE PAGE
================================ */

function updatePage() {

  updateButtons();

  renderFoodStations();

  renderTimeline();

  renderMap();
}


/* ================================
   BUTTON INTERACTIONS
================================ */

filterButtons.forEach(button => {

  button.addEventListener("click", function() {

    const selectedFilter = this.dataset.filter;

    // Clicking selected filter again = reset

    if (activeFilter === selectedFilter) {
      activeFilter = null;
    } else {
      activeFilter = selectedFilter;
    }

    updatePage();

  });
});


/* ================================
   INITIAL LOAD
================================ */

updatePage();
