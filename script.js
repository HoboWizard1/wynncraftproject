function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function debugLog(message) {
    const debugConsole = document.getElementById('debugConsole');
    const timestamp = new Date().toLocaleTimeString();
    debugConsole.innerHTML += `[${timestamp}] ${message}\n`;
    debugConsole.scrollTop = debugConsole.scrollHeight;
}

function clearDebugConsole() {
    document.getElementById('debugConsole').innerHTML = '';
    debugLog('Debug console cleared');
}

function copyDebugToClipboard() {
    const debugConsole = document.getElementById('debugConsole');
    const textArea = document.createElement('textarea');
    textArea.value = debugConsole.innerText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    debugLog('Debug log copied to clipboard');
}

// Override console.log and console.error to use debugLog
console.log = debugLog;
console.error = (message) => debugLog(`ERROR: ${message}`);

// Initialize debug console
debugLog('Debug console initialized');

debugLog('script.js loaded');