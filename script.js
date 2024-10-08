async function getPlayerInfo() {
    const playerName = document.getElementById('playerName').value;
    const playerInfoDiv = document.getElementById('playerInfo');
    playerInfoDiv.innerHTML = 'Loading...';

    try {
        const response = await fetch(`https://api.wynncraft.com/v3/player/${playerName}?fullResult`);
        const data = await response.json();

        if (response.ok) {
            let infoHTML = `
                <h2>${data.username}</h2>
                <p>Rank: ${data.rank}</p>
                <p>Online: ${data.online ? 'Yes' : 'No'}</p>
                <p>First Join: ${data.firstJoin}</p>
                <p>Last Join: ${data.lastJoin}</p>
                <p>Playtime: ${data.playtime} hours</p>
                <h3>Characters:</h3>
            `;

            for (const [characterUuid, character] of Object.entries(data.characters)) {
                infoHTML += `
                    <div>
                        <h4>${character.nickname} (${character.type})</h4>
                        <p>Level: ${character.level}</p>
                        <p>Total Level: ${character.totalLevel}</p>
                    </div>
                `;
            }

            playerInfoDiv.innerHTML = infoHTML;
        } else {
            playerInfoDiv.innerHTML = `Error: ${data.message || 'Unable to fetch player data'}`;
        }
    } catch (error) {
        playerInfoDiv.innerHTML = `Error: ${error.message}`;
    }
}