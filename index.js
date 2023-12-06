const express = require('express');
const app = express();
var http = require('http');
var url = require('url');
const cors = require('cors');
const OpenAI = require('openai');
const openai = new OpenAI();
const { readFile } = require('fs').promises;
app.use(cors())
app.get('/', async (request, response) => {
    
    var queryData = url.parse(request.url, true).query;
    const site = queryData.site
    const input = queryData.input
    console.log(site, input)
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are a helpful assistant." },
        {
            "role": "user", "content": `In the context of this site ${site} and your current knowledge, 
        define {word} and reply in a short summary of less than 50 words in a dictionary-like format but giving only the definition 
        If {word} is a stop word or has no meaning or definition related to the site and does not have a specific and well-defined meaning in the 
        context of information available at the provided site, say "{word} has no known definition in the context of the current site".  Strongly prefer 
        to give a definition even if slightly inaccurate and only give no definition if you are sure that {word} has no relation to the site. Replace {word} with ${input}
        Respond in JSON format with { "definition": definition }`
        }],
        model: "gpt-3.5-turbo",
    });
    response.send( completion.choices[0]['message']['content'] );

});
app.listen(process.env.PORT || 3004, () => console.log(`App available on http://localhost:3004`))