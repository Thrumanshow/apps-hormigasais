/**
 * HormigasAIS - Hormiga Centinela LBH
 * Arquitectura Balanceada Feromonal (v3 limpia)
 */
class LBHHeartbeatAnt {
  constructor(options = {}) {
    this.wsUrl = options.wsUrl || `ws://${location.hostname}:8765`;
    this.heartbeatIntervalMs = options.heartbeatIntervalMs || 25000; // 25 s
    this.inactivityLimitMs = options.inactivityLimitMs || 30000;    // 30 s
    this.ws = null;
    this.heartbeatTimer = null;
    this.reconnectTimer = null;
    this.lastUserActivity = Date.now();
    this.state = "OFFLINE";
    this.onStateChange = options.onStateChange || null;
    this.onMessage = options.onMessage || null;
    this._intentionalClose = false;
    this._closingRetry = null;
    this.authToken = options.authToken || null;
  }

  init() {
    this.connect();
    this.setupUserActivityListeners();
    this.setupVisibilityListener();
  }

  connect() {
    if (this.ws) {
      const state = this.ws.readyState;
      if (state === WebSocket.OPEN || state === WebSocket.CONNECTING) {
        return;
      }
      if (state === WebSocket.CLOSING) {
        // Evita abrir un socket nuevo mientras el anterior sigue cerrando —
        // reintenta en 250ms en vez de crear dos sockets simultáneos.
        if (!this._closingRetry) {
          this._closingRetry = setTimeout(() => {
            this._closingRetry = null;
            this.connect();
          }, 250);
        }
        return;
      }
    }

    this._intentionalClose = false;
    this.ws = new WebSocket(this.wsUrl);
    this.ws.binaryType = "arraybuffer";

    this.ws.onopen = () => {
      this.sendAuthFrame();
      this._setState("CONNECTED", "🟢 Conectado al Nodo Edge");
      this.startHeartbeatLoop();
    };

    this.ws.onclose = () => {
      this.stopHeartbeatLoop();
      if (!this._intentionalClose) {
        this._setState("OFFLINE", "🔴 Canal suspendido. Reconectando...");
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = (err) => {
      console.warn("[LBH Ant] Error WebSocket", err);
    };

    this.ws.onmessage = (event) => {
      if (!(event.data instanceof ArrayBuffer) || event.data.byteLength < 3) return;

      const view = new DataView(event.data);
      const magic = String.fromCharCode(view.getUint8(0), view.getUint8(1));
      const type = view.getUint8(2);

      // ACK de feromona 0x02
      if (magic === "LA" && type === 0x02) {
        const inactive = Date.now() - this.lastUserActivity >= this.inactivityLimitMs;
        if (inactive && this.state !== "HIBERNATING") {
          this._setState("HIBERNATING", "❄️ Standby Activo (Socket Preservado)");
        }
        return;
      }

      if (this.onMessage) this.onMessage(event);
    };
  }

  scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => this.connect(), 3000);
  }

  startHeartbeatLoop() {
    this.stopHeartbeatLoop();
    this.heartbeatTimer = setInterval(() => {
      this.emitHeartbeatPheromone();
    }, this.heartbeatIntervalMs);
  }

  stopHeartbeatLoop() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  sendAuthFrame() {
    if (!this.authToken || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const buffer = new ArrayBuffer(16);
    const view = new DataView(buffer);
    view.setUint8(0, 0x4C); // L
    view.setUint8(1, 0x41); // A
    view.setUint8(2, 0x03); // Tipo: Auth
    view.setUint8(3, 0x00);
    view.setUint32(4, 0);
    view.setUint32(8, this.authToken);
    view.setUint32(12, Math.floor(Date.now() / 1000));

    this.ws.send(buffer);
  }

  emitHeartbeatPheromone() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const buffer = new ArrayBuffer(16);
    const view = new DataView(buffer);
    view.setUint8(0, 0x4C); // L
    view.setUint8(1, 0x41); // A
    view.setUint8(2, 0x02); // Tipo Heartbeat
    view.setUint8(3, 0x01); // Flag standby
    view.setUint32(4, 9999);
    view.setUint32(8, 0);
    view.setUint32(12, Math.floor(Date.now() / 1000));

    this.ws.send(buffer);
  }

  setupUserActivityListeners() {
    const awaken = () => {
      this.lastUserActivity = Date.now();
      if (this.state === "HIBERNATING") {
        this._setState("CONNECTED", "🟢 Canal Activo (Descongelado)");
      }
    };

    ["click", "touchstart", "mousemove", "keydown"].forEach(evt => {
      window.addEventListener(evt, awaken, { passive: true });
    });
  }

  setupVisibilityListener() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) return;

      // Al volver a primer plano: connect() ya es seguro llamarlo repetidamente —
      // si el socket sigue OPEN/CONNECTING no hace nada; si Android lo mató en
      // segundo plano sin disparar onclose a tiempo, esto lo detecta y reconecta
      // de inmediato en vez de esperar al scheduleReconnect() de 3s.
      const isDead = !this.ws || this.ws.readyState === WebSocket.CLOSED || this.ws.readyState === WebSocket.CLOSING;
      if (isDead) {
        this._setState("OFFLINE", "🟡 Verificando canal tras reanudar...");
      }
      this.connect();
    });
  }

  sendLBHFrame(sensorId, val) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn("[LBH Ant] No hay conexión activa");
      return false;
    }

    const buffer = new ArrayBuffer(16);
    const view = new DataView(buffer);
    view.setUint8(0, 0x4C);
    view.setUint8(1, 0x41);
    view.setUint8(2, 0x01); // Telemetría
    view.setUint8(3, 0x00);
    view.setUint32(4, sensorId);
    view.setUint32(8, val);
    view.setUint32(12, Math.floor(Date.now() / 1000));

    this.ws.send(buffer);
    this.lastUserActivity = Date.now();
    return true;
  }

  _setState(state, logMsg) {
    if (this.state === state && state !== "CONNECTED") return;
    this.state = state;
    if (this.onStateChange) this.onStateChange(state, logMsg);
  }

  close() {
    this._intentionalClose = true;
    this.stopHeartbeatLoop();
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this._closingRetry) clearTimeout(this._closingRetry);
    if (this.ws) this.ws.close();
  }
}

window.LBHHeartbeatAnt = LBHHeartbeatAnt;
