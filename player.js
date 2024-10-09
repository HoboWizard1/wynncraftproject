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
        displayErrorMessage(error, playerName);
    }
}

function getPlayerSkin(uuid) {
    return `https://crafatar.com/skins/${uuid}`;
}

async function displayPlayerInfo(data) {
    debugLog('Displaying player information');
    const playerInfoDiv = document.getElementById('playerInfo');
    try {
        const onlineStatus = data.online ? 
            '<span style="color: lightgreen;">Online</span>' : 
            '<span style="color: lightcoral;">Offline</span>';
        const server = data.server || 'N/A';

        const skinUrl = getPlayerSkin(data.uuid);

        playerInfoDiv.innerHTML = `
            <div class="player-header">
                <div class="player-info">
                    <h2>${data.username}</h2>
                    <p>Rank: ${data.rank}</p>
                    ${data.supportRank ? `<p>Supporter Rank: ${data.supportRank}</p>` : ''}
                    <p>First Join: ${new Date(data.firstJoin).toLocaleString()}</p>
                    <p>Last Join: ${new Date(data.lastJoin).toLocaleString()}</p>
                    <p>Playtime: ${data.playtime.toFixed(2)} hours</p>
                    <p>Status: ${onlineStatus} (Server: ${server})</p>
                </div>
                <div id="skinViewer" class="player-skin-container"></div>
            </div>
        `;

        new SkinViewer(document.getElementById('skinViewer'), skinUrl);

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
    
    if (data.globalData) {
        globalData += `
            <p><strong>Total Level:</strong> ${data.globalData.totalLevel}</p>
            <p><strong>Wars:</strong> ${data.globalData.wars}</p>
            <p><strong>Killed Mobs:</strong> ${data.globalData.killedMobs}</p>
            <p><strong>Chests Found:</strong> ${data.globalData.chestsFound}</p>
            <p><strong>Completed Quests:</strong> ${data.globalData.completedQuests}</p>
        `;

        if (data.globalData.dungeons) {
            globalData += `<p><strong>Total Dungeons:</strong> ${data.globalData.dungeons.total}</p>`;
            globalData += '<p><strong>Dungeon List:</strong></p><ul>';
            for (const [dungeon, count] of Object.entries(data.globalData.dungeons.list)) {
                globalData += `<li>${dungeon}: ${count}</li>`;
            }
            globalData += '</ul>';
        }

        if (data.globalData.raids) {
            globalData += `<p><strong>Total Raids:</strong> ${data.globalData.raids.total}</p>`;
            globalData += '<p><strong>Raid List:</strong></p><ul>';
            for (const [raid, count] of Object.entries(data.globalData.raids.list)) {
                globalData += `<li>${raid}: ${count}</li>`;
            }
            globalData += '</ul>';
        }

        if (data.globalData.pvp) {
            globalData += `
                <p><strong>PvP Kills:</strong> ${data.globalData.pvp.kills}</p>
                <p><strong>PvP Deaths:</strong> ${data.globalData.pvp.deaths}</p>
            `;
        }
    }

    if (data.forumLink) {
        globalData += `<p><strong>Forum Link:</strong> <a href="https://forums.wynncraft.com/members/${data.forumLink}" target="_blank">View Forum Profile</a></p>`;
    }

    if (data.ranking) {
        globalData += '<p><strong>Current Rankings:</strong></p><ul>';
        for (const [stat, rank] of Object.entries(data.ranking)) {
            globalData += `<li>${formatRankingName(stat)}: ${rank}</li>`;
        }
        globalData += '</ul>';
    }

    if (data.previousRanking) {
        globalData += '<p><strong>Previous Rankings:</strong></p><ul>';
        for (const [stat, rank] of Object.entries(data.previousRanking)) {
            globalData += `<li>${formatRankingName(stat)}: ${rank}</li>`;
        }
        globalData += '</ul>';
    }

    return globalData;
}

function formatRankingName(name) {
    return name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/Sr/g, 'SR')
        .replace(/Tcc/g, 'TCC')
        .replace(/Tna/g, 'TNA')
        .replace(/Nol/g, 'NOL')
        .replace(/Nog/g, 'NOG');
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

function displayErrorMessage(error, playerName) {
    debugLog('Displaying error message');
    const playerInfoDiv = document.getElementById('playerInfo');
    let errorMessage = '';

    if (error.message.includes('Player not found')) {
        errorMessage = `Couldn't find user "${playerName}". Please check the spelling or check the debug console if you think this is an error.`;
    } else if (error.message.includes('HTTP error')) {
        errorMessage = 'The server might be down or experiencing issues. Please try again later or check the debug console for more information.';
    } else if (error.message.includes('NetworkError')) {
        errorMessage = 'There seems to be a problem with your internet connection. Please check your connection and try again.';
    } else if (error.message.includes('SyntaxError')) {
        errorMessage = 'The data received from the server was invalid. This might be a temporary issue. Please try again later or check the debug console for more information.';
    } else {
        errorMessage = 'An unexpected error occurred. Please try again later or check the debug console for more information.';
    }

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