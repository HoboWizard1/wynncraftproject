const debugConsole = document.createElement('div');
debugConsole.id = 'debugConsole';
debugConsole.innerHTML = '<h3>Debug Console</h3><div id="debugOutput"></div>';
document.body.appendChild(debugConsole);

function debugLog(message) {
    const debugOutput = document.getElementById('debugOutput');
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.textContent = `[${timestamp}] ${message}`;
    debugOutput.appendChild(logEntry);
    debugOutput.scrollTop = debugOutput.scrollHeight;
}

console.log = debugLog;
console.error = (message) => debugLog(`ERROR: ${message}`);

debugLog('Debug console initialized');

window.clearDebugConsole = function() {
    const debugOutput = document.getElementById('debugOutput');
    debugOutput.innerHTML = '';
    debugLog('Debug console cleared');
};

const clearButton = document.createElement('button');
clearButton.textContent = 'Clear Console';
clearButton.onclick = window.clearDebugConsole;
clearButton.style.marginTop = '10px';
debugConsole.insertBefore(clearButton, debugConsole.firstChild);
