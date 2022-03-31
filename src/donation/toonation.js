const util = window.require('util');
const WebSocket = window.require('websocket');
const WebSocketClient = WebSocket.client;
const request = window.require('request');
const requestPromise = util.promisify(request);

module.exports = class Toonation {
  constructor(key) {
    this.key = key;

    // toonation alert setting info
    this.alertBoxUrl = "https://toon.at/widget/alertbox/" + key;
    this.payload = '';

    // toonation websocket
    this.wsClient = null;
    this.wsConnection = null;
    this.connected = false;

    // etc
    this.pingLoopHandle = null;
  }

  async loadPayload() {
    try {
      const res = await requestPromise(this.alertBoxUrl);
      if (200 === res.statusCode) {
        let matchedPayload = res.body.match(/"payload"\s*:\s*"([a-zA-Z0-9]+)"/);
        if (matchedPayload && matchedPayload.length > 1) {
          this.payload = matchedPayload[1];
          console.log('load toonation payload:', this.payload);

          return true;
        }
        else {
          throw new Error('failed to load toonation payload');
        }
      }
      else {
        throw new Error(`failed to connect toonation alert(url: ${this.alertBoxUrl})`);
      }

    } catch (e) {
      console.error('ERROR:', e.toString());
      return false;
    }
  }

  async connect(cb) {
    if(!cb) cb = () => {};

    await this.loadPayload();

    if(!this.payload) {
      console.log('not found toonation payload');
      return false;
    }

    this.disconnect();
    const client = new WebSocketClient();

    client.on('connectFailed', (e) => {
      console.error('ERROR:', `failed to connect toonation websocket(${e.toString()})`);
    });

    client.on('connect', (connection) => {
      // success to connection
      this.wsClient = client;
      this.wsConnection = connection;
      this.connected = true;

      cb('connect', this.connected, this);

      // Send pings every 12000ms when websocket is connected
      this.pingLoopHandle = setInterval(() => { this.ping() }, 12000);

      connection.on('error', (error) => {
        this.connected = false;
        console.error('Error:', `Toonation Connection(${error.toString()})`);
      });

      connection.on('close', () => {
        console.log(`Toonation connection closed. Try to reconnect after 10 seconds`);
        this.connected = false;

        cb('close');

        this.disconnect();
      });

      connection.on('message', (message) => {
        try {
          if (message.type === 'utf8') {
            const data = JSON.parse(message.utf8Data);
            // data.code === 101(후원)
            if (data.content && data.code && 101 === data.code) {
              cb('message', data, this);
            }
          }
        }
        catch (e) {
          console.error('ERROR:', `failed to received toonation message(${e.toString()})`);
        }
      });
    });

    client.connect("wss://toon.at:8071/" + this.payload);
  }

  disconnect() {
    clearInterval(this.pingLoopHandle);
    if(this.wsConnection) {
      this.wsConnection.close();
    }
    this.wsConnection = null;
    this.wsClient = null;
  }

  // 투네이션 알림 연결 유지를 위한 Ping 전송
  ping() {
    if(!this.isConnected() || !this.wsConnection) {
      return false;
    }

    this.wsConnection.ping("#ping");
  }

  isConnected() {
    return this.connected;
  }

}
