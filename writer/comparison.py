from langchain.prompts import PromptTemplate
from prompts.response import ResponseTagWrappedContentOutputParser
from llm.openai import llm
from writer.base import BaseWriter, WritingContext


class ComparisonWriter(BaseWriter):
    
    def __init__(self, context: WritingContext):
        self.context = context
    
    def write_concept_instruction(self) -> str:
        chain = PromptTemplate.from_file(
            'prompts/concept_instruction', [
                'source',
                'target',
                'title',
                'title_with_order',
                'requirements',
                'acquired'
            ]) | llm | ResponseTagWrappedContentOutputParser()
        return chain.invoke(dict(source= self.context.source, target=self.context.target,
                                 title=self.context.title,
                                 title_with_order=self.context.title_with_order,
                                 requirements=self.context.requirements,
                                 acquired=self.context.acquired))
        
    def write_api_comparison(self) -> str:
        chain = PromptTemplate.from_file(
            'prompts/api_comparison', [
                'title',
                'source',
                'target',
                'requirements'
            ]) | llm | ResponseTagWrappedContentOutputParser()
        return chain.invoke(dict(source=self.context.source,
                                 target=self.context.target,
                                 title=self.context.title,
                                 requirements=self.context.requirements))
    
    def write(self) -> str:
        return self.write_concept_instruction() + self.write_api_comparison()

