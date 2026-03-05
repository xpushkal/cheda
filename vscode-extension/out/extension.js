"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
let isEnabled = true;
let lastSoundTime = 0;
const DEBOUNCE_MS = 2000; // Don't play sounds more often than every 2 seconds
let statusBarItem;
function activate(context) {
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
    context.subscriptions.push(vscode.window.onDidEndTerminalShellExecution(async (event) => {
        if (!isEnabled)
            return;
        const config = vscode.workspace.getConfiguration('errorSound');
        if (!config.get('enabled', true))
            return;
        // Check if the command failed (non-zero exit code)
        if (event.exitCode !== undefined && event.exitCode !== 0) {
            playSound(soundPath);
        }
    }));
    context.subscriptions.push(toggleCommand, testSoundCommand, statusBarItem);
}
function updateStatusBar() {
    if (isEnabled) {
        statusBarItem.text = "$(unmute) Cheda";
        statusBarItem.tooltip = "Cheda Error Sound: ON (click to toggle)";
    }
    else {
        statusBarItem.text = "$(mute) Cheda";
        statusBarItem.tooltip = "Cheda Error Sound: OFF (click to toggle)";
    }
}
function playSound(soundPath, force = false) {
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
        (0, child_process_1.exec)(`afplay -v ${volume} "${soundPath}"`, (err) => {
            if (err) {
                console.error('Cheda: Failed to play sound:', err);
            }
        });
    }
    // Use paplay on Linux
    else if (process.platform === 'linux') {
        (0, child_process_1.exec)(`paplay "${soundPath}"`, (err) => {
            if (err) {
                // Fallback to aplay
                (0, child_process_1.exec)(`aplay "${soundPath}"`, (err2) => {
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
        (0, child_process_1.exec)(cmd, (err) => {
            if (err) {
                console.error('Cheda: Failed to play sound:', err);
            }
        });
    }
}
function deactivate() {
    if (statusBarItem) {
        statusBarItem.dispose();
    }
    console.log('Cheda Error Sound extension deactivated');
}
//# sourceMappingURL=extension.js.map