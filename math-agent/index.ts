import {openai} from '@ai-sdk/openai';
import {generateText, stepCountIs} from 'ai';
import { addTool } from './tool';

const {text} = await generateText({
    model: openai('gpt-5'),
    tools:{
        add: addTool,
    },
    stopWhen: stepCountIs(4),
    prompt: "Add 5 and 5",
});

console.log(text); 