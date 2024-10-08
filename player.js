document.getElementById('playerName').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        getPlayerInfo();
    }
});

async function getPlayerInfo() {
    const playerName = document.getElementById('playerName').value;
    const playerInfoDiv = document.getElementById('playerInfo');
    playerInfoDiv.innerHTML = 'Loading...';

    try {
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        const apiUrl = `${corsProxy}${encodeURIComponent(`https://api.wynncraft.com/v3/player/${playerName}?fullResult`)}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.username) {
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
        } else {
            playerInfoDiv.innerHTML = 'Player not found';
        }
    } catch (error) {
        console.error('Error:', error);
        playerInfoDiv.innerHTML = 'Error fetching player data';
        debugLog(`Error: ${error.message}`);
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