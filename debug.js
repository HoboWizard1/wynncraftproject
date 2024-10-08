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
    <div id="debugContent"></div>
`;
document.body.appendChild(debugBox);

let isExpanded = false;
let isOpen = false;

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
    
    isOpen = !isOpen;
    
    if (isOpen) {
        debugContent.style.display = 'block';
        debugBox.style.height = isExpanded ? '50vh' : '200px';
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
    const expandButton = document.getElementById('expandDebugBox');
    
    isExpanded = !isExpanded;
    
    if (isExpanded) {
        debugBox.style.height = '50vh';
        expandButton.textContent = '⇲';
        if (!isOpen) {
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
    if (!isOpen) {
        toggleDebugBox(); // Open debug console on error
    }
};

// Initialize debug console
debugLog('Debug console initialized');