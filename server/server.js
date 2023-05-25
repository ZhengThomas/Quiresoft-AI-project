
require('dotenv').config()
//import { Configuration, OpenAIApi } from "openai";


const express = require('express');
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const fs = require('fs');
const openai = require('openai')

const openAIConfig = new openai.Configuration({
    organization: "org-KVwLAMwkpB4xA0jbLi3HKTG7",
    apiKey: process.env.OPENAI_API_KEY,
});

//change this later, currently meant for testing
root = 'C:/Users/mralb/Documents/quiresoft/quiresoft/server/images'
console.log(process.env.OPENAI_API_KEY)
//TODO - Add a .env file to hide the test key, currently its meant for testing
let orgId = "org-KVwLAMwkpB4xA0jbLi3HKTG7"

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
    const imagePaths = [
        "/power/test1.png",
        "/power/test2.png",
        "/power/test3.png",
        "/power/test4.png"
      ];
    
      const images = imagePaths.map(imagePath => `${req.protocol}://${req.get("host")}${imagePath}`);
    
      res.json({ images });
})




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));