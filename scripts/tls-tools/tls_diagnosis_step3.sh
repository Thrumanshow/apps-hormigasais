#!/data/data/com.termux/files/usr/bin/bash

set -u

HOST="ws.a16.hormigasais.com"
PORT="443"

echo "============================================================"
echo "🐜 HormigasAIS :: Diagnóstico TLS — Paso 3"
echo "Host: $HOST"
echo "Objetivo: identificar capa que rechaza el handshake"
echo "============================================================"

echo
echo "[1/5] DNS"
echo "------------------------------------------------------------"
getent hosts "$HOST" 2>/dev/null || nslookup "$HOST" 2>/dev/null || true

echo
echo "[2/5] Cabeceras HTTP HTTPS"
echo "------------------------------------------------------------"
curl -4 -k -Ivs --connect-timeout 10 \
    "https://$HOST/" 2>&1 | \
    grep -E '^\* |^< |^> |SSL|TLS|HTTP|subject|issuer|error' || true

echo
echo "[3/5] OpenSSL TLS 1.2 con SNI"
echo "------------------------------------------------------------"
printf '\n' | openssl s_client \
    -connect "${HOST}:${PORT}" \
    -servername "$HOST" \
    -tls1_2 \
    -brief 2>&1 || true

echo
echo "[4/5] OpenSSL TLS 1.3 con SNI"
echo "------------------------------------------------------------"
printf '\n' | openssl s_client \
    -connect "${HOST}:${PORT}" \
    -servername "$HOST" \
    -tls1_3 \
    -brief 2>&1 || true

echo
echo "[5/5] WebSocket HTTPS endpoint"
echo "------------------------------------------------------------"
curl -4 -k -i \
    --connect-timeout 10 \
    --max-time 15 \
    -H "Connection: Upgrade" \
    -H "Upgrade: websocket" \
    -H "Sec-WebSocket-Version: 13" \
    -H "Sec-WebSocket-Key: SGVsbG9Ib3JtaWd1aXM=" \
    "https://${HOST}/" 2>&1 || true

echo
echo "============================================================"
echo "✅ Fin diagnóstico TLS — Paso 3"
echo "============================================================"
echo
echo "IMPORTANTE:"
echo "Este script NO modifica configuración."
echo "Envíame toda la lectura antes de ejecutar otro parche."
echo "============================================================"
