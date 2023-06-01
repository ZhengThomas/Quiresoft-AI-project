//this fucntions just sends whatever you want into the dalle place
//give it the openai module
const GPTCall = async function(openai, prompt){
  
  const response = await openai.createCompletion({
      model: "text-davinci-002",
      "prompt": prompt,
      "max_tokens":60
    });
    //console.log(response.data.choices[0])
  return response.data.choices;
}

module.exports = {GPTCall};