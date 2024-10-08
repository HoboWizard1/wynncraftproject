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
            <button id="expandDebugBox">⇱</button>
        </div>
    </div>
    <div id="debugContent" style="display: none;"></div>
`;
document.body.appendChild(debugBox);

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
    
    if (debugContent.style.display === 'none') {
        debugContent.style.display = 'block';
        debugBox.style.height = debugBox.style.height === '50vh' ? '50vh' : '200px';
        toggleButton.textContent = '▼';
    } else {
        debugContent.style.display = 'none';
        debugBox.style.height = 'auto';
        toggleButton.textContent = '▲';
    }
}

// Expand debug box
function expandDebugBox() {
    const debugBox = document.getElementById('debugBox');
    const debugContent = document.getElementById('debugContent');
    const expandButton = document.getElementById('expandDebugBox');
    
    if (debugBox.style.height !== '50vh') {
        debugBox.style.height = '50vh';
        expandButton.textContent = '⇲';
        if (debugContent.style.display === 'none') {
            toggleDebugBox();
        }
    } else {
        debugBox.style.height = '200px';
        expandButton.textContent = '⇱';
    }
}

// Add event listeners for toggle and expand buttons
document.getElementById('toggleDebugBox').addEventListener('click', toggleDebugBox);
document.getElementById('expandDebugBox').addEventListener('click', expandDebugBox);

// Override console.error to use debugLog
console.error = (message) => {
    debugLog(`ERROR: ${message}`);
    toggleDebugBox(); // Open debug console on error
};

// Don't log anything on initialization