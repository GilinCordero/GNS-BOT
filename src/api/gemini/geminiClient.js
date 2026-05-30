import {GoogleGenAI} from '@google/genai';

const ai = new GoogleGenAI({});
const interaction = await ai.interactions.create({
    model: 'gemini-3-flash-preview',
    input: [
        { type: 'user_input', content: [{ type: 'text', text: 'Hello' }] },
        { type: 'model_output', content: [{ type: 'text', text: 'Hi there! How can I help you today?' }] },
        { type: 'user_input', content: [{ type: 'text', text: 'What is the capital of France?' }] }
    ]
});
console.log(interaction.steps.at(-1).content[0].text);