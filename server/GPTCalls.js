//this fucntions just sends whatever you want into the dalle place
//give it the openai module
const GPTCall = async function(openai, prompt){
   //can maybe use gpt-3.5-turbo or text-davinci-002
    //to my knowledge, the testing with the current prompt that will be passed in is based on text davinci

  const response = await openai.createCompletion({
    "model": "text-davinci-002", 
    "prompt": prompt,
    "max_tokens":60
  });
    //console.log(response.data.choices[0])

  /*
  const response = await await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{role: "user", content: prompt}],
  });
  */
  console.log(response.data.choices[0])
  return response.data.choices;
}

module.exports = {GPTCall};