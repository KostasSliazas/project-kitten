#!/bin/bash
# Kubuntu System Utility Script
# Author: Kostas Šliažas
# License: MIT

# ==========================================
# Strict Mode
# ==========================================
set -Eeuo pipefail
IFS=$'\n\t'

# ==========================================
# Prevent Multiple Instances
# ==========================================
LOCKFILE="/tmp/kubuntu_utility.lock"

if [[ -e "$LOCKFILE" ]]; then
  echo "Another instance is already running."
  exit 1
fi

touch "$LOCKFILE"
trap 'rm -f "$LOCKFILE"; clear; echo "Interrupted."; exit' INT TERM EXIT

# ==========================================
# Root Check
# ==========================================
if [[ $EUID -ne 0 ]]; then
  clear
  echo "Please run with sudo:"
  echo "sudo $0"
  exit 1
fi

# ==========================================
# Install dialog if missing
# ==========================================
if ! command -v dialog >/dev/null 2>&1; then
  apt update -qq
  apt install -y dialog
fi

# ==========================================
# Required Commands
# ==========================================
required_commands=(
  dialog
  systemctl
  nmcli
  curl
  grep
  sed
)

for cmd in "${required_commands[@]}"; do
  command -v "$cmd" >/dev/null 2>&1 || {
    echo "Missing dependency: $cmd"
    exit 1
  }
done

# ==========================================
# Colors
# ==========================================
GREEN="\e[32m"
YELLOW="\e[33m"
RED="\e[31m"
CYAN="\e[36m"
RESET="\e[0m"

# ==========================================
# Logging
# ==========================================
LOGFILE="/var/log/system_utility.log"

touch "$LOGFILE" 2>/dev/null || LOGFILE="$HOME/system_utility.log"

# ==========================================
# Real User Detection
# ==========================================
REAL_USER="${SUDO_USER:-$(logname)}"

# ==========================================
# APT Update Cache
# ==========================================
APT_UPDATED=false

apt_update_once() {
  if [[ "$APT_UPDATED" == false ]]; then
    log "Updating package lists..."
    apt update -qq
    APT_UPDATED=true
  fi
}

# ==========================================
# Logging Function
# ==========================================
log() {
  local message="$1"
  local timestamp
  timestamp="$(date '+%Y-%m-%d %H:%M:%S')"

  local clean_message
  clean_message=$(echo -e "$message" | sed 's/\x1b\[[0-9;]*m//g')

  echo -e "${GREEN}${timestamp} ${message}${RESET}"
  echo "${timestamp} ${clean_message}" >>"$LOGFILE" 2>/dev/null || true
}

# ==========================================
# VS Code Extensions
# ==========================================
extensions=(
  "ms-python.python"
  "esbenp.prettier-vscode"
  "ritwickdey.LiveServer"
  "streetsidesoftware.code-spell-checker"
  "stylelint.vscode-stylelint"
  "redhat.vscode-yaml"
  "ms-vsliveshare.vsliveshare"
  "VisualStudioExptTeam.vscodeintellicode"
)

# ==========================================
# Apps
# ==========================================
apps=(

  # --------------------------------------
  # Essentials
  # --------------------------------------

  # Download tool for HTTP/HTTPS requests
  "curl"

  # File downloader
  "wget"

  # Git version control system
  "git"

  # Interactive process viewer
  "htop"

  # Modern system monitor
  "btop"

  # Fast system information fetcher
  "fastfetch"

  # Legacy networking tools
  "net-tools"

  # Firewall management utility
  "ufw"

  # --------------------------------------
  # Multimedia / Codecs
  # --------------------------------------

  # Extra multimedia codecs
  "kubuntu-restricted-extras"

  # Additional FFmpeg codecs
  "libavcodec-extra"

  # VLC media player
  "vlc"

  # Lightweight media player
  "mpv"

  # --------------------------------------
  # Browsers
  # --------------------------------------

  # Firefox web browser
  "firefox"

  # Chromium browser (Snap package on Ubuntu)
  # "chromium"

  # --------------------------------------
  # Graphics / Photography
  # --------------------------------------

  # Image editor
  "gimp"

  # Digital painting app
  "krita"

  # Vector graphics editor
  "inkscape"

  # RAW photo editor
  "darktable"

  # JPEG optimizer
  "jpegoptim"

  # PNG optimizer
  "pngquant"

  # Metadata utility
  "exiv2"

  # EXIF metadata toolkit
  "libimage-exiftool-perl"

  # --------------------------------------
  # Disk / File Utilities
  # --------------------------------------

  # Disk management utility
  "gnome-disk-utility"

  # KDE partition manager
  "partitionmanager"

  # Modern exFAT support
  "exfatprogs"

  # --------------------------------------
  # Downloads / Transfers
  # --------------------------------------

  # KDE download manager
  "kget"

  # BitTorrent CLI client
  "transmission-cli"

  # --------------------------------------
  # Audio
  # --------------------------------------

  # Modern music player
  "strawberry"

  # --------------------------------------
  # System Utilities
  # --------------------------------------

  # System restore snapshots
  "timeshift"

  # System cleanup utility
  "bleachbit"

  # --------------------------------------
  # Optional Utilities
  # --------------------------------------

  # Image compression GUI
  "trimage"

  # Screen recording / streaming
  "obs-studio"

  # --------------------------------------
  # Security
  # --------------------------------------

  # Antivirus scanner
  "clamav"

  # --------------------------------------
  # KDE Utilities
  # --------------------------------------

  # KDE text editor
  "kate"

  # Dolphin file manager plugins
  "dolphin-plugins"
)

