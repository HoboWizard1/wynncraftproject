function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

async function getPlayerInfo() {
    const playerName = document.getElementById('playerName').value;
    const playerInfoDiv = document.getElementById('playerInfo');
    playerInfoDiv.innerHTML = 'Loading...';

    console.log(`Attempting to fetch data for player: ${playerName}`);

    try {
        const apiUrl = `https://api.wynncraft.com/v3/player/${playerName}?fullResult`;
        console.log(`API URL: ${apiUrl}`);

        const response = await fetch(apiUrl);
        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API response:', data);

        if (data.username) {
            let infoHTML = `
                <h2>${data.username}</h2>
                <p>Rank: ${data.rank}</p>
                <p>Online: ${data.online ? 'Yes' : 'No'}</p>
                <p>First Join: ${data.firstJoin}</p>
                <p>Last Join: ${data.lastJoin}</p>
                <p>Playtime: ${data.playtime} hours</p>
                <h3>Characters:</h3>
            `;

            for (const [characterUuid, character] of Object.entries(data.characters)) {
                infoHTML += `
                    <div>
                        <h4>${character.nickname} (${character.type})</h4>
                        <p>Level: ${character.level}</p>
                        <p>Total Level: ${character.totalLevel}</p>
                    </div>
                `;
            }

            playerInfoDiv.innerHTML = infoHTML;
        } else {
            playerInfoDiv.innerHTML = `Error: Player not found or API returned unexpected data`;
            console.error('Unexpected API response:', data);
        }
    } catch (error) {
        console.error('Error details:', error);
        playerInfoDiv.innerHTML = `Error: ${error.message}. Check the console for more details.`;
    }
}

async function getItemInfo() {
    const itemName = document.getElementById('itemName').value;
    const itemInfoDiv = document.getElementById('itemInfo');
    itemInfoDiv.innerHTML = 'Loading...';

    console.log(`Attempting to fetch data for item: ${itemName}`);

    try {
        // Note: You'll need to replace this with the correct Wynncraft API endpoint for item info
        const apiUrl = `https://api.wynncraft.com/v3/item/${itemName}`;
        console.log(`API URL: ${apiUrl}`);

        const response = await fetch(apiUrl);
        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API response:', data);

        // You'll need to adjust this part based on the actual structure of the item data
        if (data.name) {
            let infoHTML = `
                <h2>${data.name}</h2>
                <p>Type: ${data.type}</p>
                <p>Level: ${data.level}</p>
                <!-- Add more item properties here -->
            `;

            itemInfoDiv.innerHTML = infoHTML;
        } else {
            itemInfoDiv.innerHTML = `Error: Item not found or API returned unexpected data`;
            console.error('Unexpected API response:', data);
        }
    } catch (error) {
        console.error('Error details:', error);
        itemInfoDiv.innerHTML = `Error: ${error.message}. Check the console for more details.`;
    }
}

// Add this line to check if the script is loaded
console.log('script.js loaded');