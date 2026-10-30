// Initialize PocketBase
const pb = new PocketBase('https://pocketbase-production-2d55.up.railway.app');
pb.autoCancellation(false);

// Fetching Images
async function fetchImages() {
    const showcase = document.getElementById('gallery-showcase');

    try {
        const records = await pb.collection('marathonPics').getList(1, 50, {
            sort: '-created'
        });

        showcase.innerHTML = '';

        if (records.items.length === 0) {
            showcase.innerHTML = '<p style="color: white; padding: 16px;">No pictures uploaded yet!</p>';
            return;
        }

        const randomClasses = ['', 'tall', 'wide'];

        records.items.forEach(record => {
            const imageUrl = pb.files.getUrl(record, record.img);

            const item = document.createElement('div');
            item.className = 'gallery-item';

            const randomChoice = randomClasses[Math.floor(Math.random() * randomClasses.length)];
            if (randomChoice) {
                item.classList.add(randomChoice);
            }

            item.innerHTML = `<img src="${imageUrl}" alt="Marathon Photo">`;
            showcase.appendChild(item);
        });

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

fetchImages();