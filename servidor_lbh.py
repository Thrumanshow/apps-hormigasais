#!/usr/bin/env python3
"""
HormigasAIS - Servidor Soberano LBH (Nodo Edge A16)
Puerto: 8765 | Protocolo: LA (16 bytes)
Tipos: 0x01 = Telemetría | 0x02 = Feromona Heartbeat
"""

import asyncio
import os
import struct
import time
from websockets.asyncio.server import serve
from websockets.exceptions import ConnectionClosed

LBH_NODE_TOKEN = int(os.environ.get("LBH_NODE_TOKEN", "0") or "0", 16)
AUTH_TIMEOUT = 5  # segundos para recibir el frame de autenticación

async def handler(websocket):
    peer = websocket.remote_address
    print(f"📡 [Nodo Edge] Cliente conectado → {peer}", flush=True)

    if LBH_NODE_TOKEN:
        try:
            first = await asyncio.wait_for(websocket.recv(), timeout=AUTH_TIMEOUT)
        except (asyncio.TimeoutError, ConnectionClosed):
            print(f"🚫 [Auth] Sin frame de autenticación a tiempo → {peer}", flush=True)
            await websocket.close(code=4001, reason="auth timeout")
            return

        valid = False
        if isinstance(first, (bytes, bytearray)) and len(first) == 16:
            try:
                magic, tipo, flags, sensor_id, token, ts = struct.unpack(">2sBBIII", first)
                if magic == b"LA" and tipo == 0x03 and token == LBH_NODE_TOKEN:
                    valid = True
            except Exception:
                pass

        if not valid:
            print(f"🚫 [Auth] Token inválido → {peer}", flush=True)
            await websocket.close(code=4001, reason="unauthorized")
            return

        print(f"🔑 [Auth] Cliente autenticado → {peer}", flush=True)

    try:
        async for message in websocket:
            if not isinstance(message, (bytes, bytearray)) or len(message) != 16:
                print("⚠️  Trama inválida (tamaño ≠ 16)", flush=True)
                continue

            try:
                magic, tipo, flags, sensor_id, payload, ts = struct.unpack(">2sBBIII", message)
                magic_str = magic.decode("ascii", errors="ignore")
            except Exception as e:
                print(f"⚠️  Error unpack: {e}", flush=True)
                continue

            if magic_str != "LA":
                continue

            # ---------- Feromona Heartbeat / Standby (0x02) ----------
            if tipo == 0x02:
                ack = struct.pack(">2sBBIII", b"LA", 0x02, 0x00, 9999, 0, int(time.time()))
                await websocket.send(ack)
                print("❄️  Feromona 0x02 ACK (socket preservado)", flush=True)
                continue

            # ---------- Telemetría (0x01) ----------
            if tipo == 0x01:
                print(f"📥 Trama 0x01 | Sensor={sensor_id} | Val={payload} | TS={ts}", flush=True)

                alerta = 1 if payload > 500 else 0
                if alerta:
                    print(f"⚠️  [AGENTE AUTÓNOMO] Alerta Sensor {sensor_id} → Val={payload}", flush=True)

                respuesta = struct.pack(
                    ">2sBBIII",
                    b"LA",
                    0x01,
                    alerta,
                    sensor_id,
                    payload,
                    int(time.time())
                )
                await websocket.send(respuesta)
                print("📤 Respuesta LBH enviada\n", flush=True)

    except ConnectionClosed:
        print(f"🔌 Cliente desconectado → {peer}", flush=True)
    except Exception as e:
        print(f"❌ Error en handler: {e}", flush=True)

async def main():
    print("🚀 Servidor Soberano LBH ejecutándose en ws://0.0.0.0:8765", flush=True)
    print("   Magic: LA | Tipos: 0x01 (telemetría) · 0x02 (heartbeat)", flush=True)
    async with serve(handler, "0.0.0.0", 8765, ping_interval=25, ping_timeout=20):
        await asyncio.Future()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 Servidor detenido por el usuario", flush=True)
