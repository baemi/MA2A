const util = require('util');
// const io = require("socket.io-client");
const request = require('request');
const WebSocket = require('websocket');
const WebSocketClient = WebSocket.client;
const requestPromise = util.promisify(request);
require('console-stamp')(console, { 
    format: ':date(yyyy/mm/dd HH:MM:ss.l)' 
} );

exports.connect = async function(key, webContents) {
  var settings = {
    "toonat": {
        "use": true,
        "alertbox_url": "https://toon.at/widget/alertbox/" + key
    }
  }
  
    console.log("==============================================");
    console.log("Initialize toonat");
    try{
        var response = await requestPromise(settings.toonat.alertbox_url);
        if(response.statusCode == 200){
            var matched_res = response.body.match(/"payload"\s*:\s*"([a-zA-Z0-9]+)"/);
            if(matched_res !== null && matched_res.length > 1){
                settings.toonat.payload = matched_res[1];
                console.log(`Get toonat.payload succeed : ${settings.toonat.payload}\n`);
            }
            else{
                console.error("Get toonat.payload failed.\n");
            }
        }
        else{
            console.error("Get toonat.payload failed.");
        }
    }
    catch(e){
        console.error("Error toonat.payload parse: " + e.toString());
    }
    
    var toonAtClient = null;
    var toonAtIsConnected = false;
    
    function connect_toonat(){
        if(settings.toonat.payload == undefined){
            console.log("can not found toonay payload");
            return;
        }
  
        toonAtClient = null;
        toonAtClient = new WebSocketClient();
        
        toonAtClient.on('connectFailed', function(error) {
            console.log('Toonat Connect Error: ' + error.toString());
        });
        
        toonAtClient.once('connect', function(connection) {
            console.log('Toonat Connected');
            webContents.send('toonation-connection-success');
            // vtpConnector.connect((client) => {
            //   console.log('connect!!:', client.connected);
            // });
            toonAtIsConnected = true;
    
            // Send pings every 12000ms when websocket is connected
            const ping_toonat = function(){
                if(!toonAtIsConnected){
                    return;
                }
                setTimeout(function(){
                    connection.ping("#ping");
                    ping_toonat();
                },12000);
            }
            ping_toonat();
    
            connection.on('error', function(error) {
                toonAtIsConnected = false;
                console.error("Toonat Connection Error: " + error.toString());
            });
            connection.on('close', function() {
                console.error('Toonat Connection Closed. Try to reconnect after 10 seconds...');
                toonAtIsConnected = false;
                // setTimeout(function(){
                //     connect_toonat();
                // },10000);
            });
            connection.on('message', function(message) {
                // console.log(message);
                try{
                    if (message.type === 'utf8') {
                        var data = JSON.parse(message.utf8Data);
                        if(data.content !== undefined && data.code !== undefined && data.code == 101){  // 101: donation, 107: bit, ...
                            webContents.send('toonation-message', data);
                        }
                    }
                }
                catch(e){
                    console.error("Error from Toonat message: " + e.toString());
                }
            });
        });
        
        toonAtClient.connect("wss://toon.at:8071/"+settings.toonat.payload);
    }
  
    
    setTimeout(function(){
        connect_toonat();
    },1000);
}
