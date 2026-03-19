#!/bin/bash

echo "🔧 SSD Write Reduction Setup for Kubuntu"
echo "----------------------------------------"

# Must be root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root: sudo ./ssd-save.sh"
  exit 1
fi

### 1️⃣ Add noatime to fstab ###
echo "➡ Adding noatime to mounted filesystems..."

cp /etc/fstab /etc/fstab.backup

sed -i.bak '/ ext4 / s/defaults/defaults,noatime,nodiratime/g' /etc/fstab

echo "✅ fstab updated (backup saved as /etc/fstab.backup)"

### 2️⃣ Move systemd logs to RAM ###
echo "➡ Setting journald logs to RAM..."

JOURNAL_CONF="/etc/systemd/journald.conf"

if grep -q "^#Storage=" "$JOURNAL_CONF"; then
  sed -i 's/^#Storage=.*/Storage=volatile/' "$JOURNAL_CONF"
elif grep -q "^Storage=" "$JOURNAL_CONF"; then
  sed -i 's/^Storage=.*/Storage=volatile/' "$JOURNAL_CONF"
else
  echo "Storage=volatile" >> "$JOURNAL_CONF"
fi

systemctl restart systemd-journald
echo "✅ Logs now stored in RAM"

### 3️⃣ Mount /tmp as tmpfs ###
echo "➡ Moving /tmp to RAM..."

if ! grep -q "tmpfs /tmp" /etc/fstab; then
  echo "tmpfs /tmp tmpfs defaults,noatime,mode=1777 0 0" >> /etc/fstab
  echo "✅ /tmp will use RAM after reboot"
else
  echo "ℹ️ /tmp already configured"
fi

### 4️⃣ Reduce swap usage ###
echo "➡ Tuning swappiness..."

SYSCTL_CONF="/etc/sysctl.conf"

grep -q "vm.swappiness" $SYSCTL_CONF || echo "vm.swappiness=10" >> $SYSCTL_CONF
grep -q "vm.vfs_cache_pressure" $SYSCTL_CONF || echo "vm.vfs_cache_pressure=50" >> $SYSCTL_CONF

sysctl -p
echo "✅ Swap usage reduced"

### 5️⃣ Install and enable ZRAM ###
echo "➡ Installing ZRAM compressed RAM swap..."

apt update
apt install -y zram-tools

systemctl enable zramswap.service
systemctl start zramswap.service

echo "✅ ZRAM enabled"

### 6️⃣ Disable KDE file indexing (Baloo) ###
echo "➡ Disabling KDE file indexer (Baloo)..."

sudo -u "$SUDO_USER" balooctl disable 2>/dev/null

echo "✅ File indexing disabled"

echo ""
echo "🎉 All done!"
echo "⚠️ Reboot your system for all changes to apply."
echo ""
