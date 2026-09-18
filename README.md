# HormigasAIS – Edge Node & LBH Protocol

**Sovereign Edge Computing from Android/Termux**

[![Status](https://img.shields.io/badge/Status-Phase%201%20(Active)-blue)]()
[![Protocol](https://img.shields.io/badge/Protocol-LBH%20v0.1-green)]()
[![Platform](https://img.shields.io/badge/Platform-Android%20%2B%20Termux-orange)]()
[![License](https://img.shields.io/badge/License-MIT-yellow)]()

> Lightweight, authenticated edge infrastructure designed to run on constrained devices.  
> Built entirely from a phone in San Miguel, El Salvador.

---

## Vision

HormigasAIS is an experimental sovereign edge computing ecosystem.  
The goal is to enable small, autonomous agents and services that can operate without heavy cloud dependency — suitable for educational environments, laboratories, and small/medium businesses (Pymes).

This repository contains the **Phase 1** implementation: a working Edge Node + binary protocol (LBH) + resilient PWA client.

---

## Current Status – Phase 1

**What is working today:**

- Binary protocol **LBH** (Lenguaje Binario HormigasAIS)
- Edge Node written in Python (`servidor_lbh.py`)
- WebSocket server on port `8765`
- Client authentication
- Heartbeat system (“Feromona” 0x02)
- Telemetry frames (0x01)
- Resilient Android/PWA client with automatic reconnection
- Visibility change recovery (handles Android background killing)
- Basic autonomous reaction on the node side

**What is intentionally not finished yet:**
- Multi-sensor event delegation
- Persistent local state (`localStorage`)
- Formal multi-agent decision layer
- Packaging & distribution

This is an active Phase 1. The foundation is stable enough to build upon.

---

## Architecture Overview


[ PWA Client (Android Browser) ]
│
│  WebSocket (authenticated)
│  Binary LBH frames
▼
[ Edge Node – servidor_lbh.py ]
│
├── Heartbeat / Feromona (0x02)
├── Telemetry (0x01)
└── Simple autonomous reactions

Everything currently runs on the same device (localhost) or local network.

---

## LBH Protocol (Phase 1)

- **Magic bytes**: `LA` (0x4C 0x41)
- **Frame size**: 16 bytes
- **Type 0x01**: Telemetry (Sensor ID + Value + Timestamp)
- **Type 0x02**: Heartbeat / Feromona (keep-alive + standby signal)

The client sends periodic pheromone frames.  
The node replies with ACK and can trigger simple alerts.

---

## Quick Start (Termux)

### 1. Requirements

```bash
pkg update && pkg upgrade
pkg install python nodejs git
pip install websockets

2. Clone & Run the Edge Node
git clone [https://github.com/Thrumanshow/apps-hormigasais.git](https://github.com/Thrumanshow/apps-hormigasais.git)
cd apps-hormigasais

# Load secrets (create ~/.hormigas_secrets first)
source ~/.hormigas_secrets

python servidor_lbh.py

You should see:
🚀 Servidor Soberano LBH ejecutándose en ws://0.0.0.0:8765
   Magic: LA | Tipos: 0x01 (telemetría) · 0x02 (heartbeat)

3. Open the PWA
Serve the frontend (or open the HTML directly) and connect to:
ws://localhost:8765

Project Structure (Phase 1)
apps-hormigasais/
├── servidor_lbh.py              # Edge Node (Python)
├── assets/js/lbh-heartbeat-ant.js  # Resilient WebSocket client
├── index.html                   # Basic PWA interface
├── _tmp/                        # Temporary files / backups
└── README.md

Roadmap (Living Document)
Phase 1 – Foundation (Current)
 * [x] Binary LBH protocol
 * [x] Authenticated WebSocket
 * [x] Heartbeat + Telemetry
 * [x] Android background resilience
 * [x] Basic autonomous reaction
Phase 2 – Usability
 * [ ] Event delegation (multiple sensors/controls)
 * [ ] localStorage persistence
 * [ ] Better PWA packaging
Phase 3 – Agents & Services
 * [ ] Injectable agents for universities & Pymes
 * [ ] Formal decision layer
 * [ ] Documentation & examples
This roadmap will evolve. Nothing is set in stone.
Design Principles
 * Sovereignty first – Prefer running on the device you control.
 * Constrained by design – Must work well on Android + Termux.
 * Honest status – Clearly separate what works from what is experimental.
 * Incremental – Each phase must be usable before moving to the next.
Contributing
This is currently a single-maintainer project (Node A16).
Feedback, issues, and technical discussions are welcome.
For now, please open an Issue before submitting large changes.
Author
Cristhiam Leonardo Hernández Quiñonez (CLHQ)
Founder – HormigasAIS
San Miguel, El Salvador
 * GitHub: Thrumanshow
 * Project site: hormigasais.com
License
MIT License – see LICENSE file.
Phase 1 – Built and tested from Termux on Android.
Nodo A16 · San Miguel, El Salvador
