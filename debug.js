// Debug console setup
const debugBox = document.createElement('div');
debugBox.id = 'debugBox';
debugBox.innerHTML = `
    <div id="debugHeader">
        <h3>Debug Console</h3>
        <div class="debugButtons">
            <button onclick="clearDebugBox()">Clear</button>
            <button onclick="copyDebugInfo()">Copy</button>
            <button id="debugBoxUp">▲</button>
            <button id="debugBoxDown">▼</button>
        </div>
    </div>
    <pre id="debugContent" style="display: none;"></pre>
`;
document.body.appendChild(debugBox);

let consoleState = 0; // 0: closed, 1: normal, 2: expanded

// Debug logging function
function debugLog(message) {
    const debugContent = document.getElementById('debugContent');
    const timestamp = new Date().toLocaleTimeString();
    const formattedMessage = `[${timestamp}] ${message}\n`;
    debugContent.textContent += formattedMessage;
    debugContent.scrollTop = debugContent.scrollHeight;
}

// Clear debug box
function clearDebugBox() {
    document.getElementById('debugContent').textContent = '';
    debugLog('Debug console cleared');
}

// Copy debug info
function copyDebugInfo() {
    const debugContent = document.getElementById('debugContent');
    const textArea = document.createElement('textarea');
    textArea.value = debugContent.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    debugLog('Debug information copied to clipboard');
}

// Move debug box up
function moveDebugBoxUp() {
    if (consoleState < 2) {
        consoleState++;
        updateDebugBoxState();
    }
}

// Move debug box down
function moveDebugBoxDown() {
    if (consoleState > 0) {
        consoleState--;
        updateDebugBoxState();
    }
}

// Update debug box state
function updateDebugBoxState() {
    const debugBox = document.getElementById('debugBox');
    const debugContent = document.getElementById('debugContent');
    
    switch(consoleState) {
        case 0: // Closed
            debugContent.style.display = 'none';
            debugBox.style.height = 'auto';
            break;
        case 1: // Normal
            debugContent.style.display = 'block';
            debugBox.style.height = '200px';
            break;
        case 2: // Expanded
            debugContent.style.display = 'block';
            debugBox.style.height = '50vh';
            break;
    }
}

// Add event listeners for up and down buttons
document.getElementById('debugBoxUp').addEventListener('click', moveDebugBoxUp);
document.getElementById('debugBoxDown').addEventListener('click', moveDebugBoxDown);

// Override console.error to use debugLog
console.error = (message) => {
    debugLog(`ERROR: ${message}`);
};

// Initialize debug console
debugLog('Debug console initialized');