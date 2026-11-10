
document.addEventListener("DOMContentLoaded", async () => {

    // ==================================
    // IDENTIFY CURRENT PAGE
    // ==================================

    const fileName = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    const pages = {
        "index.html": "home",
        "trails.html": "trails",
        "goodtoknow.html": "goodtoknow",
        "lockers.html": "lockers",
        "gallery.html": "gallery",
        "sleeper.html": "sleeper"
    };

    const titles = {
        trails: "COURSE INFO",
        goodtoknow: "GOOD TO KNOW",
        lockers: "LOCKER",
        gallery: "PHOTOS"
    };

    const currentPage =
        document.body.dataset.page ||
        pages[fileName] ||
        (fileName === "" ? "home" : "subpage");

    document.body.dataset.page = currentPage;


    // Sleeper never receives shared components.
    if (currentPage === "sleeper" || fileName === "sleeper.html") {
        return;
    }


    // ==================================
    // PROJECT ROOT
    // ==================================

    const script = document.querySelector(
        'script[src*="shared.js"]'
    );

    const projectRoot = script
        ? new URL("../", script.src)
        : new URL("./", window.location.href);


    // ==================================
    // LOAD HEADER AND FOOTER
    // ==================================

    async function loadComponent(id, path) {

        let container = document.getElementById(id);

        if (!container) {

            container = document.createElement("div");
            container.id = id;

            if (id === "site-header") {
                document.body.prepend(container);
            } else {
                document.body.append(container);
            }
        }

        try {

            const url = new URL(path, projectRoot);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`${path}: HTTP ${response.status}`);
            }

            container.innerHTML = await response.text();


            // Convert asset paths to project-root URLs.
            container.querySelectorAll("img[src]").forEach(img => {

                img.src = new URL(
                    img.getAttribute("src"),
                    projectRoot
                ).href;

            });


            // Convert navigation links.
            container.querySelectorAll("a[href]").forEach(link => {

                const href = link.getAttribute("href");

                if (href && !href.startsWith("#")) {
                    link.href = new URL(href, projectRoot).href;
                }

            });

        } catch (error) {
            console.error("Component loading failed:", error);
        }

    }


    await Promise.all([

        loadComponent(
            "site-header",
            "Components/header.html"
        ),

        loadComponent(
            "site-footer",
            "Components/footer.html"
        )

    ]);


    // ==================================
    // DYNAMIC HEADER TITLE
    // ==================================

    const headerTitle = document.querySelector(
        ".cm-header__title"
    );

    if (headerTitle) {

        headerTitle.textContent =
            document.body.dataset.headerTitle ||
            titles[currentPage] ||
            "COPENHAGEN MARATHON";

    }


    // ==================================
    // LANGUAGE BUTTONS
    // ==================================

    const languageButtons = document.querySelectorAll(
        ".cm-language-btn"
    );

    languageButtons.forEach(button => {

        button.addEventListener("click", () => {

            const selectedLanguage = button.dataset.lang;

            languageButtons.forEach(btn => {

                const selected =
                    btn.dataset.lang === selectedLanguage;

                btn.classList.toggle("active", selected);

                btn.setAttribute(
                    "aria-pressed",
                    String(selected)
                );

            });

        });

    });

});
