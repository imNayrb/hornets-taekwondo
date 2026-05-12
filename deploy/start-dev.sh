#!/usr/bin/env bash
# Start the mobile-friendly dev environment.
# Both the desktop browser and phone must be on the same Wi-Fi network.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Detect local network IP ───────────────────────────────────
detect_ip() {
  # Try common methods in order; fall back to localhost
  local ip=""

  if command -v ip &>/dev/null; then
    ip=$(ip route get 1.1.1.1 2>/dev/null | awk '/src/{print $NF; exit}')
  fi

  if [[ -z "$ip" ]] && command -v ipconfig &>/dev/null; then
    # macOS
    ip=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true)
  fi

  if [[ -z "$ip" ]]; then
    ip=$(hostname -I 2>/dev/null | awk '{print $1}' || true)
  fi

  echo "${ip:-localhost}"
}

LOCAL_IP="${LOCAL_IP:-$(detect_ip)}"
export LOCAL_IP

echo ""
echo "┌─────────────────────────────────────────────────────┐"
echo "│        Hornets Taekwondo — Dev (mobile) mode        │"
echo "├─────────────────────────────────────────────────────┤"
printf "│  Local IP   : %-38s│\n" "$LOCAL_IP"
printf "│  Desktop    : http://%-31s│\n" "localhost"
printf "│  Phone      : http://%-31s│\n" "$LOCAL_IP"
echo "│                                                     │"
echo "│  Make sure your phone is on the same Wi-Fi network. │"
echo "└─────────────────────────────────────────────────────┘"
echo ""

docker compose \
  -f "$SCRIPT_DIR/docker-compose.dev.yml" \
  up --build "$@"
