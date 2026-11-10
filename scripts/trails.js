
document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // ELEMENTS
    // =====================================

    const buttons = document.querySelectorAll(
        ".station-filter"
    );

    const mapContainer = document.getElementById(
        "mapPins"
    );

    if (!mapContainer) {
        return;
    }

    // =====================================
    // STATION DATA
    // =====================================

    const stationData = {

        // WATER
        water: {
            icon: "assets/icons/iconWater.svg",

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

        // SPORT DRINK
        drink: {
            icon: "assets/icons/iconDrink.svg",

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

        // FOOD
        food: {
            icon: "assets/icons/iconFood.svg",

            map: [
                [33, 42],
                [54, 63],
                [62, 73]
            ]
        },

        // TOILET
        // Temporary example positions.
        // Replace with verified locations.
        toilet: {
            icon: "assets/icons/iconToilet.svg",

            map: [
                [34, 43],
                [56, 57],
                [63, 78],
                [43, 90]
            ]
        }
    };

    // =====================================
    // CURRENT SELECTION
    // =====================================

    let selectedFilter = null;

    // =====================================
    // RENDER MAP PINS
    // =====================================

    function renderMap(type) {

        mapContainer.innerHTML = "";

        if (!type || !stationData[type]) {
            return;
        }

        const data = stationData[type];

        data.map.forEach(([x, y]) => {

            const pin = document.createElement("div");

            pin.className = "map-pin";

            /*
                The route image is displayed at
                75% width, beginning at 11.5%.

                Convert the original image-relative
                X coordinates to map-card coordinates.
            */

            const adjustedX = 11.5 + x * 0.75;

            pin.style.setProperty(
                "--x",
                `${adjustedX}%`
            );

            pin.style.setProperty(
                "--y",
                `${y}%`
            );

            const icon = document.createElement("img");

            icon.src = data.icon;
            icon.alt = "";

            pin.appendChild(icon);
            mapContainer.appendChild(pin);
        });
    }

    // =====================================
    // UPDATE FILTER SELECTION
    // =====================================

    function selectFilter(type) {

        if (type !== null && !stationData[type]) {
            return;
        }

        selectedFilter = type;

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

        renderMap(type);
    }

    // =====================================
    // CLICK EVENTS
    // =====================================

    buttons.forEach(button => {

        button.addEventListener("click", () => {

            const type = button.dataset.filter;

            if (selectedFilter === type) {
                selectFilter(null);
            } else {
                selectFilter(type);
            }
        });
    });

    // =====================================
    // INITIAL STATE
    // =====================================

    // No station selected on page load.
    selectFilter(null);

});
