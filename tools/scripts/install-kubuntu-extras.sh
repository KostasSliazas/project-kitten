#!/bin/bash
# Kubuntu System Utility Script
# Author: Kostas Šliažas
# License: MIT

# -------------------------
# Root / Sudo Check
# -------------------------
if [[ $EUID -ne 0 ]]; then
  dialog --yesno "Some actions require sudo. Continue?" 7 50
  if [ $? -ne 0 ]; then
    clear
    echo "User declined sudo. Exiting."
    exit
  fi
fi

# -------------------------
# Trap Ctrl+C
# -------------------------
trap 'clear; echo "Interrupted."; exit' INT

# -------------------------
# Exit on any error
# -------------------------
set -e

# -------------------------
# Color Definitions
# -------------------------
GREEN="\e[32m"
YELLOW="\e[33m"
RED="\e[31m"
RESET="\e[0m"
CYAN="\e[36m"

# -------------------------
# Log File
# -------------------------
LOGFILE="/var/log/system_utility.log"
mkdir -p "$(dirname "$LOGFILE")"

# -------------------------
# VS Code Extension Retry Config
# -------------------------
MAX_RETRIES=3
RETRY_DELAY=5

# -------------------------
# VS Code Extensions
# -------------------------
extensions=(
  "ms-python.python"
  "abusaidm.html-snippets"
  "afractal.node-essentials"
  "anseki.vscode-color"
  "bmewburn.vscode-intelephense-client"
  "capaj.vscode-standardjs-snippets"
  "chenxsan.vscode-standardjs"
  "cobeia.airbnb-react-snippets"
  "glen-84.sass-lint"
  "esbenp.prettier-vscode"
  "olback.es6-css-minify"
  "jasonnutter.search-node-modules"
  "miguel-colmenares.css-js-minifier"
  "kokororin.vscode-phpfmt"
  "leizongmin.node-module-intellisense"
  "mgmcdermott.vscode-language-babel"
  "mikestead.dotenv"
  "mkaufman.HTMLHint"
  "mohd-akram.vscode-html-format"
  "ms-kubernetes-tools.vscode-kubernetes-tools"
  "ms-vsliveshare.vsliveshare"
  "p42ai.refactor"
  "pflannery.vscode-versionlens"
  "pranaygp.vscode-css-peek"
  "redhat.fabric8-analytics"
  "redhat.vscode-commons"
  "redhat.vscode-yaml"
  "glenn2223.live-sass"
  "ritwickdey.LiveServer"
  "roerohan.mongo-snippets-for-node-js"
  "sburg.vscode-javascript-booster"
  "sidthesloth.html5-boilerplate"
  "stevencl.addDocComments"
  "streetsidesoftware.code-spell-checker"
  "stylelint.vscode-stylelint"
  "Swellaby.node-pack"
  "syler.sass-indented"
  "dsznajder.es7-react-js-snippets"
  "thekalinga.bootstrap4-vscode"
  "Tobermory.es6-string-html"
  "VisualStudioExptTeam.vscodeintellicode"
  "waderyan.nodejs-extension-pack"
  "WallabyJs.quokka-vscode"
  "wix.vscode-import-cost"
  "Wscats.eno"
  "Equinusocio.vsc-material-theme"
  "ecmel.vscode-html-css"
)

# -------------------------
# Apps to Install
# -------------------------
apps=(
  "kubuntu-restricted-extras"
  "libavcodec-extra"
  "chromium"
  "clamav"
  "curl"
  "darktable"
  "exfat-fuse"
  "exfat-utils"
  "exiv2"
  "firefox"
  "gimp"
  "git"
  "gnome-disk-utility"
  "htop"
  "inkscape"
  "jpegoptim"
  "kget"
  "krita"
  "libimage-exiftool-perl"
  "net-tools"
  "mpv"
  "obs-studio"
  "pngquant"
  "persepolis"
  "stacer"
  "strawberry"
  "transmission-cli"
  "trimage"
  "ufw"
  "vlc"
  "wget"
  "xdm"
)

# -------------------------
# Services to Disable
# -------------------------
services_to_disable=(
  "rsyslog"
  "systemd-journald"
  "bluetooth"
  "mysql"
  "apache2"
  "ssh"
  "nginx"
  "postfix"
  "docker"
  "cups"
)

