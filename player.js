async function getPlayerInfo() {
    const playerName = document.getElementById('playerName').value;
    const playerInfoDiv = document.getElementById('playerInfo');
    playerInfoDiv.innerHTML = 'Loading...';

    debugLog(`Fetching player info for: ${playerName}`);

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

        if (data.username) {
            displayPlayerInfo(data);
        } else {
            playerInfoDiv.innerHTML = `<p class="error">Player "${playerName}" not found. Please check the spelling and try again.</p>`;
            debugLog(`Player "${playerName}" not found`);
        }
    } catch (error) {
        console.error('Error:', error);
        displayErrorMessage(error);
    }
}

function displayErrorMessage(error) {
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
}

function displayPlayerInfo(data) {
    const playerInfoDiv = document.getElementById('playerInfo');
    playerInfoDiv.innerHTML = `
        <h2 id="playerNameDisplay">${data.username}</h2>
        <div id="globalInfo"></div>
        <div id="characters"></div>
    `;

    const globalInfoDiv = document.getElementById('globalInfo');
    const charactersDiv = document.getElementById('characters');

    // Display global player information
    globalInfoDiv.innerHTML = '<h3>Global Information</h3>';
    for (const [key, value] of Object.entries(data)) {
        if (typeof value !== 'object') {
            globalInfoDiv.innerHTML += `<p><strong>${key}:</strong> ${value}</p>`;
        }
    }

    // Display character information
    charactersDiv.innerHTML = '<h3>Characters</h3>';
    for (const [charId, character] of Object.entries(data.characters)) {
        const charDiv = document.createElement('div');
        charDiv.className = 'character';
        charDiv.innerHTML = `
            <h4 onclick="toggleCharacter('${charId}')">${character.type} (Level ${character.level})</h4>
            <div id="${charId}" class="characterDetails">
                ${generateCharacterDetails(character)}
            </div>
        `;
        charactersDiv.appendChild(charDiv);
    }
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
    const playerNameInput = document.getElementById('playerName');
    const searchButton = document.getElementById('searchButton');

    playerNameInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            getPlayerInfo();
        }
    });

    searchButton.addEventListener('click', getPlayerInfo);
});