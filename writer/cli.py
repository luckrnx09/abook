from writer.base import BaseWriter, WritingContext
from langchain.prompts import PromptTemplate
from llm.openai import llm
from prompts.response import ResponseTagWrappedContentOutputParser


class CommandLineWriter(BaseWriter):
    def __init__(self, context: WritingContext):
        self.context = context
    
    def write(self) -> str:
        chain = PromptTemplate.from_file('prompts/command_line',[
            'source',
            'target',
            'title',
            'title_with_order'
        ]) | llm | ResponseTagWrappedContentOutputParser()
        return chain.invoke(dict(source=self.context.source,target=self.context.target,
                                 title=self.context.title,
                                 title_with_order=self.context.title_with_order))

