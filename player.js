async function getPlayerInfo() {
    const playerName = document.getElementById('playerName').value;
    const playerInfoDiv = document.getElementById('playerInfo');
    playerInfoDiv.innerHTML = 'Loading...';

    try {
        const data = await fetchPlayerInfo(playerName);
        if (data.username) {
            displayPlayerInfo(data);
        } else {
            throw new Error('Player not found');
        }
    } catch (error) {
        displayErrorMessage(error, 'player');
    }
}

function displayPlayerInfo(data) {
    // ... (keep the existing displayPlayerInfo function)
}

function generateGlobalData(data) {
    // ... (keep the existing generateGlobalData function)
}

function generateCharacterDetails(character) {
    // ... (keep the existing generateCharacterDetails function)
}

function toggleCharacter(charId) {
    // ... (keep the existing toggleCharacter function)
}