import * as vscode from 'vscode';
import * as path from 'path';
import { exec } from 'child_process';

let isEnabled = true;

export function activate(context: vscode.ExtensionContext) {
    console.log('Error Sound extension is now active');

    const soundPath = path.join(context.extensionPath, 'sounds', 'error.mov');

    // Toggle command
    const toggleCommand = vscode.commands.registerCommand('errorSound.toggle', () => {
        isEnabled = !isEnabled;
        vscode.window.showInformationMessage(`Error Sound: ${isEnabled ? 'Enabled' : 'Disabled'}`);
    });

    // Test sound command
    const testSoundCommand = vscode.commands.registerCommand('errorSound.testSound', () => {
        playSound(soundPath);
        vscode.window.showInformationMessage('Playing test sound...');
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

    // Fallback: Listen to diagnostics changes for code errors
    context.subscriptions.push(
        vscode.languages.onDidChangeDiagnostics((event) => {
            if (!isEnabled) return;

            for (const uri of event.uris) {
                const diagnostics = vscode.languages.getDiagnostics(uri);
                const hasErrors = diagnostics.some(d => d.severity === vscode.DiagnosticSeverity.Error);
                
                if (hasErrors) {
                    // Debounce to avoid playing too many sounds
                    playSound(soundPath);
                    break;
                }
            }
        })
    );

    context.subscriptions.push(toggleCommand, testSoundCommand);
}

function playSound(soundPath: string): void {
    const config = vscode.workspace.getConfiguration('errorSound');
    const volume = config.get('volume', 0.5);

    // Use afplay on macOS (built-in)
    if (process.platform === 'darwin') {
        exec(`afplay -v ${volume} "${soundPath}"`, (err) => {
            if (err) {
                console.error('Failed to play sound:', err);
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
                        console.error('Failed to play sound:', err2);
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
                console.error('Failed to play sound:', err);
            }
        });
    }
}

export function deactivate() {
    console.log('Error Sound extension deactivated');
}
