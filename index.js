"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const ws_1 = require("ws");
const food_1 = require("@/entities/food");
const door_1 = require("@/entities/door");
const waterLevel_1 = require("@/entities/waterLevel");
const waterTurbidity_1 = require("@/entities/waterTurbidity");
const device_1 = require("@/entities/device");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const PORT = Number(process.env.PORT) || 8080;
app.get('/', (req, res) => {
    res.json({ message: 'Hello, world!' });
});
const iot_wss = new ws_1.Server({ noServer: true });
const app_wss = new ws_1.Server({ noServer: true });
iot_wss.on('connection', ws => {
    ws.on('message', m => {
        const data = JSON.parse(m.toString());
        console.log(data);
        if (data.message !== undefined && data.message.door !== undefined && data.message.food !== undefined && data.message.water.level !== undefined && data.message.water.turbidity !== undefined) {
            (0, door_1.setDoor)(data.message.door);
            (0, food_1.setKg)(data.message.food);
            (0, waterLevel_1.setWaterLevel)(data.message.water.level);
            (0, waterTurbidity_1.setWaterTurbidity)(data.message.water.turbidity);
            app_wss.clients.forEach(client => client.send(JSON.stringify({ message: { door: (0, door_1.getDoor)(), food: { Kg: (0, food_1.getKg)(), fullKg: (0, food_1.getFullKg)() }, water: { level: (0, waterLevel_1.getWaterLevel)(), turbidity: (0, waterTurbidity_1.getWaterTurbidity)() } } })));
        }
        else {
            iot_wss.clients.forEach(client => client.send(JSON.stringify({ message: "error" })));
        }
    });
    ws.on("error", e => ws.send(String(e)));
    ws.send(JSON.stringify({ message: { door: (0, door_1.getDoor)() } }));
});
app_wss.on('connection', ws => {
    ws.on('message', m => {
        const data = JSON.parse(m.toString());
        console.log(data);
        if (data.message !== undefined && data.message.door !== undefined) {
            (0, door_1.setDoor)(data.message.door);
            iot_wss.clients.forEach(client => client.send(JSON.stringify({ message: { door: (0, door_1.getDoor)() } })));
        }
        else {
            app_wss.clients.forEach(client => client.send(JSON.stringify({ message: "error" })));
        }
    });
    ws.on("error", e => ws.send(String(e)));
    ws.send(JSON.stringify({ message: { door: (0, door_1.getDoor)(), food: { Kg: (0, food_1.getKg)(), fullKg: (0, food_1.getFullKg)() }, water: { level: (0, waterLevel_1.getWaterLevel)(), turbidity: (0, waterTurbidity_1.getWaterTurbidity)() }, device: (0, device_1.getDevice)() } }));
});
server.on('upgrade', (request, socket, head) => {
    const pathname = request.url;
    if (pathname === '/iot') {
        iot_wss.handleUpgrade(request, socket, head, (ws) => {
            iot_wss.emit('connection', ws, request);
        });
    }
    else if (pathname === '/app') {
        app_wss.handleUpgrade(request, socket, head, (ws) => {
            app_wss.emit('connection', ws, request);
        });
    }
    else {
        socket.destroy();
    }
});
server.listen(PORT, '0.0.0.0', undefined, () => console.log("Server started: " + PORT));
