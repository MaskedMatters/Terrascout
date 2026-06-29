// --- DOM ELEMENTS ---
const loginModal = document.getElementById('login-modal');
const saveModal = document.getElementById('save-modal');
const mainUi = document.getElementById('main-ui');
const userBadge = document.getElementById('user-badge');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const userDropdown = document.getElementById('user-dropdown');
const terminalInput = document.querySelector('input[type="text"]');

// Action Buttons
const authGuestBtn = document.getElementById('auth-guest');
const authDiscordBtn = document.getElementById('auth-discord');
const btnSave = document.getElementById('btn-save');
const btnDelete = document.getElementById('btn-delete');
const btnLogout = document.getElementById('btn-logout');
const btnDownloadFile = document.getElementById('btn-download-file');
const btnCloseSaveModal = document.getElementById('btn-close-save-modal');

// --- GAME STATE ---
let currentUser = {
    isLoggedIn: false,
    type: null, // 'guest' or 'discord'
    username: ''
};

// Dummy Game Data Structure for Saves
let gameProgress = {
    atmosphere: { oxygen: 0.03, co2: 95.0, nitrogen: 4.97 },
    colonies: [{ name: "Civ I", population: 2450 }],
    turn: 1
};

// --- INIT APP ---
window.addEventListener('DOMContentLoaded', () => {
    // Check if there's already an active local Guest Save
    const existingSave = localStorage.getItem('terrascout_guest_save');
    if (existingSave) {
        // Automatically wake back up into guest mode if returning
        loginAsGuest(JSON.parse(existingSave));
    } else {
        // Blur background game elements slightly until logged in
        mainUi.classList.add('opacity-40', 'pointer-events-none');
    }
});

// --- AUTH LOGIC ---
authGuestBtn.addEventListener('click', () => {
    loginAsGuest();
});

authDiscordBtn.addEventListener('click', () => {
    // Simulating Discord Authentication redirection/callback flow
    currentUser = {
        isLoggedIn: true,
        type: 'discord',
        username: 'Commander_Lex' // Mock discord username
    };
    setupAuthenticatedUI('https://cdn.discordapp.com/embed/avatars/1.png'); // Default Discord green avatar
});

function loginAsGuest(loadedData = null) {
    currentUser = {
        isLoggedIn: true,
        type: 'guest',
        username: 'Guest_Scout'
    };
    if (loadedData) {
        gameProgress = loadedData;
    } else {
        // Create an initial template save right away
        localStorage.setItem('terrascout_guest_save', JSON.stringify(gameProgress));
    }
    setupAuthenticatedUI('https://cdn.discordapp.com/embed/avatars/0.png'); // Default Guest blue avatar
}

function setupAuthenticatedUI(avatarUrl) {
    // Hide Modal & Lift Blur
    loginModal.classList.add('hidden');
    mainUi.classList.remove('opacity-40', 'pointer-events-none');
    
    // Unlock input field
    terminalInput.removeAttribute('disabled');
    terminalInput.focus();

    // Populate profile card badge
    userBadge.classList.remove('hidden');
    userBadge.classList.add('flex');
    userAvatar.src = avatarUrl;
    userName.textContent = currentUser.username;

    // Adapt profile dropdown rules based on access layer
    if (currentUser.type === 'discord') {
        btnLogout.classList.remove('hidden');
    } else {
        btnLogout.classList.add('hidden');
    }
}

// --- USER PROFILE DROPDOWN INTERACTIVES ---
userBadge.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdown.classList.toggle('hidden');
});

// Auto-close menu if clicking outside
document.addEventListener('click', () => {
    userDropdown.classList.add('hidden');
});

// --- SAVE MANAGEMENT ACTIONS ---
btnSave.addEventListener('click', () => {
    if (currentUser.type === 'guest') {
        localStorage.setItem('terrascout_guest_save', JSON.stringify(gameProgress));
        console.log("Saved safely to LocalStorage.");
    } else if (currentUser.type === 'discord') {
        // Cloud Server Save POST Request Mock
        console.log("Saved securely to remote Terrascout databases.");
    }
    
    // Open the confirmation/download payload Modal
    saveModal.classList.remove('hidden');
});

btnDownloadFile.addEventListener('click', () => {
    // Package up the current state data object into a downloadable string blob
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(gameProgress, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `terrascout_save_${currentUser.username}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
});

btnCloseSaveModal.addEventListener('click', () => {
    saveModal.classList.add('hidden');
});

btnDelete.addEventListener('click', () => {
    if (confirm("Are you sure you want to permanently scrap this sector timeline save file?")) {
        if (currentUser.type === 'guest') {
            localStorage.removeItem('terrascout_guest_save');
        }
        alert("Save file destroyed. Reloading system.");
        window.location.reload();
    }
});

btnLogout.addEventListener('click', () => {
    // Disconnect state simulation
    window.location.reload();
});