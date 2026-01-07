#!/usr/bin/env bash
set -euo pipefail

INDEX_FILE="${1:-dist/index.html}"
SITE_NAME="${SEO_SITE_NAME:-}"
CITY_DESC="${SEO_CITY_DESC:-}"

if [ -z "$SITE_NAME" ]; then
  SITE_NAME="Ansião Seguros"
fi

if [ -z "$CITY_DESC" ]; then
  CITY_DESC="Ansião (Leiria)"
fi

if [ ! -f "$INDEX_FILE" ]; then
  echo "index.html not found at $INDEX_FILE; skipping SEO meta update"
  exit 0
fi

FULL_DESC="$SITE_NAME — Seguros Auto, Vida, Saúde, Habitação e soluções empresariais em $CITY_DESC. Simulações e propostas personalizadas."

sed -i "s|<title>.*</title>|<title>$SITE_NAME</title>|" "$INDEX_FILE"
sed -i "s|<meta name=\"description\" content=\".*\" />|<meta name=\"description\" content=\"$FULL_DESC\" />|" "$INDEX_FILE"
sed -i "s|<meta property=\"og:site_name\" content=\".*\" />|<meta property=\"og:site_name\" content=\"$SITE_NAME\" />|" "$INDEX_FILE"
sed -i "s|<meta property=\"og:title\" content=\".*\" />|<meta property=\"og:title\" content=\"$SITE_NAME\" />|" "$INDEX_FILE"
sed -i "s|<meta property=\"og:description\" content=\".*\" />|<meta property=\"og:description\" content=\"$FULL_DESC\" />|" "$INDEX_FILE"
sed -i "s|<meta name=\"twitter:title\" content=\".*\" />|<meta name=\"twitter:title\" content=\"$SITE_NAME\" />|" "$INDEX_FILE"
sed -i "s|<meta name=\"twitter:description\" content=\".*\" />|<meta name=\"twitter:description\" content=\"$FULL_DESC\" />|" "$INDEX_FILE"
