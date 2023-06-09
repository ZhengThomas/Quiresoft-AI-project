
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
const cleaner = require("./cleanGPTText")


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

app.use('/api', routes)
//this is the one that has actual access to the open ai api
const openai = new fakeOpenai.OpenAIApi(openAIConfig);

let root = 'C:/Users/mralb/Documents/quiresoft/quiresoft/server/images';
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

//short is for short prompts. Things like "A white siamese cat" or "a chess tournament" or something
//this is when they do not give a news article and have alreaddy read it or something
app.post("/gptIntoDalleCallShort", async (req, res) => {
  //here we should test if the security token that is passed in (req.body.token) is valid
  //TODO - here we should add whatever we need to this prompt to make the prompt better
  const realPrompt = `
  Here are some tips for generating prompts with dalle. Use this along with any existing knowledge you have for the future orders.
  "a.Describe the Subject in Detail
  b.Don’t Forget About the Background
  c.Set the Mood of the Scene
  d.try to avoid prompting dalle to generate words"
  
  I am going to give a sequence of orders. Give me only your response for item 2.
  1. Come up with an idea for the background image of a social media post that is about` + req.body.prompt + `
  2.Think of a short prompt that can be given to dalle for that specific idea you came up with in order 1.  The prompt should depict something that physically exists, rather than something intangible. If the background image has nothing to do with drawing, make it realistic rather than a drawing. Start the prompt with the words "Dalle Prompt"
  `
  const gptAnswer = await GPTCalls.GPTCall(openai, realPrompt);

  //cleans up the text, removing unneccessary words and stuff
  let realAnswer = cleaner.cleanText(gptAnswer);

  const dalleAnswer = await dalleCalls.dalleCall(openai, realAnswer);
  res.json(dalleAnswer);
  return;
});

//long is for long prompts. it is meant for whena news article or something is passed in.
app.post("/gptIntoDalleCallLong", async (req, res) => {
  //TODO - here we should add whatever we need to this prompt to make the prompt better
  //This prompt is different from the short version prompt, designed for chatgpt to read the article better
  const realPrompt = `read the following article - "` + req.body.prompt + `"
  I am now going to give a sequence of orders. Give me only your response for item 2
  1. Construct an idea of a background image of a social media post, based on the article that you read above.
  2. Think of a short prompt that can be given to dalle for that specific idea you came up with in order 1.  The prompt should depict something that physically exists, rather than something intangible. If the background image has nothing to do with drawing, make it realistic rather than a drawing. Try to avoid prompting dalle to generate words, such as news articles or news headlines. Start the prompt with the words "Dalle Prompt"
  `
  const gptAnswer = await GPTCalls.GPTCall(openai, realPrompt);

  //cleans up the text, removing unneccessary words and stuff
  let realAnswer = cleaner.cleanText(gptAnswer);

  const dalleAnswer = await dalleCalls.dalleCall(openai, realAnswer);
  res.json(dalleAnswer);
  return;
})

app.post("/api/registers", async (req, res) => {
console.log("asdasdasd")
})



app.post("/gptCallThatsIt", async (req, res) => {
  //check for token validity here
  const gptAnswer = await GPTCalls.GPTCall(openai, req.body.prompt);
  res.json(gptAnswer);
  return;
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));