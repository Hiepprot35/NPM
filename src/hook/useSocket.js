// socketManager.js
import { io } from 'socket.io-client';

class SocketManager {
  constructor() {
    this.socket = null;
  }

  connect(host) {
    this.socket = io(host);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

}

export default new SocketManager();
