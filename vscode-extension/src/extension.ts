import * as vscode from 'vscode';
import * as path from 'path';
import { exec } from 'child_process';

let isEnabled = true;
let lastSoundTime = 0;
const DEBOUNCE_MS = 2000; // Don't play sounds more often than every 2 seconds
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
    console.log('Cheda Error Sound extension is now active');

    const soundPath = path.join(context.extensionPath, 'sounds', 'error.mov');

    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'errorSound.toggle';
    updateStatusBar();
    statusBarItem.show();

    // Toggle command
    const toggleCommand = vscode.commands.registerCommand('errorSound.toggle', () => {
        isEnabled = !isEnabled;
        updateStatusBar();
        vscode.window.showInformationMessage(`Cheda: ${isEnabled ? 'Enabled' : 'Disabled'}`);
    });

    // Test sound command
    const testSoundCommand = vscode.commands.registerCommand('errorSound.testSound', () => {
        playSound(soundPath, true);
        vscode.window.showInformationMessage('Cheda: Playing test sound...');
    });

    // Listen to terminal shell integration for command completion
    context.subscriptions.push(
        vscode.window.onDidEndTerminalShellExecution(async (event) => {
            if (!isEnabled) return;

            const config = vscode.workspace.getConfiguration('errorSound');
            if (!config.get('enabled', true)) return;

            // Check if the command failed (non-zero exit code)
            if (event.exitCode !== undefined && event.exitCode !== 0) {
                playSound(soundPath);
            }
        })
    );

    context.subscriptions.push(toggleCommand, testSoundCommand, statusBarItem);
}

function updateStatusBar(): void {
    if (isEnabled) {
        statusBarItem.text = "$(unmute) Cheda";
        statusBarItem.tooltip = "Cheda Error Sound: ON (click to toggle)";
    } else {
        statusBarItem.text = "$(mute) Cheda";
        statusBarItem.tooltip = "Cheda Error Sound: OFF (click to toggle)";
    }
}

function playSound(soundPath: string, force: boolean = false): void {
    // Debounce - don't play sounds too frequently
    const now = Date.now();
    if (!force && (now - lastSoundTime) < DEBOUNCE_MS) {
        return;
    }
    lastSoundTime = now;

    const config = vscode.workspace.getConfiguration('errorSound');
    const volume = config.get('volume', 0.5);

    // Use afplay on macOS (built-in)
    if (process.platform === 'darwin') {
        exec(`afplay -v ${volume} "${soundPath}"`, (err) => {
            if (err) {
                console.error('Cheda: Failed to play sound:', err);
            }
        });
    } 
    // Use paplay on Linux
    else if (process.platform === 'linux') {
        exec(`paplay "${soundPath}"`, (err) => {
            if (err) {
                // Fallback to aplay
                exec(`aplay "${soundPath}"`, (err2) => {
                    if (err2) {
                        console.error('Cheda: Failed to play sound:', err2);
                    }
                });
            }
        });
    }
    // Use PowerShell on Windows
    else if (process.platform === 'win32') {
        const cmd = `powershell -c "(New-Object Media.SoundPlayer '${soundPath}').PlaySync();"`;
        exec(cmd, (err) => {
            if (err) {
                console.error('Cheda: Failed to play sound:', err);
            }
        });
    }
}

export function deactivate() {
    if (statusBarItem) {
        statusBarItem.dispose();
    }
    console.log('Cheda Error Sound extension deactivated');
}
