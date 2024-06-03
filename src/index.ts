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
const PORT = Number(process.env.PORT) || 8080;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: 'Hello, world!'});
});

const iot_wss = new WebSocketServer({ noServer: true });
const app_wss = new WebSocketServer({ noServer: true });

app.post('/smart-home', (req, res) => {
    console.log(req.body);
    const {version, session, request} = req.body;
    let text = "Привет, это навык прототипа умной кормушки! Вот команды, с которыми я могу работать.\n\n1.Сколько корма в кормушке?\n2.Какой уровень воды в кормушке?\n3.Какой процент мутности воды в кормушке?\n4.Открой пищевой люк\n5.Закрой пищевой люк\n6.Какое состояние пищевого люка?\n7.Статус кормушки";
    if (request["original_utterance"].length > 0)
    {
        if (request["original_utterance"] === "Сколько корма в кормушке?")
        {
            text = getKg() + " кг. из " + getFullKg() + " кг.";
        }
        else if (request["original_utterance"] === "Какой уровень воды в кормушке?")
        {
            text = getWaterLevel() ? "Воды в кормушке больше половины" : "Воды в кормушке больше половины";
        }
        else if (request["original_utterance"] === "Какой процент мутности воды в кормушке?")
        {
            text = "Процент мутности воды: " + getWaterTurbidity() + " %";
        }
        else if (request["original_utterance"] === "Открой пищевой люк")
        {
            setDoor(true);
            iot_wss.clients.forEach(client => client.send(JSON.stringify({message: {door: getDoor()}})));
            app_wss.clients.forEach(client => client.send(JSON.stringify({message: {door: getDoor(), food: {Kg: getKg(), fullKg: getFullKg()}, water: {level: getWaterLevel(), turbidity: getWaterTurbidity()}, device: getDevice()}})));
            text = "Пищевой люк открыт";
        }
        else if (request["original_utterance"] === "Закрой пищевой люк")
        {
            setDoor(false);
            iot_wss.clients.forEach(client => client.send(JSON.stringify({message: {door: getDoor()}})));
            app_wss.clients.forEach(client => client.send(JSON.stringify({message: {door: getDoor(), food: {Kg: getKg(), fullKg: getFullKg()}, water: {level: getWaterLevel(), turbidity: getWaterTurbidity()}, device: getDevice()}})));
            text = "Пищевой люк закрыт";
        }
        else if (request["original_utterance"] === "Какое состояние пищевого люка?")
        {
            text = getDoor() ? "Пищевой люк открыт" : "Пищевой люк закрыт";
        }
        else if (request["original_utterance"] === "Статус кормушки")
        {
            text = "Кол-во корма: " + (getKg() + " кг. из " + getFullKg() + " кг.") + "\nУровень воды: " + (getWaterLevel() ? "Воды в кормушке больше половины" : "Воды в кормушке больше половины") + "\nПроцент мутности воды: " + (getWaterTurbidity() + " %") + "\nСтатус пищевого люка: " + (getDoor() ? "Пищевой люк открыт" : "Пищевой люк закрыт");
        }
        else
        {
            text = "Я не понял вашего запроса!\nВот команды, с которыми я могу работать.\n\n1.Сколько корма в кормушке?\n2.Какой уровень воды в кормушке?\n3.Какой процент мутности воды в кормушке?\n4.Открой пищевой люк\n5.Закрой пищевой люк\n6.Какое состояние пищевого люка?\n7.Статус кормушки";
        }
        const jsonData = {
            version,
            session,
            response: {
                text: text,
                end_session: false,
            },
        }
        res.json(jsonData)
    }
})

iot_wss.on('connection', ws => {
    ws.on('message', m => {
        const data = JSON.parse(m.toString());
        console.log(data);
        if (data.message !== undefined && data.message.door !== undefined && data.message.food !== undefined && data.message.water.level !== undefined && data.message.water.turbidity !== undefined) {
            setDoor(data.message.door);
            setKg(data.message.food);
            setWaterLevel(data.message.water.level);
            setWaterTurbidity(data.message.water.turbidity);
            app_wss.clients.forEach(client => client.send(JSON.stringify({message: {door: getDoor(), food: {Kg: getKg(), fullKg: getFullKg()}, water: {level: getWaterLevel(), turbidity: getWaterTurbidity()}, device: getDevice()}})));
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

server.listen(PORT, '0.0.0.0',undefined,() => console.log("Server started: "+PORT))