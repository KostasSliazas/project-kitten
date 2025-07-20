#!/bin/bash

set -e # Exit on error

# Color Definitions
GREEN="\e[32m"
YELLOW="\e[33m"
RED="\e[31m"
RESET="\e[0m"

# Log File
LOGFILE="/var/log/system_utility.log"

# VS Code Extension Retry Config
MAX_RETRIES=3
RETRY_DELAY=3

# VS Code Extension examples
extensions=(
  "ms-python.python"
  "abusaidm.html-snippets"
  "afractal.node-essentials"
  "anseki.vscode-color"
  "bmewburn.vscode-intelephense-client"
  "capaj.vscode-standardjs-snippets"
  "chenxsan.vscode-standardjs"
  "cobeia.airbnb-react-snippets"
  "glen-84.sass-lint"      # Replacement for adamwalzer.scss-lint
  "esbenp.prettier-vscode" # Replacement for HookyQR.beautify
  "olback.es6-css-minify"
  "jasonnutter.search-node-modules"
  "miguel-colmenares.css-js-minifier" # Replacement for justinlampe.js-minifier-with-closure
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
  "glenn2223.live-sass" # Replacement for ritwickdey.live-sass
  "ritwickdey.LiveServer"
  "roerohan.mongo-snippets-for-node-js"
  "sburg.vscode-javascript-booster"
  "sidthesloth.html5-boilerplate"
  "stevencl.addDocComments"
  "streetsidesoftware.code-spell-checker"
  "stylelint.vscode-stylelint"
  "Swellaby.node-pack"
  "syler.sass-indented"
  "dsznajder.es7-react-js-snippets" # Replacement for xabikos.JavaScriptSnippets
  "thekalinga.bootstrap4-vscode"
  "Tobermory.es6-string-html"
  "VisualStudioExptTeam.vscodeintellicode"
  "waderyan.nodejs-extension-pack"
  "WallabyJs.quokka-vscode"
  "wix.vscode-import-cost"
  "Wscats.eno"
  "Equinusocio.vsc-material-theme" # Replacement for zhuangtongfa.material-theme
  "ecmel.vscode-html-css"          # Replacement for Zignd.html-css-class-completion
)

# List of domains to block EXAMPLE
BLOCKED_DOMAINS=(
  "0rbit.com"
  "adclicksrv.com"
  "ads.yieldmanager.com"
  "adservinginternational.com"
  "affiliate-network.com"
  "amazonaws.com" # Often used for hosting phishing pages
  "badb.com"
  "clicksor.com"
  "clickserve.cc"
  "datr.com"        # Facebook's tracker, but can be used by malicious parties
  "doubleclick.net" # Google's ad network often misused in malicious ads
  "g.doubleclick.net"
  "malwaredomainlist.com"
  "phishing.com"
  "static.advertising.com"
  "track.360yield.com"
  "track.adnxs.com"
  "tracking.server.com"
  "unwanted-ads.net"
  "unsafeweb.com"
  "winfixer.com" # Known for redirecting to fake antivirus sites
  "yourdirtywork.com"
  "zeusbot.com"         # Common in botnet infections
  "amarketplace.com"    # Scam and fraudulent sites
  "contentdelivery.com" # Often used in fake update prompts
  "infoproc.net"        # Used in click fraud schemes
  "clickture.com"
  "spamhub.com"      # Used to host spam websites
  "clickrewards.com" # Part of click fraud campaigns
  "trackedlink.com"
  "adservice.com"
  "trackmyads.com"  # Known for tracking and delivering unwanted ads
  "spybot.com"      # Often a rogue program related to adware
  "cool-search.com" # Redirects to malicious or fake websites
  "fakewebsecurity.com"
  "adsrvmedia.com"     # Known to deliver adware
  "smartlink.com"      # Associated with fraudulent redirection
  "trustedsurveys.com" # Often used in phishing schemes
  "phishing-attack.com"
  "ads2go.com"
  "securitycheckup.com" # Fake security warning sites
  "shadyclicks.com"
  "olifeja.lt"
  "loto.lt"
  "fb.com"
  "malwareexpert.com"
  "botattack.com"          # Associated with botnet attacks
  "zeusbot.net"            # Related to the Zeus botnet, often used in financial malware
  "scamtracker.com"        # Used to host scams
  "browser-optimizer.com"  # A malicious site posing as optimization software
  "tools-virus.com"        # Known to distribute virus warnings
  "spamlord.com"           # Hosts spam or fraudulent content
  "admiraltracker.com"     # Tracker used for malicious purposes
  "data-collection.com"    # Data harvesting and fraudulent activities
  "research-adnetwork.com" # Unwanted ad network and trackers
  "rootkit.com"            # Used for malware-related rootkits
  "badads.com"             # Known for ad fraud and malware distribution
  "fraudulentads.com"      # Used in scam advertising
  "advertising-scams.com"
  "clickfraudtracker.com"   # Associated with click fraud campaigns
  "ssl-malware.com"         # Malicious SSL-related site
  "fake-dns.com"            # DNS manipulation and fraud
  "cyberthreat.com"         # Associated with cybersecurity threats
  "malwarehost.com"         # Malware hosting site
  "unsafe-surf.com"         # Risky site hosting malicious content
  "phishing-host.com"       # Common in phishing attacks
  "trojan-distribution.com" # Used for distributing trojans
  "security-error.com"      # A site often used in fake warnings
  "scamlandingpage.com"     # Scam landing page frequently used in phishing
  "unsafe-exe.com"          # Hosts dangerous .exe files
  "clickblocker.com"        # Used for malicious redirecting
  "attack-router.com"       # Associated with network-based attacks
  "clickdisguise.com"       # Fraudulent click and ad campaigns
  "fraudulent-redirect.com" # Redirects to harmful or scam websites
)

