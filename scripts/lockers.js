//! INITIALIZE POCKETBASE
const pb = new PocketBase('https://pocketbase-production-2d55.up.railway.app');
pb.autoCancellation(false);

const pinInputs = document.querySelectorAll('.big-pin-input');
const reserveBtn = document.getElementById('reserve-btn');

//! POPUPS & OVERLAYS
const popupOverlay = document.getElementById('popup-overlay');
const reservedPopup = document.getElementById('reserved');
const cancelPopup = document.getElementById('cancel');
const cancelSuccessPopup = document.getElementById('cancel-success');

//! BUTTONS
const closePopupBtn = document.getElementById('close-popup-btn');
const closeCancelBtn = document.getElementById('close-cancel-btn');
const closeSuccessBtn = document.getElementById('close-success-btn');
const checkOutMainBtn = document.getElementById('check-out');
const executeCheckOutBtn = document.getElementById('check-out-btn');

const reserveNumberText = document.getElementById('reserve-number');

// Helper function to handle auto-advancing inputs
function setupInputAutoAdvance(inputs) {
    inputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });
}

// Setup auto-advance for all pin/locker input groups
setupInputAutoAdvance(pinInputs);
setupInputAutoAdvance(document.querySelectorAll('.locker-num'));
setupInputAutoAdvance(document.querySelectorAll('.checkout-pin'));

// Close all popups & hide overlay
function hideAllPopups() {
    reservedPopup.classList.remove('active');
    cancelPopup.classList.remove('active');
    cancelSuccessPopup.classList.remove('active');
    popupOverlay.classList.remove('active');
}

// Event Listeners for Closing
closePopupBtn.addEventListener('click', hideAllPopups);
closeCancelBtn.addEventListener('click', hideAllPopups);
closeSuccessBtn.addEventListener('click', hideAllPopups);
popupOverlay.addEventListener('click', hideAllPopups);

// Open Check-Out Popup when clicking the Check Out widget on the main page
checkOutMainBtn.addEventListener('click', () => {
    hideAllPopups();
    // Clear previous inputs
    document.querySelectorAll('.locker-num, .checkout-pin').forEach(i => i.value = '');
    cancelPopup.classList.add('active');
    popupOverlay.classList.add('active');
});

// Handle Reservation
reserveBtn.addEventListener('click', async () => {
    const pin = Array.from(pinInputs).map(i => i.value).join('');

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        alert('Please enter a valid 4-digit PIN.');
        return;
    }

    try {
        const resultList = await pb.collection('marathonLockers').getList(1, 100, {
            sort: '-number',
        });

        let targetLocker = resultList.items.find(locker => !locker.pin || locker.pin === "");
        let updatedLocker;

        if (targetLocker) {
            updatedLocker = await pb.collection('marathonLockers').update(targetLocker.id, {
                pin: pin
            });
        } else {
            const highestNumber = resultList.items.length > 0 ? Number(resultList.items[0].number) || 0 : 0;
            const nextNumber = highestNumber + 1;

            updatedLocker = await pb.collection('marathonLockers').create({
                number: nextNumber,
                pin: pin
            });
        }

        reserveNumberText.textContent = String(updatedLocker.number).padStart(3, '0');
        hideAllPopups();
        reservedPopup.classList.add('active');
        popupOverlay.classList.add('active');

        pinInputs.forEach(i => i.value = '');

    } catch (err) {
        console.error('Reservation error:', err);
        alert('Failed to reserve locker. Please try again.');
    }
});

// Handle Check Out / Cancellation
executeCheckOutBtn.addEventListener('click', async () => {
    const lockerNumInput = Array.from(document.querySelectorAll('.locker-num')).map(i => i.value).join('');
    const pinInput = Array.from(document.querySelectorAll('.checkout-pin')).map(i => i.value).join('');

    if (!lockerNumInput || lockerNumInput.length === 0) {
        alert('Please enter a locker number.');
        return;
    }

    if (pinInput.length !== 4) {
        alert('Please enter your 4-digit PIN code.');
        return;
    }

    const targetNumber = Number(lockerNumInput);

    try {
        // Find the specific locker number in the database
        const matchingLockers = await pb.collection('marathonLockers').getList(1, 1, {
            filter: `number = ${targetNumber}`
        });

        if (matchingLockers.items.length === 0) {
            alert('Locker number not found.');
            return;
        }

        const locker = matchingLockers.items[0];

        // Verify PIN
        if (String(locker.pin).trim() !== String(pinInput).trim()) {
            alert('Incorrect PIN for this locker.');
            return;
        }

        // Delete the record from PocketBase!
        await pb.collection('marathonLockers').delete(locker.id);

        // Hide checkout modal and show success modal
        hideAllPopups();
        cancelSuccessPopup.classList.add('active');
        popupOverlay.classList.add('active');

    } catch (err) {
        console.error('Check-out error:', err);
        alert('Failed to check out. Please try again.');
    }
});