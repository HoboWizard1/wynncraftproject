async function getPlayerInfo() {
    const playerName = document.getElementById('playerName').value;
    const playerInfoDiv = document.getElementById('playerInfo');
    playerInfoDiv.innerHTML = 'Loading...';

    debugLog(`Attempting to fetch data for player: ${playerName}`);

    try {
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        const apiUrl = `${corsProxy}${encodeURIComponent(`https://api.wynncraft.com/v3/player/${playerName}?fullResult`)}`;
        
        debugLog(`API URL: ${apiUrl}`);

        const response = await fetch(apiUrl);
        debugLog(`Response status: ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        debugLog('API response received');
        debugLog('Full API Response:');
        debugLog(JSON.stringify(data, null, 2));

        if (data.username) {
            displayPlayerInfo(data);
        } else {
            throw new Error('Player not found');
        }
    } catch (error) {
        console.error('Error:', error);
        displayErrorMessage(error);
    }
}

function displayPlayerInfo(data) {
    debugLog('Displaying player information');
    const playerInfoDiv = document.getElementById('playerInfo');
    try {
        const onlineStatus = data.online ? 
            '<span style="color: lightgreen;">Online</span>' : 
            '<span style="color: lightcoral;">Offline</span>';
        const server = data.server || 'N/A';

        playerInfoDiv.innerHTML = `
            <h2>${data.username}</h2>
            <p>Rank: ${data.supportRank || data.rank}</p>
            <p>Supporter Rank: ${data.supportRank || 'None'}</p>
            <p>First Join: ${new Date(data.firstJoin).toLocaleString()}</p>
            <p>Last Join: ${new Date(data.lastJoin).toLocaleString()}</p>
            <p>Playtime: ${data.playtime.toFixed(2)} hours</p>
            <p>Status: ${onlineStatus} (Server: ${server})</p>
        `;

        if (data.guild) {
            playerInfoDiv.innerHTML += `
                <h3>Guild</h3>
                <p>Name: ${data.guild.name}</p>
                <p>Rank: ${data.guild.rank}</p>
            `;
        }

        playerInfoDiv.innerHTML += '<h3>Global Data</h3>';
        playerInfoDiv.innerHTML += generateGlobalData(data);

        if (data.characters) {
            playerInfoDiv.innerHTML += '<h3>Characters</h3>';
            for (const [charId, character] of Object.entries(data.characters)) {
                playerInfoDiv.innerHTML += `
                    <div class="character">
                        <h4 onclick="toggleCharacter('${charId}')">${character.type} (Level ${character.level})</h4>
                        <div id="${charId}" class="characterDetails" style="display: none;">
                            ${generateCharacterDetails(character)}
                        </div>
                    </div>
                `;
            }
        }

        debugLog('Player information displayed successfully');
    } catch (error) {
        console.error('Error in displayPlayerInfo:', error);
        debugLog(`Error in displayPlayerInfo: ${error.message}`);
        playerInfoDiv.innerHTML = `<p class="error">An error occurred while displaying player information. Please try again later.</p>`;
    }
}

function generateGlobalData(data) {
    let globalData = '';
    for (const [key, value] of Object.entries(data)) {
        if (typeof value !== 'object' && key !== 'username' && key !== 'rank' && key !== 'supportRank' && key !== 'firstJoin' && key !== 'lastJoin' && key !== 'playtime' && key !== 'online' && key !== 'server') {
            globalData += `<p><strong>${key}:</strong> ${value}</p>`;
        }
    }
    return globalData;
}

function generateCharacterDetails(character) {
    try {
        let details = '';
        for (const [key, value] of Object.entries(character)) {
            if (typeof value === 'object' && value !== null) {
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
    } catch (error) {
        console.error('Error in generateCharacterDetails:', error);
        debugLog(`Error in generateCharacterDetails: ${error.message}`);
        return '<p class="error">Error generating character details</p>';
    }
}

function toggleCharacter(charId) {
    const charDetails = document.getElementById(charId);
    if (charDetails) {
        charDetails.style.display = charDetails.style.display === 'none' ? 'block' : 'none';
    } else {
        console.error(`Character details element not found for ID: ${charId}`);
        debugLog(`Error: Character details element not found for ID: ${charId}`);
    }
}

function displayErrorMessage(error) {
    debugLog('Displaying error message');
    const playerInfoDiv = document.getElementById('playerInfo');
    let errorMessage = 'An error occurred while fetching player data. ';

    if (error.message.includes('Player not found')) {
        errorMessage += 'Player not found. Please check the spelling and try again.';
    } else if (error.message.includes('HTTP error')) {
        errorMessage += 'The server might be down or experiencing issues. Please try again later.';
    } else if (error.message.includes('NetworkError')) {
        errorMessage += 'There seems to be a problem with your internet connection. Please check your connection and try again.';
    } else if (error.message.includes('SyntaxError')) {
        errorMessage += 'The data received from the server was invalid. This might be a temporary issue. Please try again later.';
    } else {
        errorMessage += 'Please try again later or contact support if the problem persists.';
    }

    errorMessage += ' Check the debug console for more information.';

    playerInfoDiv.innerHTML = `<p class="error">${errorMessage}</p>`;
    debugLog(`Error message displayed: ${errorMessage}`);
    debugLog(`Error details: ${error.stack}`);
}

function debugLog(message) {
    const debugContent = document.getElementById('debugContent');
    const timestamp = new Date().toLocaleTimeString();
    debugContent.innerHTML += `[${timestamp}] ${message}\n`;
    debugContent.scrollTop = debugContent.scrollHeight;
    
    // Ensure the console is visible when logging
    if (consoleState === 0) {
        moveDebugBoxUp();
    }
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