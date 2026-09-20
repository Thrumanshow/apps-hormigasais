#!/data/data/com.termux/files/usr/bin/bash

set -u

HOST="ws.a16.hormigasais.com"
PORT="443"

echo "============================================================"
echo "🐜 HormigasAIS :: Diagnóstico TLS — Paso 2"
echo "Host: $HOST"
echo "============================================================"

echo
echo "[1/4] OpenSSL — información del handshake"
echo "------------------------------------------------------------"

openssl s_client \
  -connect "${HOST}:${PORT}" \
  -servername "${HOST}" \
  -showcerts \
  -state \
  -msg </dev/null 2>&1 || true

echo
echo "[2/4] OpenSSL — TLS 1.2 + SNI"
echo "------------------------------------------------------------"

openssl s_client \
  -connect "${HOST}:${PORT}" \
  -servername "${HOST}" \
  -tls1_2 \
  -brief </dev/null 2>&1 || true

echo
echo "[3/4] OpenSSL — TLS 1.3 + SNI"
echo "------------------------------------------------------------"

openssl s_client \
  -connect "${HOST}:${PORT}" \
  -servername "${HOST}" \
  -tls1_3 \
  -brief </dev/null 2>&1 || true

echo
echo "[4/4] curl — negociación TLS detallada"
echo "------------------------------------------------------------"

curl -vk \
  --http1.1 \
  --connect-timeout 10 \
  --max-time 15 \
  "https://${HOST}/" 2>&1 || true

echo
echo "============================================================"
echo "✅ Fin diagnóstico TLS — Paso 2"
echo "============================================================"
