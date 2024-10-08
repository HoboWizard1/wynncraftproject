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
        debugLog(`API Data: ${JSON.stringify(data, null, 2)}`);

        if (data.username) {
            displayPlayerInfo(data);
        } else {
            playerInfoDiv.innerHTML = `<p class="error">Player "${playerName}" not found. Please check the spelling and try again.</p>`;
            debugLog(`Player "${playerName}" not found`);
        }
    } catch (error) {
        console.error('Error:', error);
        playerInfoDiv.innerHTML = `<p class="error">An error occurred while fetching player data. Please try again later.</p>`;
    }
}

function displayPlayerInfo(data) {
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
                <div class="character">
                    <h4 onclick="toggleCharacter('${charId}')">${character.type} (Level ${character.level})</h4>
                    <div id="${charId}" class="characterDetails" style="display: none;">
                        ${generateCharacterDetails(character)}
                    </div>
                </div>
            `;
        }
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