import {OpenAI} from '@langchain/openai';
import {configDotenv} from 'dotenv';
configDotenv({override: true});

const openAIModel = new OpenAI({
  temperature: 0.6,
  model: process.env.OPENAI_MODEL,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  },
  streaming: false,
  verbose: process.env.VERBOSE === 'true',
});
export {openAIModel};
