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
    debugLog(`Searching for items with query: "${query}"`);
    try {
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        const apiUrl = `${corsProxy}${encodeURIComponent(`https://api.wynncraft.com/v3/item/search/${query}`)}`;
        
        debugLog(`Constructed API URL: ${apiUrl}`);

        debugLog('Sending fetch request...');
        const response = await fetch(apiUrl);
        debugLog(`Received response with status: ${response.status}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        debugLog('Parsing JSON response...');
        const data = await response.json();
        debugLog(`Parsed data: ${JSON.stringify(data, null, 2)}`);

        const results = data.results || {};
        debugLog(`Number of items found: ${Object.keys(results).length}`);

        return results;
    } catch (error) {
        console.error('Error searching items:', error);
        debugLog(`Error occurred during search: ${error.message}`);
        return {};
    }
}

function displayItemResults(items) {
    debugLog('Displaying item results');
    const itemResults = document.getElementById('itemResults');
    itemResults.innerHTML = '';

    const itemCount = Object.keys(items).length;
    debugLog(`Number of items to display: ${itemCount}`);

    if (itemCount === 0) {
        debugLog('No items found, displaying message');
        itemResults.innerHTML = '<p>No items found.</p>';
        return;
    }

    for (const [itemName, itemData] of Object.entries(items)) {
        debugLog(`Creating element for item: ${itemName}`);
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
            <h3>${itemName}</h3>
            <p>Type: ${itemData.type}</p>
            <p>Level: ${itemData.requirements?.level || 'N/A'}</p>
            ${itemData.tier ? `<p>Tier: ${itemData.tier}</p>` : ''}
            ${itemData.rarity ? `<p>Rarity: ${itemData.rarity}</p>` : ''}
        `;
        itemResults.appendChild(itemElement);
        debugLog(`Added item element for: ${itemName}`);
    }

    debugLog('Finished displaying all items');
}

document.addEventListener('DOMContentLoaded', function() {
    debugLog('DOMContentLoaded event fired');
    const itemSearchForm = document.getElementById('itemSearchForm');
    if (itemSearchForm) {
        debugLog('Item search form found, adding event listener');
        itemSearchForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            debugLog('Search form submitted');
            const query = document.getElementById('itemSearchInput').value;
            debugLog(`Search query: "${query}"`);
            const searchResults = await searchItems(query);
            debugLog('Search completed, displaying results');
            displayItemResults(searchResults);
        });
    } else {
        debugLog('Item search form not found in the DOM');
    }
});

// Additional debug information
debugLog('items.js script loaded');
