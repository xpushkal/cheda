# 🔊 Error Sound

Play a sound whenever a command fails! Available as both a **VS Code extension** and a **shell hook**.

---

## 📦 Option 1: VS Code Extension

Plays a sound when terminal commands fail inside VS Code.

### Installation

```bash
cd vscode-extension
npm install
npm run compile
```

### Development / Testing

1. Open the `vscode-extension` folder in VS Code
2. Press `F5` to launch Extension Development Host
3. Run a failing command in the terminal (e.g., `ls /nonexistent`)
4. Hear the error sound! 🔊

### Commands

- **Error Sound: Toggle On/Off** - Enable/disable the sound
- **Error Sound: Test Sound** - Play the sound to test it works

### Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `errorSound.enabled` | `true` | Enable/disable error sound |
| `errorSound.volume` | `0.5` | Volume level (0-1) |

### Publishing

```bash
npm install -g @vscode/vsce
vsce package
vsce publish
```

---

## 📦 Option 2: Shell Hook (Works Anywhere!)

Plays a sound when ANY terminal command fails, works in any terminal app.

### Installation (Zsh - default on macOS)

```bash
# Copy the hook script
cp shell-hook/error-sound-hook.zsh ~/

# Add to your shell config
echo 'source ~/error-sound-hook.zsh' >> ~/.zshrc

# Create config directory and add a sound file
mkdir -p ~/.config/error-sound
# Copy your preferred error sound to ~/.config/error-sound/error.mp3

# Reload shell
source ~/.zshrc
```

### Installation (Bash)

```bash
# Copy the hook script
cp shell-hook/error-sound-hook.bash ~/

# Add to your shell config
echo 'source ~/error-sound-hook.bash' >> ~/.bashrc

# Create config directory and add a sound file
mkdir -p ~/.config/error-sound
# Copy your preferred error sound to ~/.config/error-sound/error.mp3

# Reload shell
source ~/.bashrc
```

### Using macOS System Sound (No Download Needed!)

The shell hook automatically falls back to macOS system sounds. To use them explicitly:

```bash
# Use macOS Funk sound
export ERROR_SOUND_FILE="/System/Library/Sounds/Funk.aiff"

# Or try other system sounds:
# /System/Library/Sounds/Basso.aiff
# /System/Library/Sounds/Blow.aiff
# /System/Library/Sounds/Bottle.aiff
# /System/Library/Sounds/Frog.aiff
# /System/Library/Sounds/Glass.aiff
# /System/Library/Sounds/Hero.aiff
# /System/Library/Sounds/Morse.aiff
# /System/Library/Sounds/Ping.aiff
# /System/Library/Sounds/Pop.aiff
# /System/Library/Sounds/Purr.aiff
# /System/Library/Sounds/Sosumi.aiff
# /System/Library/Sounds/Submarine.aiff
# /System/Library/Sounds/Tink.aiff
```

### Commands

| Command | Alias | Description |
|---------|-------|-------------|
| `error_sound_toggle` | `est` | Toggle sound on/off |
| `error_sound_test` | `estest` | Play test sound |

### Configuration

Set these environment variables in your shell config:

```bash
# Enable/disable (default: true)
export ERROR_SOUND_ENABLED=true

# Custom sound file path
export ERROR_SOUND_FILE="$HOME/.config/error-sound/error.mp3"

# Volume for macOS (0.0 - 1.0)
export ERROR_SOUND_VOLUME=0.5
```

---

## 🎵 Finding Sound Files

### Free Error Sounds

- [SoundJay](https://www.soundjay.com/beep-sounds-1.html) - Free beep sounds
- [Freesound](https://freesound.org/) - Community sound library
- [Zapsplat](https://www.zapsplat.com/) - Free sound effects

### Quick Download (Example)

```bash
# Download a simple beep sound
curl -L "https://www.soundjay.com/buttons/sounds/beep-07a.mp3" -o ~/.config/error-sound/error.mp3
```

---

## 🧪 Test It!

```bash
# Run a command that will fail
ls /this/path/does/not/exist

# You should hear the error sound! 🔊
```

---

## 📝 License

MIT License - Feel free to use and modify!
