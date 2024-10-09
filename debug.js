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
    if (debugContent) {
        const logEntry = document.createElement('div');
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        debugContent.appendChild(logEntry);
        debugContent.scrollTop = debugContent.scrollHeight;
    }
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
    const debugHeader = document.getElementById('debugHeader');
    
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
    
    // Ensure content doesn't overflow
    const maxHeight = window.innerHeight - debugHeader.offsetHeight;
    debugBox.style.maxHeight = `${maxHeight}px`;
    debugContent.style.maxHeight = `${maxHeight - debugHeader.offsetHeight}px`;
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

// Add this event listener
window.addEventListener('resize', updateDebugBoxState);

console.log('Debug.js loaded');

let debugBox;
let debugContent;
let isDebugVisible = true;

function initializeDebug() {
    debugBox = document.getElementById('debugBox');
    debugContent = document.getElementById('debugContent');
    const debugHeader = document.getElementById('debugHeader');

    if (debugHeader) {
        debugHeader.addEventListener('click', toggleDebugVisibility);
    }

    // Ensure debug content is visible on initialization
    if (debugContent) {
        debugContent.style.display = 'block';
    }

    // Force correct positioning
    if (debugBox) {
        debugBox.style.position = 'fixed';
        debugBox.style.bottom = '0';
        debugBox.style.left = '0';
        debugBox.style.right = '0';
        debugBox.style.top = 'auto';  // Ensure it's not being pushed to the top
    }
}

function toggleDebugVisibility() {
    isDebugVisible = !isDebugVisible;
    if (debugContent) {
        debugContent.style.display = isDebugVisible ? 'block' : 'none';
    }
}

function debugLog(message) {
    if (debugContent) {
        const logEntry = document.createElement('div');
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        debugContent.appendChild(logEntry);
        debugContent.scrollTop = debugContent.scrollHeight;
    }
}

document.addEventListener('DOMContentLoaded', initializeDebug);