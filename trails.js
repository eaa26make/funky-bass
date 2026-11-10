
document.addEventListener("DOMContentLoaded", () => {

    // ELEMENTS

    const buttons = document.querySelectorAll(
        ".station-filter"
    );

    const timelineContainer = document.getElementById(
        "timelineStations"
    );

    const mapContainer = document.getElementById(
        "mapPins"
    );

    if (!timelineContainer || !mapContainer) {
        return;
    }


    // ORIGINAL STATION DATA

    const stationData = {

        water: {
            icon: "assets/icons/iconWater.svg",

            timeline: [
                13, 25, 36, 47, 58, 69, 80, 90
            ],

            map: [
                [27, 39],
                [37, 45],
                [49, 60],
                [61, 39],
                [67, 70],
                [41, 90],
                [53, 77],
                [57, 13]
            ]
        },

        drink: {
            icon: "assets/icons/iconDrink.svg",

            timeline: [
                13, 22, 31, 39, 47,
                55, 62, 72, 82, 87
            ],

            map: [
                [57, 11],
                [26, 40],
                [36, 44],
                [60, 38],
                [61, 53],
                [54, 63],
                [63, 72],
                [51, 78],
                [40, 90],
                [32, 85]
            ]
        },

        food: {
            icon: "assets/icons/iconFood.svg",

            timeline: [
                22, 55, 81
            ],

            map: [
                [33, 42],
                [54, 63],
                [62, 73]
            ]
        }
    };


    // RENDER TIMELINE MARKERS

    function renderTimeline(type) {

        timelineContainer.innerHTML = "";

        const data = stationData[type];

        data.timeline.forEach(position => {

            const marker = document.createElement("div");

            marker.className = "timeline-station";

            marker.style.setProperty(
                "--position",
                `${position}%`
            );

            const icon = document.createElement("img");

            icon.src = data.icon;
            icon.alt = "";

            marker.appendChild(icon);
            timelineContainer.appendChild(marker);
        });
    }


    // RENDER MAP PINS

    function renderMap(type) {

        mapContainer.innerHTML = "";

        const data = stationData[type];

        data.map.forEach(([x, y]) => {

            const pin = document.createElement("div");

            pin.className = "map-pin";

            pin.style.setProperty("--x", `${x}%`);
            pin.style.setProperty("--y", `${y}%`);

            const icon = document.createElement("img");

            icon.src = data.icon;
            icon.alt = "";

            pin.appendChild(icon);
            mapContainer.appendChild(pin);
        });
    }


    // CHANGE SELECTED FILTER

    function selectFilter(type) {

        if (!stationData[type]) {
            return;
        }

        buttons.forEach(button => {

            const active =
                button.dataset.filter === type;

            button.classList.toggle(
                "is-active",
                active
            );

            button.setAttribute(
                "aria-pressed",
                String(active)
            );
        });

        renderTimeline(type);
        renderMap(type);
    }


    // BUTTON EVENTS

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            selectFilter(button.dataset.filter);
        });
    });


    // DEFAULT SELECTION

    selectFilter("drink");

});
