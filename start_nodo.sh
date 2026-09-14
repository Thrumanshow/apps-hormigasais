#!/data/data/com.termux/files/usr/bin/bash
# HormigasAIS - Arranque limpio del Nodo Edge A16

DIR="$HOME/apps-hormigasais_clone/apps-hormigasais"
cd "$DIR" || { echo "❌ No se encontró el directorio $DIR"; exit 1; }

echo "🐜 HormigasAIS · Nodo A16 · San Miguel"
echo "----------------------------------------"

# Matar procesos anteriores
echo "🧹 Limpiando puertos 8080 y 8765..."
fuser -k 8080/tcp 8765/tcp 2>/dev/null
pkill -f "http.server|servidor_lbh.py" 2>/dev/null
sleep 1

# Verificar que websockets esté instalado
python3 -c "import websockets" 2>/dev/null || {
  echo "📦 Instalando websockets..."
  pip install websockets --quiet
}

# Arrancar servidor LBH
echo "🚀 Iniciando servidor LBH (ws://0.0.0.0:8765)..."
nohup python3 servidor_lbh.py > lbh.log 2>&1 &
LBH_PID=$!

# Arrancar servidor estático
echo "🌐 Iniciando HTTP estático (http://0.0.0.0:8080)..."
nohup python3 -m http.server 8080 > http.log 2>&1 &
HTTP_PID=$!

sleep 1

echo ""
echo "✅ Nodo A16 operativo"
echo "   WebSocket → ws://localhost:8765  (PID $LBH_PID)"
echo "   HTTP      → http://localhost:8080 (PID $HTTP_PID)"
echo "   Logs      → lbh.log  |  http.log"
echo ""
echo "Para detener:  ./stop_nodo.sh   o   fuser -k 8080/tcp 8765/tcp"
echo "----------------------------------------"
