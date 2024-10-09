async function getPlayerInfo() {
    const playerName = document.getElementById('playerName').value;
    const playerInfoDiv = document.getElementById('playerInfo');
    playerInfoDiv.innerHTML = 'Loading...';

    debugLog(`Fetching player info for: ${playerName}`);

    try {
        const data = await fetchPlayerInfo(playerName);
        debugLog(`Received data for player: ${playerName}`);
        debugLog(`Raw player data: ${JSON.stringify(data, null, 2)}`);

        if (data && data.data && data.data.length > 0) {
            debugLog(`Player ${playerName} found. Displaying info.`);
            displayPlayerInfo(data.data[0]);
        } else {
            debugLog(`Player ${playerName} not found or data structure unexpected.`);
            throw new Error('Player not found or unexpected data structure');
        }
    } catch (error) {
        debugError(`Error in getPlayerInfo: ${error.message}`);
        displayErrorMessage(error, 'player');
    }
}

function displayPlayerInfo(playerData) {
    debugLog('Entering displayPlayerInfo function');
    debugLog(`Player data: ${JSON.stringify(playerData, null, 2)}`);
    
    const playerInfoDiv = document.getElementById('playerInfo');
    let html = `<h2>${playerData.username}</h2>`;

    debugLog('Generating global data');
    html += generateGlobalData(playerData);

    debugLog('Processing character data');
    if (playerData.characters && Object.keys(playerData.characters).length > 0) {
        html += '<h3>Characters</h3>';
        for (const [charId, character] of Object.entries(playerData.characters)) {
            debugLog(`Processing character: ${charId}`);
            html += `
                <div class="character">
                    <h4 onclick="toggleCharacter('${charId}')">${character.type} (Level ${character.level})</h4>
                    <div id="${charId}" class="characterDetails" style="display: none;">
                        ${generateCharacterDetails(character)}
                    </div>
                </div>
            `;
        }
    } else {
        debugLog('No character data found');
        html += '<p>No character data available.</p>';
    }

    playerInfoDiv.innerHTML = html;
    debugLog('Player info HTML generated');
    debugLog(`Final HTML: ${html}`);
    debugLog('Player info displayed successfully');
}

function generateGlobalData(playerData) {
    debugLog('Entering generateGlobalData function');
    let globalData = '';
    
    if (playerData.globalData) {
        debugLog('Processing global data');
        globalData += `
            <p><strong>Total Level:</strong> ${playerData.globalData.totalLevel || 'N/A'}</p>
            <p><strong>Wars:</strong> ${playerData.globalData.wars || 'N/A'}</p>
            <p><strong>Killed Mobs:</strong> ${playerData.globalData.killedMobs || 'N/A'}</p>
            <p><strong>Chests Found:</strong> ${playerData.globalData.chestsFound || 'N/A'}</p>
            <p><strong>Completed Quests:</strong> ${playerData.globalData.completedQuests || 'N/A'}</p>
        `;

        if (playerData.globalData.dungeons) {
            debugLog('Processing dungeon data');
            globalData += `<p><strong>Total Dungeons:</strong> ${playerData.globalData.dungeons.total || 'N/A'}</p>`;
            if (playerData.globalData.dungeons.list) {
                globalData += '<p><strong>Dungeon List:</strong></p><ul>';
                for (const [dungeon, count] of Object.entries(playerData.globalData.dungeons.list)) {
                    globalData += `<li>${dungeon}: ${count}</li>`;
                }
                globalData += '</ul>';
            }
        } else {
            debugLog('No dungeon data found');
        }

        if (data.globalData.raids) {
            debugLog('Processing raid data');
            globalData += `<p><strong>Total Raids:</strong> ${data.globalData.raids.total}</p>`;
            globalData += '<p><strong>Raid List:</strong></p><ul>';
            for (const [raid, count] of Object.entries(data.globalData.raids.list)) {
                globalData += `<li>${raid}: ${count}</li>`;
            }
            globalData += '</ul>';
        } else {
            debugLog('No raid data found');
        }

        if (data.globalData.pvp) {
            debugLog('Processing PvP data');
            globalData += `
                <p><strong>PvP Kills:</strong> ${data.globalData.pvp.kills}</p>
                <p><strong>PvP Deaths:</strong> ${data.globalData.pvp.deaths}</p>
            `;
        } else {
            debugLog('No PvP data found');
        }
    } else {
        debugLog('No global data found');
    }

    if (data.forumLink) {
        debugLog('Adding forum link');
        globalData += `<p><strong>Forum Link:</strong> <a href="https://forums.wynncraft.com/members/${data.forumLink}" target="_blank">View Forum Profile</a></p>`;
    }

    if (data.ranking) {
        debugLog('Processing ranking data');
        globalData += '<p><strong>Current Rankings:</strong></p><ul>';
        for (const [stat, rank] of Object.entries(data.ranking)) {
            globalData += `<li>${formatRankingName(stat)}: ${rank}</li>`;
        }
        globalData += '</ul>';
    } else {
        debugLog('No ranking data found');
    }

    debugLog('Global data generation complete');
    debugLog(`Generated global data: ${globalData}`);
    return globalData;
}