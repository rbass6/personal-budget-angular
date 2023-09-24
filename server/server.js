const express = require('express');
const budgetData = require('./budget-data.json')
const cors = require('cors')
const app = express();
const port = 3000;

//app.use('/', express.static('public'))
app.use(  cors({
  allowedHeaders: ["authorization", "Content-Type"], // you can change the headers
  exposedHeaders: ["authorization"], // you can change the headers
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false
}))

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

app.get('/budget', (req, res) => {
  res.json(budgetData);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})