# ==========================================
# Services
# ==========================================
services_to_disable=(
  "bluetooth"
  "apache2"
  "nginx"
  "mysql"
  "docker"
  "cups"
)

# ==========================================
# Domains
# ==========================================
BLOCKED_DOMAINS=(
  "doubleclick.net"
  "g.doubleclick.net"
  "track.adnxs.com"
  "ads.yieldmanager.com"
  "trackmyads.com"
  "phishing-host.com"
  "malwarehost.com"
  "unsafe-surf.com"
  "loto.lt"
)

# ==========================================
# Install Package
# ==========================================
install_package() {
  local pkg="$1"

  if ! dpkg-query -W -f='${Status}' "$pkg" 2>/dev/null | grep -q "install ok installed"; then
    log "Installing $pkg..."

    apt_update_once

    if DEBIAN_FRONTEND=noninteractive apt install -y "$pkg" >/dev/null 2>&1; then
      log "✅ $pkg installed."
    else
      log "⚠️ Failed to install $pkg."
    fi
  else
    log "✅ $pkg already installed."
  fi
}

# ==========================================
# Disable Service
# ==========================================
disable_service() {
  local service_name="$1"

  if systemctl list-unit-files | grep -q "^${service_name}\.service"; then
    log "Disabling $service_name..."

    systemctl stop "$service_name" >/dev/null 2>&1 || true
    systemctl disable "$service_name" >/dev/null 2>&1 || true

    log "✅ $service_name disabled."
  else
    log "⚠️ $service_name not found."
  fi
}

# ==========================================
# Install Packages
# ==========================================
install_packages() {

  local options=()

  for app in "${apps[@]}"; do
    options+=("$app" "" off)
  done

  local selected

  selected=$(dialog \
    --separate-output \
    --checklist "Select packages to install:" \
    22 60 16 \
    "${options[@]}" \
    2>&1 >/dev/tty)

  clear

  [[ -z "$selected" ]] && {
    log "No packages selected."
    return
  }

  while read -r pkg; do
    [[ -n "$pkg" ]] && install_package "$pkg"
  done <<< "$selected"

  dialog --msgbox "Package installation completed." 6 50
}

# ==========================================
# Flush DNS
# ==========================================
flush_dns_cache() {

  for svc in nscd systemd-resolved dnsmasq; do
    if systemctl list-unit-files | grep -q "^${svc}\.service"; then
      systemctl restart "$svc" || true
      log "DNS cache flushed via $svc"
      return
    fi
  done

  log "No DNS cache service found."
}

# ==========================================
# Cleanup / Interrupt Handling
# ==========================================
cleanup() {
  rm -f "$LOCKFILE"
}

interrupt_handler() {
  cleanup
  clear
  echo "Interrupted."
  exit 1
}

trap cleanup EXIT
trap interrupt_handler INT TERM

# ==========================================
# Domains
# ==========================================
BLOCKED_DOMAINS=(

  # Advertising / Tracking
  "doubleclick.net"
  "g.doubleclick.net"
  "ads.yieldmanager.com"
  "track.adnxs.com"
  "trackmyads.com"

  # Malware / Phishing Examples
  "phishing-host.com"
  "malwarehost.com"
  "unsafe-surf.com"

  # Optional
  "loto.lt"
)

