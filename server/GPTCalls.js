

//this fucntions just sends whatever you want into the dalle place
//give it the openai module
const GPTCall = async function(openai){
    const response = await openai.createChatCompletion({
       model: "gpt-3.5-turbo",
       messages: [{role: "user", content: "What is 2 + 2"}]
      });
    console.log(completion.data.choices[0].message);
}

module.exports = {GPTCall};