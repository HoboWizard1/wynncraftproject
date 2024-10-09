function showTab(tabId) {
    const tabs = document.getElementsByClassName('tab-content');
    for (let tab of tabs) {
        tab.style.display = 'none';
    }
    document.getElementById(tabId).style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {
    initializeDebug();
    showTab('playerTab');
    setVersionNumber();
    setupEventListeners();
});

function setVersionNumber() {
    document.getElementById('version').textContent = 'v' + window.appVersion;
}

function setupEventListeners() {
    const playerSearchForm = document.getElementById('playerSearchForm');
    if (playerSearchForm) {
        playerSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            getPlayerInfo();
        });
    }

    const itemSearchForm = document.getElementById('itemSearchForm');
    if (itemSearchForm) {
        itemSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchItems();
        });
    }
}