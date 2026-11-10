// Initialize PocketBase
const pb = new PocketBase('https://pocketbase-production-2d55.up.railway.app');
pb.autoCancellation(false);

// IMAGE MODAL
const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const closeModal = document.getElementById('image-modal-close');

// Open modal
function openImageModal(imageUrl, altText) {
    modalImage.src = imageUrl;
    modalImage.alt = altText;

    imageModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeImageModal() {
    imageModal.classList.remove('active');
    modalImage.src = '';

    document.body.style.overflow = '';
}

// Close button
closeModal.addEventListener('click', closeImageModal);

// Click outside image
imageModal.addEventListener('click', (event) => {
    if (event.target === imageModal) {
        closeImageModal();
    }
});

// Escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && imageModal.classList.contains('active')) {
        closeImageModal();
    }
});

// FETCHING IMAGES
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

            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Marathon Photo';

            // OPEN MODAL WHEN IMAGE IS CLICKED
            img.addEventListener('click', () => {
                openImageModal(imageUrl, img.alt);
            });

            item.appendChild(img);
            showcase.appendChild(item);
        });

    } catch (error) {
        console.error('Fetch error:', error);
    }
}

fetchImages();