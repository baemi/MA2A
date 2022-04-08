const util = window.require('util');
const WebSocket = window.require('websocket');
const WebSocketClient = WebSocket.client;
const request = window.require('request');
const requestPromise = util.promisify(request);

export class Twip {
  constructor(key) {
    this.key = key;

    // toonation alert setting info
    this.alertBoxUrl = "https://twip.kr/widgets/alertbox/" + key;
    this.token = null;
    this.twipVersion = '';

    // toonation websocket
    this.wsClient = null;
    this.wsConnection = null;
    this.connected = false;

    // etc
    this.pingLoopHandle = null;
  }

  async loadToken() {
    try {
      var response = await requestPromise(this.alertBoxUrl);
      if (response.statusCode === 200) {
        var matched_res;
        // token
        matched_res = response.body.match(/window\.__TOKEN__ = \'(.+)\';<\/script>/);
        if (matched_res !== null && matched_res.length > 1) {
          this.token = matched_res[1];
          console.log(`Get Twip token succeed : ${this.token}`);
        }
        else {
          throw new Error("Get Twip token parse failed.");
        }

        // version
        matched_res = response.body.match(/version: \'(.+)\',/);
        if (matched_res !== null && matched_res.length > 1) {
          this.twipVersion = matched_res[1];
          console.log(`Get Twip version succeed : ${this.twipVersion}\n`);
        }
        else {
          throw new Error("Get Twip version parse failed.\n");
        }
      }
      else {
        throw new Error("Get Twip token and version failed.");
      }

      return true;
    }
    catch (e) {
      console.error("Error get Twip token, version: " + e.toString());
      return false;
    }
  }

  async connect(cb) {
    if (!cb) cb = () => { };

    if (!this.token) {
      console.log('not found twip token');
      return false;
    }

    this.disconnect(false);
    const client = new WebSocketClient();

    client.on('connectFailed', (e) => {
      this.connected = false;
      console.error('ERROR:', `failed to connect twip websocket(${e.toString()})`);
      cb('connect-failed', undefined, this);
    });

    client.on('connect', (connection) => {
      this.wsClient = client;
      this.wsConnection = connection;
      this.connected = true;

      cb('connect', this.connected, this);

      this.pingLoopHandle = setInterval(function(){
        connection.send("2");
      }, 22000);

      connection.on('error', (error) => {
        this.connected = false;
        console.error('Error:', `Twip Connection(${error.toString()})`);
        cb('error', undefined, this);
      });

      connection.on('close', () => {
        console.log(`Twip connection closed. ${new Date()}`);
        this.connected = false;

        this.clearConnection();

        cb('close', this.manualDisconnect, this);
      });

      connection.on('message', (message) => {
        try {
          if (message.type === 'utf8') {
            let body = message.utf8Data;
            let eventName = null;
            let data = null;
            let details = null;
            if (body.charAt(body.length - 1) === "]") {
              data = JSON.parse(body.substring(body.indexOf('['), body.length));
              eventName = data[0];
              details = data[1];
            }

            switch (eventName) {
              case "new donate":
                cb('message', details, this);
                break;

              // case "new cheer":
              //   doSomething(details);
              //   break;

              // case "new follow":
              //   doSomething(details);
              //   break;

              // case "new sub":
              //   doSomething(details);
              //   break;

              // case "new hosting":
              //   doSomething(details);
              //   break;

              // case "new redemption":
              //   doSomething(details);
              //   break;

              default: break;
            }
          }
        }
        catch (e) {
          console.error("Error from Twip message: " + e.toString());
        }
      });
    });

    const twipWsUrl = `wss://io.mytwip.net/socket.io/?alertbox_key=${this.alertBoxUrl.split("/").pop()}&version=${this.twipVersion}&token=${encodeURIComponent(this.token)}&transport=websocket`;
    
    client.connect(twipWsUrl);
  }

  disconnect(manual) {
    this.manualDisconnect = manual;

    clearInterval(this.pingLoopHandle);
    if (this.wsConnection) {
      this.wsConnection.close();
    }
  }

  clearConnection() {
    this.wsConnection = null;
    this.wsClient = null;
  }

  // 트윕 알림 연결 유지를 위한 Ping 전송
  // 2022-04-03, 연결 유지가 정상적으로 되지 않아, 사용 중지
  ping() {
    if (!this.isConnected() || !this.wsConnection) {
      return false;
    }

    console.log('ping');

    this.wsConnection.ping('2');
  }

  isConnected() {
    return this.connected;
  }

}
