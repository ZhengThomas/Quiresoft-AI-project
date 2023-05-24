const express = require('express');
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());

const fs = require('fs');

//change this later, currently meant for testing
root = 'C:/Users/mralb/Documents/quiresoft/quiresoft/server/images'

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
        "/power/test.png",
        "/power/test2.png",
        "/power/test3.png"
      ];
    
      const images = imagePaths.map(imagePath => `${req.protocol}://${req.get("host")}${imagePath}`);
    
      res.json({ images });
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening on ${PORT}`));