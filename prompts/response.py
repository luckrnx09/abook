from langchain.schema import BaseOutputParser


class ResponseTagWrappedContentOutputParser(BaseOutputParser):
    def parse(self, text: str):
        start_tag = '<RESPONSE>'
        end_tag='</RESPONSE>'
        if start_tag not in text or end_tag not in text:
            raise Exception(f'No {start_tag} or {end_tag} found in {text}')
        return text.lstrip('<RESPONSE>').rstrip('</RESPONSE>')

