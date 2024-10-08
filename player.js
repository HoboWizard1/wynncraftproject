async function getPlayerInfo() {
    const playerName = document.getElementById('playerName').value;
    const playerInfoDiv = document.getElementById('playerInfo');
    const globalInfoDiv = document.getElementById('globalInfo');
    const charactersDiv = document.getElementById('characters');
    playerInfoDiv.innerHTML = 'Loading...';

    try {
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        const apiUrl = `${corsProxy}${encodeURIComponent(`https://api.wynncraft.com/v3/player/${playerName}?fullResult`)}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.username) {
            playerInfoDiv.innerHTML = '';
            document.getElementById('playerName').textContent = data.username;

            // Display global player information
            globalInfoDiv.innerHTML = `
                <h3>Global Information</h3>
                <p>Rank: ${data.rank}</p>
                <p>First Join: ${new Date(data.firstJoin).toLocaleString()}</p>
                <p>Last Join: ${new Date(data.lastJoin).toLocaleString()}</p>
                <p>Playtime: ${data.playtime.toFixed(2)} hours</p>
                <!-- Add more global information here -->
            `;

            // Display character information
            charactersDiv.innerHTML = '<h3>Characters</h3>';
            for (const [charId, character] of Object.entries(data.characters)) {
                const charDiv = document.createElement('div');
                charDiv.className = 'character';
                charDiv.innerHTML = `
                    <h4 onclick="toggleCharacter('${charId}')">${character.type} (Level ${character.level})</h4>
                    <div id="${charId}" class="characterDetails" style="display: none;">
                        <p>Nickname: ${character.nickname || 'None'}</p>
                        <p>XP: ${character.xp} (${character.xpPercent}%)</p>
                        <p>Total Level: ${character.totalLevel}</p>
                        <p>Playtime: ${character.playtime.toFixed(2)} hours</p>
                        <!-- Add more character details here -->
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