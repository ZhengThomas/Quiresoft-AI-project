const fakeOpenai = require('openai');



//this fucntions just sends whatever you want into the dalle place
//give it req, res, and the text you want Dalle to use
const dalleCall = async function(){
    const response = await openai.createImage({
        prompt: "a white siamese cat",
        n: 1,
        size: "1024x1024",
      });
    image_url = response.data.data[0].url;
    console.log(image_url);
}

dalleCall();
module.exports = dalleCall;