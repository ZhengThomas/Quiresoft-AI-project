
require('dotenv').config()
//import { Configuration, OpenAIApi } from "openai";


const express = require('express');
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const fs = require('fs');
const dalleCalls = require("./dalleCalls");
const GPTCalls = require("./GPTCalls");
//dont use the fake openai, it jsut set up configuraation for the openai api
const fakeOpenai = require('openai')

const openAIConfig = new fakeOpenai.Configuration({
    organization: "org-KVwLAMwkpB4xA0jbLi3HKTG7",
    apiKey: process.env.OPENAI_API_KEY,
});
//this is the one that has actual access to the open ai api
const openai = new fakeOpenai.OpenAIApi(openAIConfig);

//change this later, currently meant for testing
root = 'C:/Users/mralb/Documents/quiresoft/quiresoft/server/images'
//TODO - Add a .env file to hide the test key, currently its meant for testing

app.use("/power", express.static(root));

app.use((req, res, next) => {
    //how safe is this i dont actually know
    //this used to be a proxy server so i can get around cors but i dont know shit
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
    res.header("Access-Control-Allow-Headers", "url, Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin, x-riot-token");
    next();
  });


app.get("/power/power", (req, res) => {

    //get the prompt from req.data or something
    //clean the prompt up, add whatever we want to the prompt
    //give prompt to chatgpt
    //get prompt back, send it off to dalle
    //get image paths back, send it to front end
    const imagePaths = [
        "/power/test1.png",
        "/power/test2.png",
        "/power/test3.png",
        "/power/test4.png"
      ];
    
      const images = imagePaths.map(imagePath => `${req.protocol}://${req.get("host")}${imagePath}`);
    
      res.json({ images });
});

app.post("/power/power", (req, res) => {
    res.json(req.body);
});

//dalleCalls.dalleCall(openai);
GPTCalls.GPTCall(openai);
console.log("NOO")
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));