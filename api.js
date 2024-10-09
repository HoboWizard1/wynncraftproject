const corsProxy = 'https://api.allorigins.win/raw?url=';

async function fetchPlayerInfo(playerName) {
    const apiUrl = `${corsProxy}${encodeURIComponent(`https://api.wynncraft.com/v3/player/${playerName}?fullResult`)}`;
    return fetchData(apiUrl);
}

async function searchItems(query) {
    const apiUrl = `${corsProxy}${encodeURIComponent(`https://api.wynncraft.com/v3/item/search/${query}`)}`;
    return fetchData(apiUrl);
}

async function fetchData(url) {
    debugLog(`Fetching data from: ${url}`);
    try {
        const response = await fetch(url);
        debugLog(`Response status: ${response.status}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        debugLog('API response received');
        return data;
    } catch (error) {
        debugError(`Error fetching data: ${error.message}`);
        throw error;
    }
}