# Define a global list of apps to be installed
declare -a apps=(
  "vlc"
  "gimp"
  "htop"
  "inkscape"
  "firefox"
  "curl"
  "git"
  "ufw"
  "kget"
  "strawberry"
  "gnome-disk-utility"
  "trimage"
  "xdm"
  "krita"
  "darktable"
  "stacer"
  "chromium"
  "transmission-cli"
  "clamav"
  "wget"
  "exfat-fuse"
  "exfat-utils"
  "net-tools"
)

# Define a list of services to disable
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

# Function: Logging with timestamp
log() {
  local message="$1"
  local timestamp="$(date '+%Y-%m-%d %H:%M:%S')"
  local clean_message=$(echo -e "$message" | sed 's/\x1b\[[0-9;]*m//g') # Remove colors for logs

  echo -e "${GREEN}$timestamp $message${RESET}" # Terminal output
  echo "$timestamp $clean_message" >>"$LOGFILE"
}

# Function to disable a service with error checking
disable_service() {
  local service_name="$1"

  # Check if the service is active or exists
  echo -e "${CYAN}Checking if $service_name is active...${RESET}"
  if systemctl list-units --full --all | grep -q "$service_name"; then
    echo -e "${CYAN}Disabling $service_name...${RESET}"

    # Stop the service and disable it, with error checking
    sudo systemctl stop "$service_name" || {
      echo -e "${RED}Failed to stop $service_name${RESET}"
      return 1
    }
    sudo systemctl disable "$service_name" || {
      echo -e "${RED}Failed to disable $service_name${RESET}"
      return 1
    }

    echo -e "${GREEN}$service_name has been disabled.${RESET}"
  else
    echo -e "${YELLOW}$service_name is not found or not running.${RESET}"
  fi
}

install_package() {
  local pkg="$1"

  # Check if package is installed correctly
  if ! dpkg-query -W -f='${Status}' "$pkg" 2>/dev/null | grep -q "install ok installed"; then
    log "📦 Installing $pkg..."

    # Suppress errors, force "yes", and prevent interactive prompts
    if sudo apt update -qq && sudo DEBIAN_FRONTEND=noninteractive apt install -y "$pkg" &>/dev/null; then
      log "✅ $pkg successfully installed."
    else
      log "⚠️ Failed to install $pkg, but continuing..."
    fi
  else
    log "✅ $pkg is already installed."
  fi
}

