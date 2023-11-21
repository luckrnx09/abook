from writer.base import BaseWriter,WritingContext


class DefaultWriter(BaseWriter):
    def __init__(self, context: WritingContext):
        self.context = context
    
    def write(self) -> str:
        return 'Unsupported article type'
    
   