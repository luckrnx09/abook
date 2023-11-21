from langchain.chat_models.openai import ChatOpenAI
import os

llm = ChatOpenAI(model_name=os.getenv('OPENAI_MODEL', 'gpt-3.5-turbo-16k'),
                 streaming=False, verbose=True)
