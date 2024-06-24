import {OpenAI} from '@langchain/openai';

const createOpenAIModel = () =>
  new OpenAI({
    temperature: 0.8,
    model: process.env.OPENAI_MODEL,
    configuration: {
      baseURL: process.env.OPENAI_BASE_URL,
    },
    streaming: false,
    verbose: process.env.VERBOSE === 'true',
  });
export {createOpenAIModel};
