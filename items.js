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

async function fetchItems() {
    try {
        const response = await fetch('https://api.wynncraft.com/v3/item/database?fullResult');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching items:', error);
        return null;
    }
}

function displayItems(items) {
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = '';

    for (const [itemName, itemData] of Object.entries(items)) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
            <h3>${itemName}</h3>
            <p>Type: ${itemData.type}</p>
            <p>Level: ${itemData.requirements?.level || 'N/A'}</p>
            ${itemData.tier ? `<p>Tier: ${itemData.tier}</p>` : ''}
            ${itemData.rarity ? `<p>Rarity: ${itemData.rarity}</p>` : ''}
        `;
        itemList.appendChild(itemElement);
    }
}

async function searchItems(query) {
    try {
        const response = await fetch(`https://api.wynncraft.com/v3/item/search/${encodeURIComponent(query)}`);
        const data = await response.json();
        return data.results || {};
    } catch (error) {
        console.error('Error searching items:', error);
        return {};
    }
}

document.getElementById('itemSearchForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const query = document.getElementById('itemSearchInput').value;
    const searchResults = await searchItems(query);
    displayItems(searchResults);
});