# -------------------------
# Domains to Block
# -------------------------
BLOCKED_DOMAINS=(
  "0rbit.com"
  "adclicksrv.com"
  "ads.yieldmanager.com"
  "adservinginternational.com"
  "affiliate-network.com"
  "amazonaws.com"
  "badb.com"
  "clicksor.com"
  "clickserve.cc"
  "datr.com"
  "doubleclick.net"
  "g.doubleclick.net"
  "malwaredomainlist.com"
  "phishing.com"
  "static.advertising.com"
  "track.360yield.com"
  "track.adnxs.com"
  "tracking.server.com"
  "unwanted-ads.net"
  "unsafeweb.com"
  "winfixer.com"
  "yourdirtywork.com"
  "zeusbot.com"
  "amarketplace.com"
  "contentdelivery.com"
  "infoproc.net"
  "clickture.com"
  "spamhub.com"
  "clickrewards.com"
  "trackedlink.com"
  "adservice.com"
  "trackmyads.com"
  "spybot.com"
  "cool-search.com"
  "fakewebsecurity.com"
  "adsrvmedia.com"
  "smartlink.com"
  "trustedsurveys.com"
  "phishing-attack.com"
  "ads2go.com"
  "securitycheckup.com"
  "shadyclicks.com"
  "malwareexpert.com"
  "botattack.com"
  "zeusbot.net"
  "scamtracker.com"
  "browser-optimizer.com"
  "tools-virus.com"
  "spamlord.com"
  "admiraltracker.com"
  "data-collection.com"
  "research-adnetwork.com"
  "rootkit.com"
  "badads.com"
  "fraudulentads.com"
  "advertising-scams.com"
  "clickfraudtracker.com"
  "ssl-malware.com"
  "fake-dns.com"
  "cyberthreat.com"
  "malwarehost.com"
  "unsafe-surf.com"
  "phishing-host.com"
  "trojan-distribution.com"
  "security-error.com"
  "scamlandingpage.com"
  "unsafe-exe.com"
  "clickblocker.com"
  "attack-router.com"
  "clickdisguise.com"
  "fraudulent-redirect.com"
)

# -------------------------
# Logging Function
# -------------------------
log() {
  local message="$1"
  local timestamp="$(date '+%Y-%m-%d %H:%M:%S')"
  local clean_message=$(echo -e "$message" | sed 's/\x1b\[[0-9;]*m//g') # Remove colors
  echo -e "${GREEN}$timestamp $message${RESET}"
  echo "$timestamp $clean_message" >>"$LOGFILE"
}

# -------------------------
# Install Package Function
# -------------------------
install_package() {
  local pkg="$1"
  if ! dpkg-query -W -f='${Status}' "$pkg" 2>/dev/null | grep -q "install ok installed"; then
    log "📦 Installing $pkg..."
    if sudo apt update -qq && sudo DEBIAN_FRONTEND=noninteractive apt install -y "$pkg" &>/dev/null; then
      log "✅ $pkg successfully installed."
    else
      log "⚠️ Failed to install $pkg, continuing..."
    fi
  else
    log "✅ $pkg already installed."
  fi
}

# -------------------------
# Disable Service
# -------------------------
disable_service() {
  local service_name="$1"
  echo -e "${CYAN}Checking $service_name...${RESET}"
  if systemctl list-units --full --all | grep -q "$service_name"; then
    echo -e "${CYAN}Disabling $service_name...${RESET}"
    sudo systemctl stop "$service_name" || log "⚠️ Failed to stop $service_name"
    sudo systemctl disable "$service_name" || log "⚠️ Failed to disable $service_name"
    echo -e "${GREEN}$service_name disabled.${RESET}"
  else
    echo -e "${YELLOW}$service_name not found or inactive.${RESET}"
  fi
}

# -------------------------
# Interactive Package Installer
# -------------------------
install_packages() {
  log "Displaying package selection menu..."
  options=()
  for app in "${apps[@]}"; do
    options+=("$app" "" off)
  done
  selected=$(dialog --separate-output --checklist "Select packages to install:" 22 60 16 "${options[@]}" 2>&1 >/dev/tty)
  clear
  [[ -z "$selected" ]] && { log "No packages selected."; return; }
  for pkg in $selected; do install_package "$pkg"; done
  dialog --msgbox "Selected packages installed." 6 40
}

# -------------------------
# Block Domains Function
# -------------------------
update_hosts() {
  select_domains
  sudo cp /etc/hosts /etc/hosts.bak.$(date +%F_%T)
  for domain in "${SELECTED_DOMAINS[@]}"; do
    if ! grep -q "$domain" /etc/hosts; then
      echo "127.0.0.1 $domain" | sudo tee -a /etc/hosts >/dev/null
      echo "127.0.0.1 www.$domain" | sudo tee -a /etc/hosts >/dev/null
      log "Blocked: $domain"
    else
      log "Already blocked: $domain"
    fi
  done
  flush_dns_cache
  dialog --msgbox "Selected domains blocked." 6 50
}

select_domains() {
  options=()
  for domain in "${BLOCKED_DOMAINS[@]}"; do
    options+=("$domain" "" on)
  done
  selected=$(dialog --separate-output --checklist "Select domains to block:" 22 76 16 "${options[@]}" 2>&1 >/dev/tty)
  clear
  [[ -z "$selected" ]] && { log "No domains selected."; exit 0; }
  SELECTED_DOMAINS=($selected)
}

