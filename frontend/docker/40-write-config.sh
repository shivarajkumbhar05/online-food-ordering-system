#!/bin/sh
# Regenerate config.js from the API_BASE env var at container start.
cat > /usr/share/nginx/html/config.js <<JS
window.APP_CONFIG = { API_BASE: "${API_BASE:-https://online-food-ordering-system-1-7aka.onrender.com/api}" };
JS
