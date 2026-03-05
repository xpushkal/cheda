# Cheda - Error Sound Extension for VS Code

Plays a sound when terminal commands fail in VS Code.

## Features

- **Terminal Error Detection**: Automatically plays a sound when a terminal command exits with a non-zero code
- **Status Bar Toggle**: Click the status bar item to quickly enable/disable
- **Customizable Volume**: Adjust the volume from settings

## Usage

1. Install the extension
2. Open the integrated terminal in VS Code
3. Run a command that fails (e.g., `ls /nonexistent`)
4. Hear the error sound!

## Commands

- `Cheda: Toggle On/Off` - Enable/disable the error sound
- `Cheda: Test Sound` - Play the sound to test it works

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `errorSound.enabled` | `true` | Enable/disable error sound |
| `errorSound.volume` | `0.5` | Volume level (0-1) |

## Requirements

- VS Code 1.74.0 or higher
- macOS, Linux, or Windows

## Known Issues

- Shell integration must be enabled in VS Code for terminal error detection to work
- On Windows, only `.wav` files are supported

## Release Notes

### 1.0.0

Initial release:
- Terminal error sound playback
- Status bar toggle
- Test sound command
- Volume control