flush_dns_cache() {
  if command -v systemctl &>/dev/null; then
    for svc in nscd systemd-resolved dnsmasq; do
      if systemctl list-units --full -all | grep -q "$svc.service"; then
        sudo systemctl restart "$svc"
        log "DNS cache flushed via $svc"
        return
      fi
    done
  fi
  log "No DNS cache service found."
}

# =============================
# Install VS Code safely
# =============================
install_vscode() {
    log "📥 Installing Visual Studio Code..."

    sudo apt update -qq
    sudo apt install -y wget gpg apt-transport-https >/dev/null 2>&1

    # Add Microsoft GPG key
    curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor | sudo tee /usr/share/keyrings/microsoft-archive-keyring.gpg >/dev/null

    # Add VS Code repository
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/microsoft-archive-keyring.gpg] https://packages.microsoft.com/repos/vscode stable main" | sudo tee /etc/apt/sources.list.d/vscode.list >/dev/null

    sudo apt update -qq

    # Install VS Code non-interactively
    if sudo DEBIAN_FRONTEND=noninteractive apt install -y code >/dev/null 2>&1; then
        log "✅ Visual Studio Code installed successfully."
    else
        log "⚠️ VS Code installation failed."
        return 1
    fi
}

# =============================
# Install a single VS Code extension with retries
# =============================
install_extension() {
    local extension="$1"
    local attempts=0
    local MAX_RETRIES=3
    local WAIT=5

    while (( attempts < MAX_RETRIES )); do
        log "Installing extension: $extension (Attempt $((attempts+1))/$MAX_RETRIES)..."

        # Headless installation
        if code --user-data-dir="$HOME/.vscode-data" --install-extension "$extension" --force >/dev/null 2>&1; then
            log "✅ Successfully installed: $extension"
            return 0
        else
            log "⚠️ Failed to install $extension. Retrying in $WAIT seconds..."
            sleep $WAIT
            attempts=$((attempts+1))
        fi
    done

    log "❌ Failed to install: $extension after $MAX_RETRIES attempts."
}

# =============================
# Install multiple extensions using a dialog checklist
# =============================
# =============================
# Install VS Code safely with dialog prompt
# =============================
install_vscode_extensions() {
    # Ask user using dialog instead of read
    dialog --yesno "Do you want to install Visual Studio Code?" 8 50
    if [[ $? -ne 0 ]]; then
        log "❌ User chose not to install VS Code. Skipping."
        return
    fi

    log "📥 Installing Visual Studio Code..."
    sudo apt update -qq
    sudo apt install -y wget gpg apt-transport-https >/dev/null 2>&1

    # Add Microsoft GPG key
    curl -fsSL https://packages.microsoft.com/keys/microsoft.asc \
        | gpg --dearmor \
        | sudo tee /usr/share/keyrings/microsoft-archive-keyring.gpg >/dev/null

    # Add VS Code repository
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/microsoft-archive-keyring.gpg] https://packages.microsoft.com/repos/vscode stable main" \
        | sudo tee /etc/apt/sources.list.d/vscode.list >/dev/null

    sudo apt update -qq

    # Install VS Code non-interactively
    if sudo DEBIAN_FRONTEND=noninteractive apt install -y code >/dev/null 2>&1; then
        log "✅ Visual Studio Code installed successfully."
    else
        log "⚠️ VS Code installation failed."
        dialog --msgbox "VS Code installation failed!" 6 40
        return
    fi

    # Select extensions using dialog checklist
    log "Selecting VS Code extensions to install..."
    checkboxes=""
    for ext in "${extensions[@]}"; do
        checkboxes="$checkboxes $ext $ext off"
    done

    selected_extensions=$(dialog --title "VS Code Extensions" \
        --checklist "Select extensions to install:" 20 70 15 $checkboxes 2>&1 >/dev/tty)
    clear

    [[ -z "$selected_extensions" ]] && { log "No extensions selected. Skipping."; return; }

    # Install selected extensions with retries
    for ext in $selected_extensions; do
        attempts=0
        MAX_RETRIES=3
        WAIT=5
        while (( attempts < MAX_RETRIES )); do
            log "Installing extension: $ext (Attempt $((attempts+1))/$MAX_RETRIES)..."
            if code --user-data-dir="$HOME/.vscode-data" --install-extension "$ext" --force >/dev/null 2>&1; then
                log "✅ Installed: $ext"
                break
            else
                log "⚠️ Failed: $ext. Retrying in $WAIT seconds..."
                sleep $WAIT
                attempts=$((attempts+1))
            fi
        done
        if (( attempts == MAX_RETRIES )); then
            log "❌ Could not install $ext after $MAX_RETRIES attempts."
        fi
    done

    dialog --msgbox "VS Code extensions installation complete!" 6 50
    log "✅ VS Code extensions installation complete."
}

