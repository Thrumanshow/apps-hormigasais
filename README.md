# HormigasAIS – Edge Node & LBH Protocol

**Sovereign Edge Computing from Android/Termux**

[![Status](https://img.shields.io/badge/Status-Phase%203%20(Validated)-brightgreen)]()
[![Protocol](https://img.shields.io/badge/Protocol-LBH%2016--Byte-blue)]()
[![Platform](https://img.shields.io/badge/Platform-Android%20%2B%20Termux-orange)]()
[![License](https://img.shields.io/badge/License-MIT-yellow)]()

> Lightweight, authenticated edge infrastructure.  
> Built entirely from a phone in San Miguel, El Salvador.

---

## Vision

HormigasAIS is an experimental sovereign edge computing ecosystem focused on lightweight, authenticated and resource-efficient communication at the Edge.

**Current Status: Phase 3 — Nodo Edge LBH Validado**

- **Repository**: [apps-hormigasais](https://github.com/Thrumanshow/apps-hormigasais)
- **Node Identifier**: Nodo A16 (Soberano)
- **Specification DOI**: 10.5281/zenodo.17767205

---

## LBH Protocol – Phase 3 Specification (Validated)

Fixed **16-byte binary frame** optimized for low bandwidth and edge processing:

| Offset | Field    | Size | Type    | Description                          |
|--------|----------|------|---------|--------------------------------------|
| 0-1    | Magic    | 2B   | char[2] | LBH identifier (`LA` → `0x4C 0x41`) |
| 2      | Type     | 1B   | uint8   | `0x01` Telemetry / `0x02` Heartbeat |
| 3-4    | SensorID | 2B   | uint16  | Sensor ID (e.g. 1001, 1002, 1003)    |
| 5-8    | Value    | 4B   | int32   | Measured value                       |
| 9-12   | TS       | 4B   | uint32  | Unix UTC Timestamp                   |
| 13-15  | HMAC     | 3B   | uint24  | Truncated HMAC for authentication    |

- **Efficiency**: Fixed 16-byte payload vs 150-180 bytes of typical JSON.
- **Standard response**: `Respuesta LBH | NORMAL | Val: X`

---

## Performance & Benchmarks

- **LBH Payload**: 16 Bytes binary
- **Dashboard footprint**: Ultra-light (<48KB total)
- **Target FCP/TTFB**: <320ms on local / Edge network
- **Socket Resilience**: Connection preservation via 0x02 heartbeats + automatic reconnection

### Quick Start – Termux

```bash
cd ~/apps-hormigasais_clone/apps-hormigasais
pkill -f servidor_lbh.py 2>/dev/null || true
source ~/.hormigas_secrets
./start_nodo.sh
```

- **Dashboard PWA**: http://localhost:8080
- **WebSocket LBH**: ws://localhost:8765

---

## Architecture

```text
PWA Client (Multi-Sensor Grid)
  |
  | Authenticated WebSocket + LBH 16-Byte Frame
  v
Edge Node (servidor_lbh.py)
  +-- Heartbeat / Feromona (0x02)
  +-- Telemetry Multi-Sensor (0x01)
  +-- Autonomous Agent (Alerts)
```

---

## Roadmap

- [x] Phase 1 – Foundation: Binary LBH protocol, WebSocket server, Heartbeat & Telemetry
- [x] Phase 2 – Usability: Multi-sensor support, Event delegation, localStorage
- [x] Phase 3 – Validated Node: 16-Byte LBH frame, Token authentication, Nodo A16 deployment
- [ ] Phase 8 – Advanced Benchmarks: Full performance profiling and formal multi-agent rules

---

## Design Principles

- **Sovereignty First**: Infrastructure designed to run under the direct control of the operator.
- **Constrained by Design**: Optimized to run on Android/Termux without cloud dependency.
- **Local-First Execution**: Local processing and low latency.
- **Honest Status**: Real status verified through logs and auditable source code.

---

## Author

**Cristhiam Leonardo Hernández Quiñonez (CLHQ)**  
Founder & Protocol Architect — HormigasAIS  
San Miguel, El Salvador

- GitHub: [Thrumanshow](https://github.com/Thrumanshow)
- Website: [hormigasais.com](https://hormigasais.com)

---

## License

MIT License – see `LICENSE` file.

---
*Phase 3 Validated – Nodo A16 · San Miguel, El Salvador*
