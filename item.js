async function getItemInfo() {
    const itemName = document.getElementById('itemName').value;
    const itemInfoDiv = document.getElementById('itemInfo');
    itemInfoDiv.innerHTML = 'Loading...';

    debugLog(`Attempting to fetch data for item: ${itemName}`);

    try {
        const apiUrl = `https://api.wynncraft.com/v3/item/search/${itemName}`;
        debugLog(`API URL: ${apiUrl}`);

        const response = await fetch(apiUrl);
        debugLog(`Response status: ${response.status}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        debugLog('API response received');
        debugLog(JSON.stringify(data, null, 2));

        if (data.length > 0) {
            let infoHTML = '<h2>Search Results:</h2>';
            data.forEach(item => {
                infoHTML += `
                    <div>
                        <h3>${item.name}</h3>
                        <p>Type: ${item.type}</p>
                        <p>Tier: ${item.tier}</p>
                        <p>Level: ${item.level}</p>
                    </div>
                `;
            });
            itemInfoDiv.innerHTML = infoHTML;
        } else {
            itemInfoDiv.innerHTML = `No items found matching "${itemName}"`;
        }
    } catch (error) {
        debugLog(`Error details: ${error.message}`);
        debugLog(`Error stack: ${error.stack}`);
        itemInfoDiv.innerHTML = `Error: ${error.message}. Check the debug console for more details.`;
    }
}
