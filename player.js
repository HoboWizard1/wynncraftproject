async function getPlayerInfo() {
    const playerName = document.getElementById('playerName').value;
    const playerInfoDiv = document.getElementById('playerInfo');
    playerInfoDiv.innerHTML = 'Loading...';

    debugLog(`Attempting to fetch data for player: ${playerName}`);
    debugLog(`User agent: ${navigator.userAgent}`);
    debugLog(`Current page URL: ${window.location.href}`);

    try {
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        const apiUrl = `${corsProxy}${encodeURIComponent(`https://api.wynncraft.com/v3/player/${playerName}?fullResult`)}`;
        debugLog(`API URL (with CORS proxy): ${apiUrl}`);

        const startTime = performance.now();
        const response = await fetch(apiUrl);
        const endTime = performance.now();
        const responseTime = (endTime - startTime).toFixed(2);

        debugLog(`Response status: ${response.status}`);
        debugLog(`Response time: ${responseTime}ms`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        debugLog('API response received');
        debugLog(`Response body: ${JSON.stringify(data, null, 2)}`);

        if (data && data.characters) {
            const activeCharacter = data.characters[data.activeCharacter];
            if (activeCharacter) {
                const characterInfo = `
                    <h2>${data.username}</h2>
                    <p>Class: ${activeCharacter.type}</p>
                    <p>Level: ${activeCharacter.level}</p>
                    <p>Total Level: ${activeCharacter.totalLevel}</p>
                    <p>Playtime: ${(activeCharacter.playtime / 24).toFixed(2)} days</p>
                `;
                playerInfoDiv.innerHTML = characterInfo;
            } else {
                playerInfoDiv.innerHTML = 'No active character found.';
            }
        } else {
            playerInfoDiv.innerHTML = 'Player data not found or in unexpected format.';
        }
    } catch (error) {
        console.error('Error:', error);
        debugLog(`Error name: ${error.name}`);
        debugLog(`Error message: ${error.message}`);
        debugLog(`Error stack: ${error.stack}`);
        playerInfoDiv.innerHTML = 'Error fetching player data. Please try again.';

        // Add network information
        debugLog('This might be a CORS or network connectivity issue.');
        debugLog(`Origin: ${window.location.origin}`);
        debugLog(`Protocol: ${window.location.protocol}`);
        debugLog('Network information:');
        if ('connection' in navigator) {
            debugLog(`Effective connection type: ${navigator.connection.effectiveType}`);
            debugLog(`Downlink: ${navigator.connection.downlink} Mbps`);
        } else {
            debugLog('Network information not available');
        }
    }
}

function copyDebugToClipboard() {
    const debugConsole = document.getElementById('debugConsole');
    const textArea = document.createElement('textarea');
    textArea.value = debugConsole.innerText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('Debug log copied to clipboard!');
}