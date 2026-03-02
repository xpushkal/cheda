#!/bin/bash
# Error Sound - Bash Hook
# Plays a sound when any terminal command fails
#
# Installation:
#   1. Copy this file to your home directory or preferred location
#   2. Add the following line to your ~/.bashrc:
#      source ~/error-sound-hook.bash
#   3. Restart your terminal or run: source ~/.bashrc

# Configuration
export ERROR_SOUND_ENABLED=true
# Default to cheda.mov in the same directory as this script
_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export ERROR_SOUND_FILE="${ERROR_SOUND_FILE:-$_SCRIPT_DIR/cheda.mov}"
export ERROR_SOUND_VOLUME="${ERROR_SOUND_VOLUME:-0.5}"

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
    case "$OSTYPE" in
        darwin*)
            # macOS - use afplay (built-in)
            afplay -v "$ERROR_SOUND_VOLUME" "$sound_file" &>/dev/null &
            ;;
        linux-gnu*)
            # Linux - try paplay first, then aplay
            if command -v paplay &>/dev/null; then
                paplay "$sound_file" &>/dev/null &
            elif command -v aplay &>/dev/null; then
                aplay -q "$sound_file" &>/dev/null &
            fi
            ;;
    esac
}

# Store the original PROMPT_COMMAND
_original_prompt_command="$PROMPT_COMMAND"

# Our error checking function
_error_sound_check() {
    local last_exit_code=$?
    
    # If the last command failed (non-zero exit code)
    if [[ $last_exit_code -ne 0 ]]; then
        play_error_sound
    fi
    
    return $last_exit_code
}

# Prepend our function to PROMPT_COMMAND
PROMPT_COMMAND="_error_sound_check${PROMPT_COMMAND:+;$PROMPT_COMMAND}"

# Toggle function
error_sound_toggle() {
    if [[ "$ERROR_SOUND_ENABLED" == "true" ]]; then
        export ERROR_SOUND_ENABLED=false
        echo "Error Sound: Disabled"
    else
        export ERROR_SOUND_ENABLED=true
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
