const util = window.require('util');
const WebSocket = window.require('websocket');
const WebSocketClient = WebSocket.client;
const request = window.require('request');
const requestPromise = util.promisify(request);

export class Toonation {
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
    if (!cb) cb = () => { };

    if (!this.payload) {
      console.log('not found toonation payload');
      return false;
    }

    this.disconnect(false);
    const client = new WebSocketClient({ closeTimeout: 10000 });

    client.on('connectFailed', (e) => {
      this.connected = false;
      console.error('ERROR:', `failed to connect toonation websocket(${e.toString()})`);
      cb('connect-failed', undefined, this);
    });

    client.on('connect', (connection) => {
      // success to connection
      this.wsClient = client;
      this.wsConnection = connection;
      this.connected = true;

      cb('connect', this.connected, this);

      // Send pings every 12000ms when websocket is connected
      // this.pingLoopHandle = setInterval(() => { this.ping() }, 12000);
      const ping = () => {
        if (!this.connected) {
          return;
        }

        this.pingLoopHandle = setTimeout(function () {
          connection.send("#ping");
          ping();
        }, 12000);
      }
      ping();

      connection.on('error', (error) => {
        this.connected = false;
        console.error('Error:', `Toonation Connection(${error.toString()})`);
        cb('error', undefined, this);
      });

      connection.on('close', () => {
        console.log(`Toonation connection closed. ${new Date()}`);
        this.connected = false;

        this.clearConnection();

        cb('close', this.manualDisconnect, this);
      });

      connection.on('message', (message) => {
        try {
          if (message.type === 'utf8' && message.utf8Data !== '#pong') {
            const data = JSON.parse(message.utf8Data);
            // data.code === 101(??????)
            if (data.content && data.code && 101 === data.code) {  // ????????????(code: 111 | 112)
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

  disconnect(manual) {
    this.manualDisconnect = manual;

    // clearInterval(this.pingLoopHandle);
    clearTimeout(this.pingLoopHandle);
    if (this.wsConnection) {
      this.wsConnection.close();
    }
  }

  clearConnection() {
    this.wsConnection = null;
    this.wsClient = null;
  }

  // ???????????? ?????? ?????? ????????? ?????? Ping ??????
  ping() {
    if (!this.isConnected() || !this.wsConnection) {
      return false;
    }

    console.log(`send ping - ${new Date()}`);
    this.wsConnection.ping("#ping");
  }

  isConnected() {
    return this.connected;
  }

}
