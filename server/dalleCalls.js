//this fucntions just sends whatever you want into the dalle place
//give it the openai module, as well as the prompt you want it to work
const dalleCall = async function(openai, prompt){
    const response = await openai.createImage({
        "prompt": prompt,
        n: 1,
        size: "1024x1024",
      });
    image_url = response.data.data;
    console.log(image_url);
    return image_url;
}

const fullDalleCall = async function(openai, prompt){

}
module.exports = {dalleCall};