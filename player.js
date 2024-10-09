async function getPlayerInfo() {
    debugLog('getPlayerInfo function called');
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
    return `https://crafatar.com/renders/body/${uuid}?overlay=true`;
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
                <div class="player-skin-container">
                    <img src="${skinUrl}" alt="${data.username}'s skin" class="player-skin">
                </div>
            </div>
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
    let details = `
        <p>Total Level: ${character.level}</p>
        <p>Class: ${character.type}</p>
        <h5>Skills:</h5>
        <ul>
            <li>Strength: ${character.skills.strength}</li>
            <li>Dexterity: ${character.skills.dexterity}</li>
            <li>Intelligence: ${character.skills.intelligence}</li>
            <li>Defense: ${character.skills.defense}</li>
            <li>Agility: ${character.skills.agility}</li>
        </ul>
    `;

    if (character.skillPoints) {
        details += `
            <h5>Skill Points:</h5>
            <p>Available: ${character.skillPoints.available}</p>
            <ul>
                <li>Strength: ${character.skillPoints.strength}</li>
                <li>Dexterity: ${character.skillPoints.dexterity}</li>
                <li>Intelligence: ${character.skillPoints.intelligence}</li>
                <li>Defense: ${character.skillPoints.defense}</li>
                <li>Agility: ${character.skillPoints.agility}</li>
            </ul>
        `;
    }

    if (character.professions) {
        details += '<h5>Professions:</h5><ul>';
        for (const [profession, level] of Object.entries(character.professions)) {
            details += `<li>${profession}: ${level}</li>`;
        }
        details += '</ul>';
    }

    if (character.dungeons) {
        details += '<h5>Dungeons Completed:</h5><ul>';
        for (const [dungeon, count] of Object.entries(character.dungeons)) {
            details += `<li>${dungeon}: ${count}</li>`;
        }
        details += '</ul>';
    }

    if (character.quests) {
        details += `<p>Quests Completed: ${character.quests.completed}/${character.quests.total}</p>`;
    }

    // Add ability tree information if available
    if (character.abilityTree) {
        details += '<h5>Ability Tree:</h5><ul>';
        for (const [ability, points] of Object.entries(character.abilityTree)) {
            details += `<li>${ability}: ${points} points</li>`;
        }
        details += '</ul>';
    }

    return details;
}

function toggleCharacter(charId) {
    const charDetails = document.getElementById(charId);
    if (charDetails) {
        charDetails.style.display = charDetails.style.display === 'none' ? 'block' : 'none';
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
    const playerSearchForm = document.getElementById('playerSearchForm');
    if (playerSearchForm) {
        playerSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            getPlayerInfo();
        });
    }
});