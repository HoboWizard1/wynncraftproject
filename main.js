function showTab(tabId) {
    const tabs = document.getElementsByClassName('tab-content');
    for (let tab of tabs) {
        tab.style.display = 'none';
    }
    document.getElementById(tabId).style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {
    showTab('playerTab'); // Show player tab by default
});