# ==========================================
# Flush DNS Cache
# ==========================================
flush_dns_cache() {

  for svc in nscd systemd-resolved dnsmasq; do

    if systemctl list-unit-files | grep -q "^${svc}\.service"; then

      systemctl restart "$svc" >/dev/null 2>&1 || true

      log "DNS cache flushed via $svc"

      return
    fi
  done

  log "No DNS cache service found."
}

# ==========================================
# Select Domains
# ==========================================
select_domains() {

  local options=()

  for domain in "${BLOCKED_DOMAINS[@]}"; do
    options+=("$domain" "" on)
  done

  local selected

  selected=$(dialog \
    --separate-output \
    --checklist "Select domains:" \
    22 76 16 \
    "${options[@]}" \
    2>&1 >/dev/tty)

  clear

  [[ -z "$selected" ]] && return 1

  mapfile -t SELECTED_DOMAINS <<< "$selected"

  return 0
}

# ==========================================
# Block Domains
# ==========================================
block_domains() {

  select_domains || return

  [[ ${#SELECTED_DOMAINS[@]} -eq 0 ]] && return

  local backup="/etc/hosts.bak.$(date +%F_%H-%M-%S)"

  cp /etc/hosts "$backup"

  log "Hosts backup created: $backup"

  for domain in "${SELECTED_DOMAINS[@]}"; do

    # Validate domain format
    if ! [[ "$domain" =~ ^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
      log "⚠️ Invalid domain skipped: $domain"
      continue
    fi

    # Exact duplicate check
    if grep -qE \
      "^[[:space:]]*0\.0\.0\.0[[:space:]]+(www\.)?$domain([[:space:]]|$)" \
      /etc/hosts; then

      log "Already blocked: $domain"
      continue
    fi

    echo "0.0.0.0 $domain" >> /etc/hosts

    # Avoid double www.www.domain
    if [[ "$domain" != www.* ]]; then
      echo "0.0.0.0 www.$domain" >> /etc/hosts
    fi

    log "Blocked: $domain"
  done

  flush_dns_cache

  dialog --msgbox "Selected domains blocked successfully." 7 55
}

# ==========================================
# Unblock Domains
# ==========================================
unblock_domains() {

  select_domains || return

  [[ ${#SELECTED_DOMAINS[@]} -eq 0 ]] && return

  local backup="/etc/hosts.bak.$(date +%F_%H-%M-%S)"
  cp /etc/hosts "$backup"

  log "Backup created: $backup"

  for domain in "${SELECTED_DOMAINS[@]}"; do

    # Remove ALL variants safely
    sed -i "/0\.0\.0\.0[[:space:]]\+${domain}[[:space:]]*$/d" /etc/hosts
    sed -i "/0\.0\.0\.0[[:space:]]\+www\.${domain}[[:space:]]*$/d" /etc/hosts

    log "Unblocked: $domain"
  done

  flush_dns_cache

  dialog --msgbox "Domains unblocked successfully." 6 50
}

# ==========================================
# Domain Management Menu
# ==========================================
manage_domains() {

  local choice

  choice=$(dialog \
    --clear \
    --title "Domain Management" \
    --menu "Choose action:" \
    15 55 6 \
    1 "Block Domains" \
    2 "Unblock Domains" \
    3 "Back" \
    3>&1 1>&2 2>&3)

  clear

  case "$choice" in
    1)
      block_domains
      ;;
    2)
      unblock_domains
      ;;
    *)
      return
      ;;
  esac
}

# ==========================================
# Update Hosts
# ==========================================
update_hosts() {

  select_domains

  [[ ${#SELECTED_DOMAINS[@]:-0} -eq 0 ]] && return

  cp /etc/hosts "/etc/hosts.bak.$(date +%F_%T)"

  for domain in "${SELECTED_DOMAINS[@]}"; do

    if ! grep -q "$domain" /etc/hosts; then
      echo "127.0.0.1 $domain" >> /etc/hosts
      echo "127.0.0.1 www.$domain" >> /etc/hosts
      log "Blocked: $domain"
    else
      log "Already blocked: $domain"
    fi
  done

  flush_dns_cache

  dialog --msgbox "Selected domains blocked." 6 50
}

# ==========================================
# Install VS Code
# ==========================================
install_vscode() {

  if command -v code >/dev/null 2>&1; then
    log "VS Code already installed."
    return
  fi

  log "Installing Visual Studio Code..."

  apt_update_once

  apt install -y wget gpg apt-transport-https >/dev/null 2>&1

  curl -fsSL https://packages.microsoft.com/keys/microsoft.asc \
    | gpg --dearmor \
    > /usr/share/keyrings/microsoft-archive-keyring.gpg

  echo "deb [arch=amd64 signed-by=/usr/share/keyrings/microsoft-archive-keyring.gpg] https://packages.microsoft.com/repos/vscode stable main" \
    > /etc/apt/sources.list.d/vscode.list

  apt_update_once

  if DEBIAN_FRONTEND=noninteractive apt install -y code >/dev/null 2>&1; then
    log "✅ VS Code installed."
  else
    log "⚠️ VS Code installation failed."
  fi
}

# ==========================================
# Install Extensions
# ==========================================
install_vscode_extensions() {

  dialog --yesno "Install Visual Studio Code?" 8 50

  [[ $? -ne 0 ]] && return

  install_vscode

  command -v code >/dev/null 2>&1 || {
    log "VS Code not found."
    return
  }

  local checkboxes=()

  for ext in "${extensions[@]}"; do
    checkboxes+=("$ext" "$ext" off)
  done

  local selected_extensions

  selected_extensions=$(dialog \
    --title "VS Code Extensions" \
    --separate-output \
    --checklist "Select extensions:" \
    20 70 15 \
    "${checkboxes[@]}" \
    2>&1 >/dev/tty)

  clear

  [[ -z "$selected_extensions" ]] && return

  while read -r ext; do

    local attempts=0

    while (( attempts < 3 )); do

      log "Installing extension: $ext"

      if code \
        --user-data-dir="/home/$REAL_USER/.vscode-data" \
        --install-extension "$ext" \
        --force >/dev/null 2>&1; then

        log "✅ Installed: $ext"
        break

      else
        attempts=$((attempts + 1))
        log "Retrying $ext..."
        sleep 5
      fi
    done

  done <<< "$selected_extensions"

  dialog --msgbox "VS Code extensions installed." 6 50
}

# ==========================================
# Change DNS
# ==========================================
change_dns() {

  local choice
  local dns1
  local dns2

  choice=$(dialog \
    --menu "Select DNS provider:" \
    15 50 5 \
    1 "Google" \
    2 "Cloudflare" \
    3 "OpenDNS" \
    4 "Quad9" \
    2>&1 >/dev/tty)

  case "$choice" in
    1)
      dns1="8.8.8.8"
      dns2="8.8.4.4"
      ;;
    2)
      dns1="1.1.1.1"
      dns2="1.0.0.1"
      ;;
    3)
      dns1="208.67.222.222"
      dns2="208.67.220.220"
      ;;
    4)
      dns1="9.9.9.9"
      dns2="149.112.112.112"
      ;;
    *)
      return
      ;;
  esac

  local active
  active=$(nmcli -t -f NAME c show --active | head -n1)

  [[ -z "$active" ]] && {
    dialog --msgbox "No active network connection found." 6 50
    return
  }

  nmcli con mod "$active" ipv4.dns "$dns1 $dns2"

  nmcli con down "$active" >/dev/null 2>&1 || true
  nmcli con up "$active" >/dev/null 2>&1 || true

  dialog --msgbox "DNS updated successfully." 6 40
}

# ==========================================
# Disable KDE Sounds
# ==========================================
disable_kde_sounds() {

  kwriteconfig5 \
    --file kdeglobals \
    --group Sounds \
    --key Enable false

  kwriteconfig5 \
    --file kdeglobals \
    --group Notifications \
    --key PopupSounds false

  kquitapp5 plasmashell >/dev/null 2>&1 || true
  kstart5 plasmashell >/dev/null 2>&1 &

  dialog --msgbox "KDE sounds disabled." 6 40
}

# ==========================================
# Optimize System
# ==========================================
optimize_system() {

  log "Optimizing system..."

  apt autoremove -y >/dev/null 2>&1 || true
  apt autoclean -y >/dev/null 2>&1 || true

  log "Optimization completed."

  df -h | tee -a "$LOGFILE"
  free -h | tee -a "$LOGFILE"
}

# ==========================================
# SSD Optimization
# ==========================================
ssd_write_reduction_setup() {

  dialog --yesno "Apply SSD optimizations?" 8 50

  [[ $? -ne 0 ]] && return

  log "Starting SSD optimization..."

  cp /etc/fstab "/etc/fstab.backup.$(date +%F_%T)"
  cp /etc/systemd/journald.conf \
    "/etc/systemd/journald.conf.backup.$(date +%F_%T)"

  sed -i '/ ext4 / {
    /noatime/! s/defaults/defaults,noatime,nodiratime/
  }' /etc/fstab

  if grep -q "^#Storage=" /etc/systemd/journald.conf; then
    sed -i 's/^#Storage=.*/Storage=volatile/' \
      /etc/systemd/journald.conf
  elif grep -q "^Storage=" /etc/systemd/journald.conf; then
    sed -i 's/^Storage=.*/Storage=volatile/' \
      /etc/systemd/journald.conf
  else
    echo "Storage=volatile" >> /etc/systemd/journald.conf
  fi

  systemctl restart systemd-journald || true

  TOTAL_RAM=$(free -m | awk '/^Mem:/{print $2}')

  if (( TOTAL_RAM >= 4000 )); then

    if ! grep -q "^tmpfs /tmp" /etc/fstab; then
      echo "tmpfs /tmp tmpfs defaults,noatime,mode=1777 0 0" \
        >> /etc/fstab
    fi

  else
    log "Low RAM detected. Skipping tmpfs /tmp."
  fi

  grep -q "^vm.swappiness=" /etc/sysctl.conf || \
    echo "vm.swappiness=10" >> /etc/sysctl.conf

  grep -q "^vm.vfs_cache_pressure=" /etc/sysctl.conf || \
    echo "vm.vfs_cache_pressure=50" >> /etc/sysctl.conf

  sysctl -p >/dev/null 2>&1 || true

  install_package "zram-tools"

  systemctl enable fstrim.timer >/dev/null 2>&1 || true
  systemctl start fstrim.timer >/dev/null 2>&1 || true

  sudo -u "$REAL_USER" balooctl disable >/dev/null 2>&1 || true

  log "SSD optimization completed."

  dialog --msgbox \
    "SSD optimizations applied.\nReboot recommended." \
    8 50
}

# ==========================================
# Manage Services
# ==========================================
manage_services() {

  local options=()

  for svc in "${services_to_disable[@]}"; do
    options+=("$svc" "$svc" off)
  done

  local selected

  selected=$(dialog \
    --separate-output \
    --checklist "Disable services:" \
    20 70 15 \
    "${options[@]}" \
    2>&1 >/dev/tty)

  clear

  [[ -z "$selected" ]] && return

  while read -r svc; do
    [[ -n "$svc" ]] && disable_service "$svc"
  done <<< "$selected"

  dialog --msgbox "Service management completed." 6 50
}

# ==========================================
# Run All Tasks
# ==========================================
run_all_tasks() {

  local tasks=(
    "manage_services"
    "install_packages"
    "manage_domains"
    "install_vscode_extensions"
    "change_dns"
    "optimize_system"
    "disable_kde_sounds"
    "ssd_write_reduction_setup"
  )

  local total=${#tasks[@]}

  exec 3> >(dialog \
    --title "Running Tasks" \
    --gauge "Starting..." \
    10 60 0)

  for i in "${!tasks[@]}"; do

    local percent=$(( (i + 1) * 100 / total ))

    echo "XXX" >&3
    echo "$percent" >&3
    echo "Running ${tasks[i]}..." >&3
    echo "XXX" >&3

    "${tasks[i]}"

    sleep 0.2
  done

  exec 3>&-

  dialog --msgbox "All tasks completed." 6 50
}

# ==========================================
# Main Menu
# ==========================================
show_menu() {

  while true; do

    CHOICE=$(dialog \
      --clear \
      --title "Kubuntu Utility" \
      --menu "Choose action:" \
      18 60 10 \
      1 "Run All Tasks" \
      2 "Install Packages" \
      3 "Manage Blocked Websites" \
      4 "Change DNS" \
      5 "Install VS Code + Extensions" \
      6 "Optimize System" \
      7 "Disable KDE Sounds" \
      8 "SSD Write Reduction" \
      9 "Manage Services" \
      10 "Exit" \
      3>&1 1>&2 2>&3)

    [[ $? -ne 0 ]] && {
      clear
      exit
    }

    case "$CHOICE" in
      1) run_all_tasks ;;
      2) install_packages ;;
      3) manage_domains ;;
      4) change_dns ;;
      5) install_vscode_extensions ;;
      6) optimize_system ;;
      7) disable_kde_sounds ;;
      8) ssd_write_reduction_setup ;;
      9) manage_services ;;
      10)
        log "Exiting..."
        clear
        exit
        ;;
    esac
  done
}

# ==========================================
# Start
# ==========================================
log "Starting Kubuntu Utility Script..."
show_menu
