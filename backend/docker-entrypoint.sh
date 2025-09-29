#!/bin/sh
set -e

style=$(printf '%s' "${LOG_ICON_STYLE:-auto}" | tr '[:upper:]' '[:lower:]')

ICON_FLAG='[UA]'
ICON_INFO='[INFO]'
ICON_WARN='[WARN]'
ICON_ERROR='[ERR]'
ICON_OK='[OK]'
ICON_START='[START]'

if [ -z "$style" ] || [ "$style" = "auto" ]; then
  if command -v tput >/dev/null 2>&1 && [ "$(tput colors 2>/dev/null || printf '0')" -ge 8 ]; then
    style='ansi'
  else
    style='squares'
  fi
fi

case "$style" in
  emoji|emoji*)
    ICON_FLAG='🇺🇦'
    ICON_INFO='ℹ️'
    ICON_WARN='⚠️'
    ICON_ERROR='❌'
    ICON_OK='✅'
    ICON_START='🚀'
    ;;
  squares|square)
    ICON_FLAG='🟦🟨'
    ICON_INFO='ℹ️'
    ICON_WARN='⚠️'
    ICON_ERROR='⛔'
    ICON_OK='✔️'
    ICON_START='🟦🟨'
    ;;
  ansi|color|colour)
    ICON_FLAG="$(printf '\033[48;5;26m  \033[0m\033[48;5;220m  \033[0m')"
    ICON_INFO="$(printf '\033[36mINFO\033[0m')"
    ICON_WARN="$(printf '\033[33mWARN\033[0m')"
    ICON_ERROR="$(printf '\033[31mERR\033[0m')"
    ICON_OK="$(printf '\033[32mOK\033[0m')"
    ICON_START="$(printf '\033[35mSTART\033[0m')"
    ;;
  text|ascii|plain)
    :
    ;;
  *)
    :
    ;;
esac

log_info() { printf "%s %s %s\n" "$ICON_FLAG" "$ICON_INFO" "$1"; }
log_warn() { printf "%s %s %s\n" "$ICON_FLAG" "$ICON_WARN" "$1"; }
log_error() { printf "%s %s %s\n" "$ICON_FLAG" "$ICON_ERROR" "$1"; }
log_ok() { printf "%s %s %s\n" "$ICON_FLAG" "$ICON_OK" "$1"; }
log_start() { printf "%s %s %s\n" "$ICON_FLAG" "$ICON_START" "$1"; }

if [ -z "$DATABASE_URL" ]; then
  log_warn 'DATABASE_URL is not set. Skipping migrations.'
else
  log_info 'Waiting for database and synchronizing schema...'
  RETRIES=20
  until npx prisma db push --skip-generate >/tmp/prisma.log 2>&1; do
    RETRIES=$((RETRIES - 1))
    if [ "$RETRIES" -le 0 ]; then
      log_error 'Prisma db push failed after multiple attempts:'
      cat /tmp/prisma.log
      exit 1
    fi
    sleep 3
  done
  log_ok 'Database schema up to date.'
  cat /tmp/prisma.log
  rm /tmp/prisma.log
fi

log_start 'Starting application...'
exec "$@"
