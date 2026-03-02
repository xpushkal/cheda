#!/bin/zsh
# Error Sound - Shell Hook
# Plays a sound when any terminal command fails
#
# Installation:
#   1. Copy this file to your home directory or preferred location
#   2. Add the following line to your ~/.zshrc:
#      source ~/error-sound-hook.zsh
#   3. Restart your terminal or run: source ~/.zshrc

# Configuration
ERROR_SOUND_ENABLED=true
# Default to cheda.mov in the same directory as this script
_SCRIPT_DIR="${0:A:h}"
ERROR_SOUND_FILE="${ERROR_SOUND_FILE:-$_SCRIPT_DIR/cheda.mov}"
ERROR_SOUND_VOLUME="${ERROR_SOUND_VOLUME:-0.5}"

# Function to play error sound
play_error_sound() {
    if [[ "$ERROR_SOUND_ENABLED" != "true" ]]; then
        return
    fi

    local sound_file="$ERROR_SOUND_FILE"
    
    # Check if sound file exists
    if [[ ! -f "$sound_file" ]]; then
        # Try fallback locations
        if [[ -f "$HOME/error.mp3" ]]; then
            sound_file="$HOME/error.mp3"
        elif [[ -f "/System/Library/Sounds/Funk.aiff" ]]; then
            # macOS system sound fallback
            sound_file="/System/Library/Sounds/Funk.aiff"
        else
            return
        fi
    fi

    # Play sound based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS - use afplay (built-in)
        afplay -v "$ERROR_SOUND_VOLUME" "$sound_file" &>/dev/null &
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux - try paplay first, then aplay
        if command -v paplay &>/dev/null; then
            paplay "$sound_file" &>/dev/null &
        elif command -v aplay &>/dev/null; then
            aplay -q "$sound_file" &>/dev/null &
        fi
    fi
}

# Hook into precmd to check the last command's exit status
error_sound_precmd() {
    local last_exit_code=$?
    
    # If the last command failed (non-zero exit code)
    if [[ $last_exit_code -ne 0 ]]; then
        play_error_sound
    fi
}

# Add our function to precmd_functions array
if [[ -z "${precmd_functions[(r)error_sound_precmd]}" ]]; then
    precmd_functions+=(error_sound_precmd)
fi

# Toggle function
error_sound_toggle() {
    if [[ "$ERROR_SOUND_ENABLED" == "true" ]]; then
        ERROR_SOUND_ENABLED=false
        echo "Error Sound: Disabled"
    else
        ERROR_SOUND_ENABLED=true
        echo "Error Sound: Enabled"
    fi
}

# Test function
error_sound_test() {
    echo "Playing test sound..."
    local saved_state="$ERROR_SOUND_ENABLED"
    ERROR_SOUND_ENABLED=true
    play_error_sound
    ERROR_SOUND_ENABLED="$saved_state"
}

# Aliases for convenience
alias est='error_sound_toggle'
alias estest='error_sound_test'

echo "🔊 Error Sound Hook loaded. Use 'est' to toggle, 'estest' to test."
