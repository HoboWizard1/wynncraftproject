async function getPlayerInfo() {
    const playerName = document.getElementById('playerName').value;
    const playerInfoDiv = document.getElementById('playerInfo');
    playerInfoDiv.innerHTML = 'Loading...';

    debugLog(`Attempting to fetch data for player: ${playerName}`);
    debugLog(`User agent: ${navigator.userAgent}`);
    debugLog(`Current page URL: ${window.location.href}`);

    try {
        // Use a different CORS proxy
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        const apiUrl = `${corsProxy}${encodeURIComponent(`https://api.wynncraft.com/v3/player/${playerName}?fullResult`)}`;
        debugLog(`API URL (with CORS proxy): ${apiUrl}`);

        const startTime = performance.now();
        const response = await fetch(apiUrl);
        const endTime = performance.now();
        
        debugLog(`Response status: ${response.status}`);
        debugLog(`Response time: ${(endTime - startTime).toFixed(2)}ms`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        debugLog('API response received');
        debugLog(`Response body: ${JSON.stringify(data, null, 2)}`);

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
                        <p>Combat Level: ${character.combatLevel.total}</p>
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
        debugLog(`Error name: ${error.name}`);
        debugLog(`Error message: ${error.message}`);
        debugLog(`Error stack: ${error.stack}`);
        playerInfoDiv.innerHTML = `Error: ${error.message}. Check the debug console for more details.`;
        
        if (error.name === 'TypeError') {
            debugLog('This might be a CORS or network connectivity issue.');
            debugLog(`Origin: ${window.location.origin}`);
            debugLog(`Protocol: ${window.location.protocol}`);
        }

        if (error.name === 'SyntaxError') {
            debugLog('This might be an issue with parsing the JSON response.');
        }

        debugLog('Network information:');
        if (navigator.connection) {
            debugLog(`Downlink: ${navigator.connection.downlink} Mbps`);
            debugLog(`Effective type: ${navigator.connection.effectiveType}`);
            debugLog(`Round-trip time: ${navigator.connection.rtt} ms`);
        } else {
            debugLog('Network information not available');
        }
    }
}