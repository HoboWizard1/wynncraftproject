// Debug console setup
const debugBox = document.createElement('div');
debugBox.id = 'debugBox';
debugBox.innerHTML = `
    <div id="debugHeader">
        <h3>Debug Console</h3>
        <button onclick="clearDebugBox()">Clear</button>
        <button onclick="copyDebugInfo()">Copy</button>
        <button id="toggleDebugBox">▲</button>
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
        debugBox.style.height = '200px';
        toggleButton.textContent = '▼';
    } else {
        debugContent.style.display = 'none';
        debugBox.style.height = 'auto';
        toggleButton.textContent = '▲';
    }
}

// Add event listener for toggle button
document.getElementById('toggleDebugBox').addEventListener('click', toggleDebugBox);

// Override console.error to use debugLog
console.error = (message) => {
    debugLog(`ERROR: ${message}`);
    toggleDebugBox(); // Open debug console on error
};

// Don't log anything on initialization