async function getItemInfo() {
    const itemName = document.getElementById('itemName').value;
    const itemInfoDiv = document.getElementById('itemInfo');
    itemInfoDiv.innerHTML = 'Loading...';

    debugLog(`Fetching item info for: ${itemName}`);

    try {
        // Replace this with the actual Wynncraft item API endpoint
        const apiUrl = `https://api.wynncraft.com/v3/item/${encodeURIComponent(itemName)}`;
        
        debugLog(`API URL: ${apiUrl}`);

        const response = await fetch(apiUrl);
        debugLog(`Response status: ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        debugLog('API response received');

        if (data.name) {
            displayItemInfo(data);
        } else {
            itemInfoDiv.innerHTML = `<p class="error">Item "${itemName}" not found. Please check the spelling and try again.</p>`;
            debugLog(`Item "${itemName}" not found`);
        }
    } catch (error) {
        console.error('Error:', error);
        displayErrorMessage(error);
    }
}

function displayItemInfo(item) {
    // Implement this function to display item information
    debugLog('Displaying item information');
    // ...
}

function displayErrorMessage(error) {
    const itemInfoDiv = document.getElementById('itemInfo');
    let errorMessage = 'An error occurred while fetching item data. ';

    if (error.message.includes('HTTP error')) {
        errorMessage += 'The server might be down or experiencing issues. Please try again later.';
    } else if (error.message.includes('NetworkError')) {
        errorMessage += 'There seems to be a problem with your internet connection. Please check your connection and try again.';
    } else if (error.message.includes('SyntaxError')) {
        errorMessage += 'The data received from the server was invalid. This might be a temporary issue. Please try again later.';
    } else {
        errorMessage += 'Please try again later or contact support if the problem persists.';
    }

    itemInfoDiv.innerHTML = `<p class="error">${errorMessage}</p>`;
    debugLog(`Error: ${errorMessage}`);
}
