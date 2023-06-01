
require('dotenv').config()
//import { Configuration, OpenAIApi } from "openai";


const mongoose = require('mongoose');
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


//MongoDB Connection
const mongoURL = process.env.DATABASE_URL;
mongoose.connect(mongoURL);

const database = mongoose.connection
database.on('error', (error) => {
  console.log(error)
})

database.once('connected', () => {
  console.log('Database Connected');
})


//Using the MongoDB Connection
const routes = require('./routes/routes');
app.use('/api', routes)

const openAIConfig = new fakeOpenai.Configuration({
    organization: "org-EOQWL5JneFqSFELhPmlVTlow",
    apiKey: process.env.OPENAI_API_KEY,
});

app.use((req, res, next) => {
  //how safe is this i dont actually know
  //this used to be a proxy server so i can get around cors but i dont know shit
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  res.header("Access-Control-Allow-Headers", "url, Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Origin, x-riot-token");
  next();
});



//this is the one that has actual access to the open ai api
const openai = new fakeOpenai.OpenAIApi(openAIConfig);

//change this later, currently meant for testing
root = 'C:/Users/mralb/Documents/quiresoft/quiresoft/server/images'
//TODO - Add a .env file to hide the test key, currently its meant for testing

app.use("/power", express.static(root));




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

app.post("/gptCall", async (req, res) => {
  const answer = await GPTCalls.GPTCall(openai, req.body.prompt);
  res.json(answer);
  return
});

app.post("/gptIntoDalleCall", async (req, res) => {
  //TODO - here we should add whatever we need to this prompt to make the prompt better
  const realPrompt = `I am going to give a sequence of orders. Give me only your response for item 2.
  1. Come up with an idea for the background image that is about ` + req.body.prompt + ` 
  2.Think of a short prompt that can be given to dalle for that specific idea you came up with in order 1.  The prompt should depict something that physically exists, rather than something intangible. Start the prompt with the words "Dalle Prompt"
  `
  const gptAnswer = await GPTCalls.GPTCall(openai, realPrompt);
  //TODO - here we should filter the gpt answer to get the part thats actually useful
  //with the current model being used, chat gpt will almost always say "dalle prompt:" before the actual prompt
  const dalleAnswer = await dalleCalls.dalleCall(openai, gptAnswer[0].text);
  res.json(dalleAnswer);
  return;
});

app.get("/test", async (req, res) => {
  const answer =await openai.listModels();
  console.log(answer.data);
  res.json(answer.data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));