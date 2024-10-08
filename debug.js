// Debug console setup
const debugBox = document.createElement('div');
debugBox.id = 'debugBox';
debugBox.innerHTML = `
    <div id="debugHeader">
        <h3>Debug Console</h3>
        <button onclick="clearDebugBox()">Clear</button>
        <button onclick="copyDebugInfo()">Copy</button>
    </div>
    <div id="debugContent"></div>
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

// Override console.log and console.error to use debugLog
console.log = debugLog;
console.error = (message) => debugLog(`ERROR: ${message}`);

// Initialize debug console
debugLog('Debug console initialized');