# Function to show an interactive checklist and install selected packages
install_packages() {
  log "Displaying package selection menu..."

  # Generate dialog options
  options=()
  for app in "${apps[@]}"; do
    options+=("$app" "" off) # Each item: "<package>" "<description>" <on/off>
  done

  # Run checklist with dialog/whiptail
  selected=$(dialog --separate-output --checklist "Select applications to install:" 22 76 16 "${options[@]}" 2>&1 >/dev/tty)

  if [[ -z "$selected" ]]; then
    log "No packages selected. Exiting."
    return 0 # Exit function without installing anything
  fi

  # Convert selected items into an array
  selected_apps=($selected)

  # Install selected packages using install_package function
  log "Installing selected packages..."
  for pkg in "${selected_apps[@]}"; do
    install_package "$pkg"
  done
}
# Flush DNS cache based on available services
flush_dns_cache() {
  if command -v systemctl &>/dev/null; then
    if systemctl list-units --full -all | grep -q "nscd.service"; then
      sudo systemctl restart nscd
    elif systemctl list-units --full -all | grep -q "systemd-resolved.service"; then
      sudo systemctl restart systemd-resolved
    elif systemctl list-units --full -all | grep -q "dnsmasq.service"; then
      sudo systemctl restart dnsmasq
    else
      log "No DNS caching service found to restart."
      return
    fi
    log "DNS cache flushed successfully."
  else
    log "Systemctl command not found. Unable to flush DNS cache."
  fi
}
# Function to display interactive checklist using dialog
select_domains() {
  log "Displaying domain selection menu..."

  # Prepare options for dialog checklist
  options=()
  for domain in "${BLOCKED_DOMAINS[@]}"; do
    options+=("$domain" "" "on") # "on" means pre-selected
  done

  # Run dialog checklist and capture selected domains
  selected=$(dialog --separate-output --checklist "Select domains to block:" 22 76 16 "${options[@]}" 2>&1 >/dev/tty)

  clear # Clear screen after selection

  if [[ -z "$selected" ]]; then
    log "No domains selected. Exiting."
    exit 0
  fi

  # Convert selected items into an array
  SELECTED_DOMAINS=($selected)
}
# Function to block selected domains by updating /etc/hosts
update_hosts() {
  select_domains
  log "Blocking selected domains..."

  for domain in "${SELECTED_DOMAINS[@]}"; do
    # Check if domain is already blocked
    if ! grep -q "$domain" /etc/hosts; then
      echo "127.0.0.1 $domain" | sudo tee -a /etc/hosts >/dev/null
      echo "127.0.0.1 www.$domain" | sudo tee -a /etc/hosts >/dev/null
      log "Blocked: $domain"
    else
      log "Already blocked: $domain"
    fi
  done

  # Flush DNS cache to apply changes
  flush_dns_cache
}
# Install Kubuntu restricted extras
install_kubuntu_extras() {
  clear # Clear the screen before exiting
  log "Installing Kubuntu restricted extras..."
  sudo apt install -y kubuntu-restricted-extras 2>/dev/null | tee -a "$LOGFILE"
}

# Install VS Code and required dependencies
install_vscode() {
  wget -qO- https://packages.microsoft.com/keys/microsoft.asc | sudo gpg --dearmor >/usr/share/keyrings/microsoft-archive-keyring.gpg
  echo "deb [arch=amd64 signed-by=/usr/share/keyrings/microsoft-archive-keyring.gpg] https://packages.microsoft.com/repos/vscode stable main" | sudo tee /etc/apt/sources.list.d/vscode.list >/dev/null
  sudo apt update 2>/dev/null
  sudo apt install -y code 2>/dev/null
}

# Function to install a single extension with retries
install_extension() {
  local extension="$1"
  local attempts=0
  local MAX_RETRIES=3
  local COUNTDOWN_TIME=5 # Countdown time for retry

  # Loop for retry attempts
  while ((attempts < MAX_RETRIES)); do
    log "Installing $extension (Attempt $((attempts + 1))/$MAX_RETRIES)..."

    # Try installing the extension
    if code --no-sandbox --user-data-dir="$HOME/.vscode-data" --install-extension "$extension" --force; then
      log "✅ Successfully installed: $extension"
      return 0
    else
      log "⚠️ Failed to install: $extension. Retrying in $COUNTDOWN_TIME seconds..."

      # Countdown before retrying
      for ((i = COUNTDOWN_TIME; i > 0; i--)); do
        echo -ne "⏳ Retrying in $i... \r"
        sleep 1
      done

      # Increment attempt count and retry
      attempts=$((attempts + 1))
    fi
  done

  # If all attempts fail, log failure
  log "❌ Failed to install: $extension after $MAX_RETRIES attempts. Moving on to the next extension..."
}

# Function to display the list of extensions and install them
install_vscode_extensions() {
  # Ask the user if they want to install VSCode before proceeding

  read -p "Do you want to install Visual Studio Code? (y/n): " install_choice
  if [[ "$install_choice" == "y" || "$install_choice" == "Y" ]]; then
    install_vscode
  else
    log "❌ User chose not to install Visual Studio Code. Exiting."
    return 0
  fi

  log "You will now be presented with a list of extensions to install."

  # Create checkboxes for dialog UI
  checkboxes=""
  for extension_id in "${extensions[@]}"; do
    checkboxes="$checkboxes $extension_id $extension_id off"
  done

  # Use dialog to allow users to select extensions
  selected_extensions=$(dialog --title "VS Code Extension Installation" \
    --checklist "Select extensions to install" 20 70 15 \
    $checkboxes 2>&1 >/dev/tty)

  # If no selection is made, log and do nothing
  if [[ -z "$selected_extensions" ]]; then
    log "No extensions selected. Skipping installation."
    return 0 # Exit function without installing anything
  fi

  # Loop through selected extensions and install each one
  for extension_id in $selected_extensions; do
    install_extension "$extension_id"
  done

  log "🔍 Installation process completed."
}