# -------------------------
# Change DNS
# -------------------------
change_dns() {
  dialog --yesno "Change DNS?" 7 40
  [ $? -ne 0 ] && return
  CHOICE=$(dialog --menu "Select DNS provider:" 15 50 5 1 "Google" 2 "Cloudflare" 3 "OpenDNS" 4 "Quad9" 5 "Custom" 3>&1 1>&2 2>&3)
  case $CHOICE in
    1) dns1="8.8.8.8"; dns2="8.8.4.4" ;;
    2) dns1="1.1.1.1"; dns2="1.0.0.1" ;;
    3) dns1="208.67.222.222"; dns2="208.67.220.220" ;;
    4) dns1="9.9.9.9"; dns2="149.112.112.112" ;;
    5) dns1=$(dialog --inputbox "Primary DNS:" 8 40 3>&1 1>&2 2>&3); dns2=$(dialog --inputbox "Secondary DNS:" 8 40 3>&1 1>&2 2>&3) ;;
    *) return ;;
  esac
  active=$(nmcli -t -f NAME c show --active | head -n 1)
  [[ -z "$active" ]] && { dialog --msgbox "No active connection."; return; }
  sudo nmcli con mod "$active" ipv4.dns "$dns1 $dns2"
  sudo nmcli networking off && sudo nmcli networking on
  dialog --msgbox "DNS updated to:\n$dns1\n$dns2" 7 40
}

# -------------------------
# Disable KDE Sounds
# -------------------------
disable_kde_sounds() {
  kwriteconfig5 --file kdeglobals --group Sounds --key Enable false
  kwriteconfig5 --file kdeglobals --group Notifications --key PopupSounds false
  kquitapp5 plasmashell >/dev/null 2>&1 && kstart5 plasmashell >/dev/null 2>&1 &
  dialog --msgbox "KDE system sounds disabled." 6 40
}

# -------------------------
# System Optimization
# -------------------------
optimize_system() {
  log "🚀 Optimizing system..."
  sudo apt autoremove -y && sudo apt autoclean -y
  log "✅ Optimization complete!"
  clear
  df -h | tee -a "$LOGFILE"
  free -h | tee -a "$LOGFILE"
}

# -------------------------
# Service Management
# -------------------------
manage_services() {
  options=""
  for svc in "${services_to_disable[@]}"; do options="$options $svc $svc off"; done
  selected=$(dialog --title "Disable Services" --checklist "Select services:" 20 70 15 $options 2>&1 >/dev/tty)
  clear
  [[ -z "$selected" ]] && { echo -e "${YELLOW}No services selected.${RESET}"; return; }
  for svc in $selected; do disable_service "$svc"; done
  echo -e "${GREEN}Service management done.${RESET}"
}

# -------------------------
# Run All Tasks
# -------------------------
run_all_tasks() {
    tasks=("manage_services" "install_packages" "update_hosts" "install_vscode_extensions" "change_dns" "optimize_system" "disable_kde_sounds")
    total=${#tasks[@]}

    # Use a named pipe for the gauge
    exec 3> >(dialog --title "Running Tasks" --gauge "Starting..." 10 60 0)

    for i in "${!tasks[@]}"; do
        percent=$(( (i + 1) * 100 / total ))
        echo "XXX" >&3
        echo "$percent" >&3
        echo "Running ${tasks[i]}..." >&3
        "${tasks[i]}"  # Run the task
        sleep 0.2      # Slight delay so gauge updates visually
    done

    echo "XXX" >&3
    echo "100" >&3
    echo "All tasks completed!" >&3
    echo "XXX" >&3
    exec 3>&-
    dialog --msgbox "All tasks completed successfully!" 6 50
}

# -------------------------
# Main Menu
# -------------------------
show_menu() {
  while true; do
    CHOICE=$(dialog --clear --title "Kubuntu Utility" --menu "Choose action:" 15 50 12 \
      1 "Run All Tasks" \
      2 "Install Packages" \
      3 "Block Websites" \
      4 "Change DNS" \
      5 "Install VS Code + Extensions" \
      6 "Optimize System" \
      7 "Disable KDE Sounds" \
      8 "Exit" 3>&1 1>&2 2>&3)
    [[ $? -ne 0 ]] && { clear; echo "Exited menu."; exit; }
    case $CHOICE in
      1) run_all_tasks ;;
      2) install_packages ;;
      3) update_hosts ;;
      4) change_dns ;;
      5) install_vscode_extensions ;;
      6) optimize_system ;;
      7) disable_kde_sounds ;;
      8) log "Exiting script."; clear; exit ;;
    esac
  done
}

# -------------------------
# Script Start
# -------------------------
log "🚀 Starting Kubuntu Utility Script..."
install_package "dialog"
show_menu
