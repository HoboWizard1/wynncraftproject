async function getPlayerInfo() {
    const playerName = document.getElementById('playerName').value;
    const playerInfoDiv = document.getElementById('playerInfo');
    playerInfoDiv.innerHTML = 'Loading...';

    debugLog(`Attempting to fetch data for player: ${playerName}`);
    debugLog(`User agent: ${navigator.userAgent}`);
    debugLog(`Current page URL: ${window.location.href}`);

    try {
        // Use a CORS proxy
        const corsProxy = 'https://cors-anywhere.herokuapp.com/';
        const apiUrl = `${corsProxy}https://api.wynncraft.com/v3/player/${playerName}?fullResult`;
        debugLog(`API URL (with CORS proxy): ${apiUrl}`);

        const startTime = performance.now();
        const response = await fetch(apiUrl, {
            headers: {
                'Origin': 'https://hobowizard1.github.io'
            }
        });
        const endTime = performance.now();
        
        debugLog(`Response status: ${response.status}`);
        debugLog(`Response time: ${(endTime - startTime).toFixed(2)}ms`);
        debugLog(`Response headers: ${JSON.stringify(Object.fromEntries(response.headers), null, 2)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        debugLog('API response received');
        debugLog(`Response body: ${JSON.stringify(data, null, 2)}`);

        if (data.data && data.data.length > 0) {
            const playerData = data.data[0];
            let infoHTML = `
                <h2>${playerData.username}</h2>
                <p>Rank: ${playerData.rank}</p>
                <p>First Join: ${new Date(playerData.firstJoin).toLocaleString()}</p>
                <p>Last Join: ${new Date(playerData.lastJoin).toLocaleString()}</p>
                <p>Playtime: ${Math.round(playerData.playtime / 60)} hours</p>
                <h3>Characters:</h3>
            `;

            for (const character of playerData.characters) {
                infoHTML += `
                    <div>
                        <h4>${character.type}</h4>
                        <p>Level: ${character.level}</p>
                        <p>Combat Level: ${character.combatLevel.total}</p>
                    </div>
                `;
            }

            if (playerData.guild && playerData.guild.name) {
                infoHTML += `
                    <h3>Guild:</h3>
                    <p>Name: ${playerData.guild.name}</p>
                    <p>Rank: ${playerData.guild.rank}</p>
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
        
        if (error instanceof TypeError) {
            debugLog('This might be a CORS or network connectivity issue.');
            debugLog(`Origin: ${window.location.origin}`);
            debugLog(`Protocol: ${window.location.protocol}`);
        }

        if (error instanceof SyntaxError) {
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