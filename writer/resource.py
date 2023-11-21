from writer.base import BaseWriter, WritingContext
from langchain.prompts import PromptTemplate
from llm.openai import llm
from prompts.response import ResponseTagWrappedContentOutputParser


class ResourceWriter(BaseWriter):
    def __init__(self, context: WritingContext):
        self.context = context
    
    def write(self) -> str:
        chain = PromptTemplate.from_file('prompts/resource', [
            'target',
            'requirements',
            'title_with_order',
        ]) | llm | ResponseTagWrappedContentOutputParser()
        return chain.invoke(dict(target=self.context.target,
                                 requirements=self.context.requirements,
                                 title_with_order=self.context.title_with_order))

