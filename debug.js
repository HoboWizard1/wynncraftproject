// Debug console setup
let debugBox;
let debugContent;
let debugBoxHeight = 200; // Default height
let consoleState = 1; // 0: closed, 1: normal, 2: expanded

function initializeDebug() {
    debugBox = document.getElementById('debugBox');
    if (!debugBox) {
        debugBox = document.createElement('div');
        debugBox.id = 'debugBox';
        document.body.appendChild(debugBox);
    }

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
        <pre id="debugContent"></pre>
    `;

    debugContent = document.getElementById('debugContent');
    updateDebugBoxState();

    document.getElementById('debugBoxUp').addEventListener('click', moveDebugBoxUp);
    document.getElementById('debugBoxDown').addEventListener('click', moveDebugBoxDown);

    window.addEventListener('resize', updateDebugBoxState);
}

function updateDebugBoxState() {
    const debugHeader = document.getElementById('debugHeader');
    
    switch(consoleState) {
        case 0: // Closed
            debugContent.style.display = 'none';
            debugBox.style.height = 'auto';
            break;
        case 1: // Normal
            debugContent.style.display = 'block';
            debugBox.style.height = `${debugBoxHeight}px`;
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

function moveDebugBoxUp() {
    if (consoleState < 2) {
        consoleState++;
        updateDebugBoxState();
    }
}

function moveDebugBoxDown() {
    if (consoleState > 0) {
        consoleState--;
        updateDebugBoxState();
    }
}

function clearDebugBox() {
    if (debugContent) {
        debugContent.innerHTML = '';
        debugLog('Debug console cleared');
    }
}

function copyDebugInfo() {
    if (debugContent) {
        navigator.clipboard.writeText(debugContent.textContent)
            .then(() => debugLog('Debug information copied to clipboard'))
            .catch(err => debugError('Failed to copy debug info: ' + err));
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

function debugError(message) {
    if (debugContent) {
        const errorEntry = document.createElement('div');
        errorEntry.textContent = `[${new Date().toLocaleTimeString()}] ERROR: ${message}`;
        errorEntry.style.color = 'red';
        debugContent.appendChild(errorEntry);
        debugContent.scrollTop = debugContent.scrollHeight;
    }
}

// Override console.error to use debugLog
console.error = (message) => {
    debugError(message);
};

document.addEventListener('DOMContentLoaded', initializeDebug);