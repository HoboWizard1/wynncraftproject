async function getPlayerInfo() {
    const playerName = document.getElementById('playerName').value;
    const playerInfoDiv = document.getElementById('playerInfo');
    playerInfoDiv.innerHTML = 'Loading...';

    debugLog(`Attempting to fetch data for player: ${playerName}`);

    try {
        debugLog(`User agent: ${navigator.userAgent}`);
        debugLog(`Current page URL: ${window.location.href}`);

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
        
        debugLog('API response received');
        const data = await response.json();
        debugLog('Response body: ' + JSON.stringify(data).substring(0, 500) + '...');

        if (data.username) {
            displayPlayerInfo(data);
        } else {
            playerInfoDiv.innerHTML = `<p class="error">Player "${playerName}" not found. Please check the spelling and try again.</p>`;
            debugLog(`Player "${playerName}" not found`);
        }
    } catch (error) {
        console.error('Error:', error);
        debugLog(`Error name: ${error.name}`);
        debugLog(`Error message: ${error.message}`);
        debugLog(`Error stack: ${error.stack}`);
        displayErrorMessage(error);
    }

    debugLog('getPlayerInfo function completed');
}

function displayErrorMessage(error) {
    debugLog('Displaying error message');
    const playerInfoDiv = document.getElementById('playerInfo');
    let errorMessage = 'An error occurred while fetching player data. ';

    if (error.message.includes('HTTP error')) {
        errorMessage += 'The server might be down or experiencing issues. Please try again later.';
    } else if (error.message.includes('NetworkError')) {
        errorMessage += 'There seems to be a problem with your internet connection. Please check your connection and try again.';
    } else if (error.message.includes('SyntaxError')) {
        errorMessage += 'The data received from the server was invalid. This might be a temporary issue. Please try again later.';
    } else {
        errorMessage += 'Please try again later or contact support if the problem persists.';
    }

    playerInfoDiv.innerHTML = `<p class="error">${errorMessage}</p>`;
    debugLog(`Error message displayed: ${errorMessage}`);
}

function displayPlayerInfo(data) {
    debugLog('Displaying player information');
    const playerInfoDiv = document.getElementById('playerInfo');
    playerInfoDiv.innerHTML = `
        <h2>${data.username}</h2>
        <p>Rank: ${data.rank}</p>
        <p>First Join: ${new Date(data.firstJoin).toLocaleString()}</p>
        <p>Last Join: ${new Date(data.lastJoin).toLocaleString()}</p>
        <p>Playtime: ${data.playtime.toFixed(2)} hours</p>
    `;

    if (data.guild) {
        playerInfoDiv.innerHTML += `
            <h3>Guild</h3>
            <p>Name: ${data.guild.name}</p>
            <p>Rank: ${data.guild.rank}</p>
        `;
    }

    if (data.characters) {
        playerInfoDiv.innerHTML += '<h3>Characters</h3>';
        for (const [charId, character] of Object.entries(data.characters)) {
            playerInfoDiv.innerHTML += `
                <div>
                    <h4>${character.type} (Level ${character.level})</h4>
                    <p>Combat Level: ${character.combatLevel}</p>
                    <p>Total Level: ${character.totalLevel}</p>
                </div>
            `;
        }
    }

    debugLog('Player information displayed successfully');
}

function generateCharacterDetails(character) {
    let details = '';
    for (const [key, value] of Object.entries(character)) {
        if (typeof value === 'object') {
            details += `<p><strong>${key}:</strong></p>`;
            details += '<ul>';
            for (const [subKey, subValue] of Object.entries(value)) {
                details += `<li><strong>${subKey}:</strong> ${JSON.stringify(subValue)}</li>`;
            }
            details += '</ul>';
        } else {
            details += `<p><strong>${key}:</strong> ${value}</p>`;
        }
    }
    return details;
}

function toggleCharacter(charId) {
    const charDetails = document.getElementById(charId);
    charDetails.style.display = charDetails.style.display === 'none' ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    debugLog('DOMContentLoaded event fired');
    const playerNameInput = document.getElementById('playerName');
    const searchButton = document.getElementById('searchButton');

    playerNameInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            debugLog('Enter key pressed in player name input');
            getPlayerInfo();
        }
    });

    searchButton.addEventListener('click', function() {
        debugLog('Search button clicked');
        getPlayerInfo();
    });

    debugLog('Event listeners added to player name input and search button');
});