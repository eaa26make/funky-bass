
//! INITIALIZE POCKETBASE
const pb = new PocketBase('https://pocketbase-production-2d55.up.railway.app');
pb.autoCancellation(false);


//! ELEMENTS
const fileInput = document.getElementById('file-input');
const selectButton = document.getElementById('select-button');

const previewContainer = document.getElementById('preview-container');
const previewGrid = document.getElementById('preview-grid');
const imageCount = document.getElementById('image-count');

const uploadButton = document.getElementById('upload-button');
const uploadStatus = document.getElementById('upload-status');


// SELECTED FILES
let selectedFiles = [];


// OPEN PHONE GALLERY
selectButton.addEventListener('click', () => {
    fileInput.click();
});


// SELECT IMAGES
fileInput.addEventListener('change', () => {
    const newFiles = Array.from(fileInput.files);

    selectedFiles = [...selectedFiles, ...newFiles];

    fileInput.value = '';

    updatePreviews();
});


// UPDATE PREVIEWS
function updatePreviews() {
    previewGrid.innerHTML = '';

    if (selectedFiles.length === 0) {
        previewContainer.hidden = true;
        return;
    }

    previewContainer.hidden = false;

    imageCount.textContent = selectedFiles.length;

    selectedFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'upload-preview-item';

        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.alt = 'Selected marathon photo';

        const removeButton = document.createElement('button');
        removeButton.className = 'upload-remove-button';
        removeButton.type = 'button';
        removeButton.textContent = '×';
        removeButton.setAttribute('aria-label', 'Remove image');

        removeButton.addEventListener('click', () => {
            selectedFiles.splice(index, 1);
            updatePreviews();
        });

        item.appendChild(img);
        item.appendChild(removeButton);

        previewGrid.appendChild(item);
    });
}


// UPLOAD TO POCKETBASE
uploadButton.addEventListener('click', async () => {
    if (selectedFiles.length === 0) return;

    uploadButton.disabled = true;
    selectButton.disabled = true;

    let uploaded = 0;

    uploadStatus.className = 'upload-status';
    uploadStatus.textContent = 'Uploading photos...';

    try {
        for (const file of selectedFiles) {
            const formData = new FormData();

            formData.append('img', file);

            await pb.collection('marathonPics').create(formData);

            uploaded++;

            uploadStatus.textContent =
                `Uploading ${uploaded}/${selectedFiles.length}...`;
        }

        selectedFiles = [];

        updatePreviews();

        uploadStatus.className = 'upload-status success';
        uploadStatus.textContent = 'Photo(s) uploaded successfully!';

    } catch (error) {
        console.error('Upload error:', error);

        uploadStatus.className = 'upload-status error';
        uploadStatus.textContent =
            `Upload failed. ${uploaded} photo(s) uploaded successfully.`;

    } finally {
        uploadButton.disabled = false;
        selectButton.disabled = false;
    }
});