# Function: Check Disk Space & Memory
check_system_health() {
  log "💾 Checking system disk space and memory..."
  df -h | grep "^/dev" | tee -a "$LOGFILE"
  free -h | tee -a "$LOGFILE"
}

# Function: Optimize System
optimize_system() {
  log "🚀 Optimizing system..."
  sudo apt autoremove -y && sudo apt autoclean -y
  log "✅ System optimized!"
  clear # Clear the screen before exiting
  check_system_health
}

# Function to disable selected services using dialog
manage_services() {
  # Create checkboxes for dialog UI
  checkboxes=""
  for service in "${services_to_disable[@]}"; do
    checkboxes="$checkboxes $service $service off"
  done

  # Use dialog to allow users to select services to disable
  selected_services=$(dialog --title "Service Disable Selection" \
    --checklist "Select services to disable" 20 70 15 \
    $checkboxes 2>&1 >/dev/tty)

  clear # Clear the dialog screen

  # If no selection is made, log and do nothing
  if [[ -z "$selected_services" ]]; then
    echo -e "${YELLOW}No services selected. Skipping disable process.${RESET}"
    return 0 # Exit function without disabling anything
  fi

  # Loop through selected services and disable each one
  for service in $selected_services; do
    disable_service "$service"
  done

  echo -e "${GREEN}Service disabling process completed.${RESET}"
}

change_dns() {
    echo "Do you want to change DNS? (y/n)"
    read -r choice
    if [[ "$choice" =~ ^[Yy]$ ]]; then
        echo "Select a DNS provider:"
        echo "1) Google (8.8.8.8, 8.8.4.4)"
        echo "2) Cloudflare (1.1.1.1, 1.0.0.1)"
        echo "3) OpenDNS (208.67.222.222, 208.67.220.220)"
        echo "4) Quad9 (9.9.9.9, 149.112.112.112)"
        echo "5) Custom DNS"

        read -r dns_choice
        case $dns_choice in
            1) dns1="8.8.8.8"; dns2="8.8.4.4";;
            2) dns1="1.1.1.1"; dns2="1.0.0.1";;
            3) dns1="208.67.222.222"; dns2="208.67.220.220";;
            4) dns1="9.9.9.9"; dns2="149.112.112.112";;
            5)
                echo "Enter primary DNS:"
                read -r dns1
                echo "Enter secondary DNS:"
                read -r dns2
                ;;
            *) echo "Invalid choice. Exiting."; return 1;;
        esac

        log "Changing DNS to $dns1 and $dns2..."

        # Get active connection name
        active_con=$(nmcli -t -f NAME c show --active | head -n 1)

        if [[ -z "$active_con" ]]; then
            log "No active connection found. Exiting."
            return 1
        fi

        # Apply DNS settings without reconnecting
        sudo nmcli con mod "$active_con" ipv4.dns "$dns1 $dns2"
        sudo nmcli networking off && sudo nmcli networking on  # Restart networking instead of reconnecting

        log "DNS updated successfully."
    else
        log "Skipping DNS change."
    fi
}

# Function: Run Everything in One Step
run_all_tasks() {
  log "🚀 Running all tasks in sequence..."

  manage_services
  install_packages
  install_kubuntu_extras
  update_hosts
  install_vscode_extensions
  change_dns
  optimize_system
  log "✅ All tasks completed!"
}

# Function: Show Main Menu
show_menu() {
  # Automatically clear screen before each function exits
  #   trap 'clear' EXIT

  CHOICE=$(dialog --title "CUTE Kubuntu Extras Script" --menu "Choose an action:" 20 60 7 \
    1 "Run All Tasks (Recommended)" \
    2 "Install packages" \
    3 "Install kubuntu extras" \
    4 "Update /etc/hosts" \
    5 "Install VS Code + Extensions" \
    6 "Optimize System" \
    7 "Exit" \
    3>&1 1>&2 2>&3)

  case $CHOICE in
    1) run_all_tasks ;;
    2) install_packages ;;
    3) install_kubuntu_extras ;;
    4) update_hosts ;;
    5) install_vscode_extensions ;;
    6) optimize_system ;;
    7)
      log "🚀 Exiting script."
      exit 0
      ;;
  esac
}

# Main Execution
log "🚀 Starting system CUTE utility script..."
install_package "dialog" # Ensure dialog is installed

show_menu
