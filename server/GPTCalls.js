//this fucntions just sends whatever you want into the dalle place
//give it the openai module
const GPTCall = async function(openai, prompt){
  
  const response = await openai.createChatCompletion({
      model: "text-davinci-002",
      messages: [{role: "user", content: prompt}]
    });
    console.log(response.data.choices[0])
  return response.data.choices;
}

module.exports = {GPTCall};