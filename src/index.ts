import 'module-alias/register';
import express from "express";
import { createServer } from "http";
import { Server as WebSocketServer } from 'ws';
import {getFullKg, getKg, setKg} from "@/entities/food";
import {getDoor, setDoor} from "@/entities/door";
import {getWaterLevel, setWaterLevel} from "@/entities/waterLevel";
import {getWaterTurbidity, setWaterTurbidity} from "@/entities/waterTurbidity";
import {getDevice} from "@/entities/device";

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.json({message: 'Hello, world!'});
});

const iot_wss = new WebSocketServer({ noServer: true });
const app_wss = new WebSocketServer({ noServer: true });

iot_wss.on('connection', ws => {
    ws.on('message', m => {
        const data = JSON.parse(m.toString());
        console.log(data);
        if (data.message !== undefined && data.message.door !== undefined && data.message.food !== undefined && data.message.water.level !== undefined && data.message.water.turbidity !== undefined) {
            setDoor(data.message.door);
            setKg(data.message.food);
            setWaterLevel(data.message.water.level);
            setWaterTurbidity(data.message.water.turbidity);
            app_wss.clients.forEach(client => client.send(JSON.stringify({message: {door: getDoor(), food: {Kg: getKg(), fullKg: getFullKg()}, water: {level: getWaterLevel(), turbidity: getWaterTurbidity()}}})));
        }
        else
        {
            iot_wss.clients.forEach(client => client.send(JSON.stringify({message: "error"})));
        }
    });

    ws.on("error", e => ws.send(String(e)));

    ws.send(JSON.stringify({message: {door: getDoor()}}));
});

app_wss.on('connection', ws => {
    ws.on('message', m => {
        const data = JSON.parse(m.toString());
        console.log(data);
        if (data.message !== undefined && data.message.door !== undefined) {
            setDoor(data.message.door);
            iot_wss.clients.forEach(client => client.send(JSON.stringify({message: {door: getDoor()}})));
        }
        else
        {
            app_wss.clients.forEach(client => client.send(JSON.stringify({message: "error"})));
        }
    });

    ws.on("error", e => ws.send(String(e)));

    ws.send(JSON.stringify({message: {door: getDoor(), food: {Kg: getKg(), fullKg: getFullKg()}, water: {level: getWaterLevel(), turbidity: getWaterTurbidity()}, device: getDevice()}}));
});

server.on('upgrade', (request, socket, head) => {
    const pathname = request.url;

    if (pathname === '/iot') {
        iot_wss.handleUpgrade(request, socket, head, (ws) => {
            iot_wss.emit('connection', ws, request);
        });
    } else if (pathname === '/app') {
        app_wss.handleUpgrade(request, socket, head, (ws) => {
            app_wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

server.listen(PORT, () => console.log("Server started: "+PORT))