function showTab(tabId) {
    const tabs = document.getElementsByClassName('tab-content');
    for (let tab of tabs) {
        tab.style.display = 'none';
    }
    document.getElementById(tabId).style.display = 'block';
}

function displayErrorMessage(error, context) {
    const infoDiv = document.getElementById(`${context}Info`);
    let errorMessage = `An error occurred while fetching ${context} data. `;

    if (error.message.includes('HTTP error')) {
        errorMessage += 'The server might be down or experiencing issues. Please try again later.';
    } else if (error.message.includes('NetworkError')) {
        errorMessage += 'There seems to be a problem with your internet connection. Please check your connection and try again.';
    } else if (error.message.includes('SyntaxError')) {
        errorMessage += 'The data received from the server was invalid. This might be a temporary issue. Please try again later.';
    } else {
        errorMessage += 'Please try again later or contact support if the problem persists.';
    }

    infoDiv.innerHTML = `<p class="error">${errorMessage}</p>`;
    debugLog(`Error: ${errorMessage}`);
}