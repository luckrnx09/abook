import {createOpenAIModel} from './openai';

const createModel = () => {
  // Support more llm provider here..
  return createOpenAIModel();
};
const model = createModel();

export {model};
