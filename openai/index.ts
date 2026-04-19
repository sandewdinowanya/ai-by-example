import OpenAI from "openai";

const client = new OpenAI();

const stream = await client.responses.create({
    model: "gpt-5.4",
    input: [
        {
            role: "user",
            content: "Give me a 20 word poem about flowers",
        },
    ],
    stream: true,
});

for await (const event of stream){
    if(event.type == "response.output_text.delta"){
        process.stdout.write(event.delta);
    }
}