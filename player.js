async function getPlayerInfo() {
    const playerName = document.getElementById('playerName').value;
    const playerInfoDiv = document.getElementById('playerInfo');
    playerInfoDiv.innerHTML = 'Loading...';

    console.log(`Attempting to fetch data for player: ${playerName}`);

    try {
        // Using the correct API endpoint for full player info
        const apiUrl = `https://api.wynncraft.com/v3/player/${playerName}?fullResult`;
        console.log(`API URL: ${apiUrl}`);

        const response = await fetch(apiUrl);
        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API response:', data);

        if (data.username) {
            let infoHTML = `
                <h2>${data.username}</h2>
                <p>Rank: ${data.rank}</p>
                <p>Online: ${data.online ? 'Yes' : 'No'}</p>
                <p>First Join: ${new Date(data.firstJoin).toLocaleString()}</p>
                <p>Last Join: ${new Date(data.lastJoin).toLocaleString()}</p>
                <p>Playtime: ${Math.round(data.playtime / 60)} hours</p>
                <h3>Characters:</h3>
            `;

            for (const [characterUuid, character] of Object.entries(data.characters)) {
                infoHTML += `
                    <div>
                        <h4>${character.nickname || character.type} (${character.type})</h4>
                        <p>Level: ${character.level}</p>
                        <p>Total Level: ${character.totalLevel}</p>
                        <p>Combat Level: ${character.combatLevel.total}</p>
                    </div>
                `;
            }

            // Add guild information if available
            if (data.guild && data.guild.name) {
                infoHTML += `
                    <h3>Guild:</h3>
                    <p>Name: ${data.guild.name}</p>
                    <p>Rank: ${data.guild.rank}</p>
                `;
            }

            playerInfoDiv.innerHTML = infoHTML;
        } else {
            playerInfoDiv.innerHTML = `Error: Player not found or API returned unexpected data`;
            console.error('Unexpected API response:', data);
        }
    } catch (error) {
        console.error('Error details:', error);
        playerInfoDiv.innerHTML = `Error: ${error.message}. Check the console for more details.`;
    }
}