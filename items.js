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

async function searchItems() {
    const query = document.getElementById('itemSearchInput').value;
    debugLog(`Searching for items with query: "${query}"`);
    try {
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        const apiUrl = `${corsProxy}${encodeURIComponent(`https://api.wynncraft.com/v3/item/search/${query}`)}`;
        
        debugLog(`Constructed API URL: ${apiUrl}`);

        const response = await fetch(apiUrl);
        debugLog(`Received response with status: ${response.status}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        debugLog(`Parsed data: ${JSON.stringify(data, null, 2)}`);

        return data;
    } catch (error) {
        console.error('Error searching items:', error);
        debugLog(`Error occurred during search: ${error.message}`);
        return {};
    }
}

function displayItemResults(data) {
    debugLog('Displaying item results');
    const itemResults = document.getElementById('itemResults');
    itemResults.innerHTML = '';

    if (!data || Object.keys(data).length === 0) {
        debugLog('No items found, displaying message');
        itemResults.innerHTML = '<p>No items found.</p>';
        return;
    }

    for (const [itemName, itemData] of Object.entries(data)) {
        debugLog(`Creating element for item: ${itemName}`);
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
            <img src="${getItemImageUrl(itemData)}" alt="${itemName}" class="item-image" onerror="this.src='images/unknown.png';">
            <h3>${itemName}</h3>
            <p>Type: ${itemData.type}</p>
            <p>Internal Name: ${itemData.internalName}</p>
            ${itemData.weaponType ? `<p>Weapon Type: ${itemData.weaponType}</p>` : ''}
            ${itemData.attackSpeed ? `<p>Attack Speed: ${itemData.attackSpeed}</p>` : ''}
            ${itemData.tier ? `<p>Tier: ${itemData.tier}</p>` : ''}
            ${itemData.rarity ? `<p>Rarity: ${itemData.rarity}</p>` : ''}
            ${itemData.dropRestriction ? `<p>Drop Restriction: ${itemData.dropRestriction}</p>` : ''}
            ${itemData.restrictions ? `<p>Restrictions: ${itemData.restrictions}</p>` : ''}
            ${itemData.lore ? `<p>Lore: ${itemData.lore}</p>` : ''}
            <h4>Requirements:</h4>
            <ul>
                ${Object.entries(itemData.requirements || {}).map(([key, value]) => `<li>${key}: ${value}</li>`).join('')}
            </ul>
            ${itemData.identifications ? `
                <h4>Identifications:</h4>
                <ul>
                    ${Object.entries(itemData.identifications).map(([key, value]) => {
                        if (typeof value === 'object') {
                            return `<li>${key}: Min ${value.min}, Max ${value.max}</li>`;
                        } else {
                            return `<li>${key}: ${value}</li>`;
                        }
                    }).join('')}
                </ul>
            ` : ''}
            ${itemData.base ? `
                <h4>Base Stats:</h4>
                <ul>
                    ${Object.entries(itemData.base).map(([key, value]) => `<li>${key}: Min ${value.min}, Max ${value.max}</li>`).join('')}
                </ul>
            ` : ''}
        `;
        itemResults.appendChild(itemElement);
        debugLog(`Added item element for: ${itemName}`);
    }

    debugLog('Finished displaying all items');
}

function getItemImageUrl(itemData) {
    const internalName = itemData.internalName.toLowerCase().replace(/\s+/g, '_');
    return `https://cdn.wynncraft.com/nextgen/items/${internalName}.png`;
}

document.addEventListener('DOMContentLoaded', function() {
    const itemSearchForm = document.getElementById('itemSearchForm');
    if (itemSearchForm) {
        itemSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchItems();
        });
    }
});

function debugLog(message) {
    console.log(`[ItemSearch Debug] ${message}`);
}

debugLog('items.js script loaded');