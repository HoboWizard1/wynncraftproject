const { exec } = require('child_process');
const fs = require('fs');

const commands = [
    'git add .',
    'git commit -m "Auto-deploy update"',
    'git push origin main',
    // Add more commands as needed, e.g.:
    // 'scp -r ./* user@your-server:/path/to/destination/'
];

function runCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${command}`);
                console.error(error);
                reject(error);
            } else {
                console.log(`Command executed successfully: ${command}`);
                console.log(stdout);
                resolve(stdout);
            }
        });
    });
}

async function runCommands() {
    for (const command of commands) {
        try {
            await runCommand(command);
        } catch (error) {
            console.error('Deployment failed');
            return;
        }
    }
    console.log('Deployment completed successfully');
}

runCommands();
