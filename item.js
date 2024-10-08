async function getItemInfo() {
    const itemName = document.getElementById('itemName').value;
    const itemInfoDiv = document.getElementById('itemInfo');
    itemInfoDiv.innerHTML = 'Loading...';

    debugLog(`Attempting to fetch data for item: ${itemName}`);

    try {
        const apiUrl = `https://api.wynncraft.com/v3/item/search/${encodeURIComponent(itemName)}`;
        debugLog(`API URL: ${apiUrl}`);

        const response = await fetch(apiUrl);
        debugLog(`Response status: ${response.status}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        debugLog('API response:', data);

        if (data.data && data.data.length > 0) {
            const itemData = data.data[0];
            let infoHTML = `
                <h2>${itemData.name}</h2>
                <p>Type: ${itemData.type}</p>
                <p>Tier: ${itemData.tier}</p>
                <p>Level: ${itemData.level}</p>
                <h3>Requirements:</h3>
                <ul>
                    ${Object.entries(itemData.requirements).map(([key, value]) => `<li>${key}: ${value}</li>`).join('')}
                </ul>
                <h3>Identifications:</h3>
                <ul>
                    ${Object.entries(itemData.identifications).map(([key, value]) => `<li>${key}: ${value.min} to ${value.max}</li>`).join('')}
                </ul>
            `;

            itemInfoDiv.innerHTML = infoHTML;
        } else {
            itemInfoDiv.innerHTML = `Error: Item not found or API returned unexpected data`;
            debugLog('Unexpected API response:', data);
        }
    } catch (error) {
        debugLog('Error details:', error);
        itemInfoDiv.innerHTML = `Error: ${error.message}. Check the debug console for more details.`;
    }
}
