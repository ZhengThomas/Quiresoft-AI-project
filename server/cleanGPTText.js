const cleanText = function(text){
    //with the current model being used, chat gpt will almost always say "dalle prompt:" before the actual prompt
    //so here we get rid of every bit of text before and including the words "dalle prompt"
    //its not perfect but it helps
    let realAnswer = text[0].text.toLowerCase();
    const searchString = "dalle prompt";
    let startIndex = realAnswer.indexOf(searchString);
    
    //while loop to remove every instance of the word
    while (startIndex !== -1) {
        realAnswer = realAnswer.substring(startIndex + searchString.length);
        startIndex = realAnswer.indexOf(searchString);
    }

    // Remove quotation marks, colons, and newline characters
    //these appear pretty often with chatGPT answers
    realAnswer = realAnswer.replace(/["':\n]/g, "");
    return realAnswer;
}


module.exports = {cleanText};