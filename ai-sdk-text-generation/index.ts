import {openai} from '@ai-sdk/openai';
import {generateText} from 'ai';

const {text} = await generateText({
    model: openai('gpt-5'),
    prompt: "Write a vegetarian lasagna recipe for 5 people",
});

console.log(text);