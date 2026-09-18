# HormigasAIS – Edge Node & LBH Protocol

**Sovereign Edge Computing from Android/Termux**

[![Status](https://img.shields.io/badge/Status-Phase%201%20(Active)-blue)](https://github.com/Thrumanshow/apps-hormigasais)
[![Protocol](https://img.shields.io/badge/Protocol-LBH%20v0.1-green)](https://github.com/Thrumanshow/apps-hormigasais)
[![Platform](https://img.shields.io/badge/Platform-Android%20%2B%20Termux-orange)](https://termux.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

> Lightweight, authenticated edge infrastructure designed to run on constrained devices.
> Built from Android/Termux in San Miguel, El Salvador.

---

## Vision

HormigasAIS is an experimental sovereign edge-computing ecosystem.

The goal is to enable small autonomous agents and services that can operate locally, reducing dependence on heavy cloud infrastructure while remaining suitable for educational environments, laboratories, and small and medium-sized businesses.

This repository contains the **Phase 1** implementation:

- Edge Node
- LBH binary protocol
- Resilient PWA client
- Authenticated WebSocket communication
- Heartbeat and telemetry mechanisms

---

## Current Status – Phase 1

### Working

- Binary protocol **LBH** (Lenguaje Binario HormigasAIS)
- Python Edge Node (`servidor_lbh.py`)
- WebSocket server
- Client authentication
- Heartbeat / Feromona frame (`0x02`)
- Telemetry frame (`0x01`)
- Resilient Android/PWA client
- Automatic WebSocket reconnection
- Visibility-change recovery for mobile browsers
- Basic autonomous reactions on the node side

### Not finished

- Multi-sensor event delegation
- Persistent client-side state
- Formal multi-agent decision layer
- Packaging and distribution

> Phase 1 is an active development stage. Protocol details should be considered experimental unless confirmed by the implementation and corresponding tests.

---

## Architecture Overview

```text
┌───────────────────────────────────────┐
│             PWA Client                │
│          Android Browser              │
└───────────────────┬───────────────────┘
                    │
                    │ Authenticated WebSocket
                    │ LBH frames
                    ▼
┌───────────────────────────────────────┐
│              Edge Node                │
│            servidor_lbh.py             │
│                                       │
│  ├── Heartbeat / Feromona             │
│  ├── Telemetry                        │
│  └── Autonomous reactions             │
└───────────────────────────────────────┘
                    │
                    ▼
             Local network /
                localhost
```

The current implementation is designed to operate on the same device or within a local network.

---

## LBH Protocol – Phase 1

The Phase 1 implementation currently documents these protocol concepts:

| Field | Value |
|---|---|
| Magic bytes | `LA` (`0x4C 0x41`) |
| Type `0x01` | Telemetry |
| Type `0x02` | Heartbeat / Feromona |

The exact binary frame layout and frame length should be treated as implementation-defined until verified against the encoder, decoder, server, client, and automated tests.

This README intentionally avoids presenting an experimental frame description as a finalized specification.

---

## Quick Start – Termux

### 1. Requirements

Install the basic environment:

```bash
pkg update
pkg install python nodejs git
pip install websockets
```

If the project later defines a pinned dependency file, prefer that file over manually installing packages.

### 2. Clone the repository

```bash
git clone https://github.com/Thrumanshow/apps-hormigasais.git
cd apps-hormigasais
```

### 3. Start the Edge Node

```bash
python servidor_lbh.py
```

The exact startup message depends on the current implementation. The server is expected to listen on port `8765` when configured that way.

### 4. Connect the PWA

The client can connect locally to:

```text
ws://localhost:8765
```

When connecting from another device on the local network, use the Edge Node's local network address instead of `localhost`.

---

## Project Structure

```text
apps-hormigasais/
├── servidor_lbh.py
├── index.html
├── assets/
│   └── js/
│       └── lbh-heartbeat-ant.js
├── README.md
└── _tmp/
```

`_tmp/` is intended for temporary local files and should not be part of a published release artifact. Consider adding it to `.gitignore`.

---

## Roadmap

### Phase 1 – Foundation

- [x] Binary LBH protocol
- [x] Authenticated WebSocket
- [x] Heartbeat
- [x] Telemetry
- [x] Android background resilience
- [x] Basic autonomous reaction

### Phase 2 – Usability

- [x] Event delegation
- [x] Multiple sensors and controls
- [x] Persistent local state
- [ ] Improved PWA packaging

### Phase 3 – Agents & Services

- [ ] Injectable agents for educational institutions
- [ ] University and SME/Pyme integrations
- [ ] Formal decision layer
- [ ] Documentation and examples

> This roadmap is a living document and may evolve as the implementation develops.

---

## Design Principles

1. **Sovereignty first** – Prefer infrastructure that can run on devices under the operator's control.
2. **Constrained by design** – The system should remain practical on Android and Termux.
3. **Honest status** – Clearly distinguish working features from experimental features.
4. **Incremental development** – Each phase should provide a usable foundation for the next.
5. **Auditable infrastructure** – Protocol and runtime behavior should be verifiable from source code and tests.

---

## Contributing

This is currently a single-maintainer project. Technical feedback, issues, and discussions are welcome.

For substantial changes, please open an Issue before submitting a large pull request.

---

## Author

**Cristhiam Leonardo Hernández Quiñonez (CLHQ)**
Founder – HormigasAIS
San Miguel, El Salvador
GitHub: [Thrumanshow](https://github.com/Thrumanshow)
Project: [hormigasais.com](https://hormigasais.com)

---

## License

MIT License – see [LICENSE](LICENSE).

---

*Phase 1 – Built and tested from Termux on Android.*
*Nodo A16 · San Miguel, El Salvador*
