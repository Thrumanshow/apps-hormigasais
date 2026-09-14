#!/data/data/com.termux/files/usr/bin/bash
echo "🛑 Deteniendo Nodo A16..."
fuser -k 8080/tcp 8765/tcp 2>/dev/null
pkill -f "http.server|servidor_lbh.py" 2>/dev/null
echo "✅ Nodo detenido"
