from abc import ABC, abstractmethod
from schema.typing import Book

class WritingContext:
    def __init__(self, book: Book, section_id: str):
        self.source = source
        self.target = target
        self.title = title
        self.title_with_order = title_with_order
        self.requirements = requirements
        self.acquired = acquired


class BaseWriter(ABC):
    @abstractmethod
    def __init__(self, context: WritingContext):
        pass
    
    @abstractmethod
    def write(self) -> str:
        pass
    
