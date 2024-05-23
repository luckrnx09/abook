import {OpenAI} from '@langchain/openai';

const openAIModel = new OpenAI({
    temperature: 0.7,
    model: process.env.OPENAI_MODEL,
    configuration: {
        baseURL: process.env.OPENAI_BASE_URL,
    },
    verbose: process.env.VERBOSE === 'true',
    apiKey: process.env.OPENAI_API_KEY,
});

export {openAIModel};
