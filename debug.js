// Debug console setup
const debugBox = document.createElement('div');
debugBox.id = 'debugBox';
debugBox.innerHTML = `
    <div id="debugHeader">
        <h3>Debug Console</h3>
        <div class="debugButtons">
            <button onclick="clearDebugBox()">Clear</button>
            <button onclick="copyDebugInfo()">Copy</button>
            <button id="toggleDebugBox">▲</button>
        </div>
    </div>
    <div id="debugContent"></div>
`;
document.body.appendChild(debugBox);

let consoleState = 0; // 0: closed, 1: normal, 2: expanded

// Debug logging function
function debugLog(message) {
    const debugContent = document.getElementById('debugContent');
    const timestamp = new Date().toLocaleTimeString();
    debugContent.innerHTML += `[${timestamp}] ${message}\n`;
    debugContent.scrollTop = debugContent.scrollHeight;
}

// Clear debug box
function clearDebugBox() {
    document.getElementById('debugContent').innerHTML = '';
    debugLog('Debug console cleared');
}

// Copy debug info
function copyDebugInfo() {
    const debugContent = document.getElementById('debugContent');
    const textArea = document.createElement('textarea');
    textArea.value = debugContent.innerText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    debugLog('Debug information copied to clipboard');
}

// Toggle debug box
function toggleDebugBox() {
    const debugBox = document.getElementById('debugBox');
    const debugContent = document.getElementById('debugContent');
    const toggleButton = document.getElementById('toggleDebugBox');
    
    consoleState = (consoleState + 1) % 3;
    
    switch(consoleState) {
        case 0: // Closed
            debugContent.style.display = 'none';
            debugBox.style.height = 'auto';
            toggleButton.textContent = '▲';
            break;
        case 1: // Normal
            debugContent.style.display = 'block';
            debugBox.style.height = '200px';
            toggleButton.textContent = '▲';
            break;
        case 2: // Expanded
            debugContent.style.display = 'block';
            debugBox.style.height = '50vh';
            toggleButton.textContent = '▼';
            break;
    }
}

// Add event listener for toggle button
document.getElementById('toggleDebugBox').addEventListener('click', toggleDebugBox);

// Override console.error to use debugLog
console.error = (message) => {
    debugLog(`ERROR: ${message}`);
    if (consoleState === 0) {
        toggleDebugBox(); // Open debug console on error
    }
};

// Initialize debug console
debugLog('Debug console initialized');