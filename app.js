const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;


app.get('/', (req, res) => {
    res.send({message: "hello world"});
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту: ${PORT}`);
});