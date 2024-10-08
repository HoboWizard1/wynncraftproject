async function getPlayerInfo() {
    const playerName = document.getElementById('playerName').value;
    const playerInfoDiv = document.getElementById('playerInfo');
    playerInfoDiv.innerHTML = 'Loading...';

    debugLog(`Attempting to fetch data for player: ${playerName}`);

    try {
        const apiUrl = `https://api.wynncraft.com/v3/player/${playerName}?fullResult`;
        debugLog(`API URL: ${apiUrl}`);

        const response = await fetch(apiUrl);
        debugLog(`Response status: ${response.status}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        debugLog('API response received');
        debugLog(JSON.stringify(data, null, 2));

        if (data.username) {
            let infoHTML = `
                <h2>${data.username}</h2>
                <p>Rank: ${data.rank}</p>
                <p>First Join: ${new Date(data.firstJoin).toLocaleString()}</p>
                <p>Last Join: ${new Date(data.lastJoin).toLocaleString()}</p>
                <p>Playtime: ${Math.round(data.playtime / 60)} hours</p>
                <h3>Characters:</h3>
            `;

            for (const [characterUuid, character] of Object.entries(data.characters)) {
                infoHTML += `
                    <div>
                        <h4>${character.type}</h4>
                        <p>Level: ${character.level}</p>
                        <p>Total Level: ${character.totalLevel}</p>
                    </div>
                `;
            }

            if (data.guild && data.guild.name) {
                infoHTML += `
                    <h3>Guild:</h3>
                    <p>Name: ${data.guild.name}</p>
                    <p>Rank: ${data.guild.rank}</p>
                `;
            }

            playerInfoDiv.innerHTML = infoHTML;
        } else {
            playerInfoDiv.innerHTML = `Error: Player not found or API returned unexpected data`;
            debugLog('Unexpected API response: ' + JSON.stringify(data, null, 2));
        }
    } catch (error) {
        debugLog(`Error details: ${error.message}`);
        debugLog(`Error stack: ${error.stack}`);
        playerInfoDiv.innerHTML = `Error: ${error.message}. Check the debug console for more details.`;
    }
}