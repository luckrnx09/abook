from typing import  List
from writer.comparison import ComparisonWriter
from writer.base import BaseWriter, WritingContext
from schema.metadata import Article
from writer.default import DefaultWriter
from writer.cli import CommandLineWriter
from writer.environment import EnvironmentWriter
from writer.resource import ResourceWriter


def strip_title(text: str) -> str:
    dot_index = text.find('.')
    return text[dot_index + 1:].strip() if dot_index != -1 else text.strip()


def create_writer(source: str, target: str, article: Article, acquired: List[str]) -> (
        BaseWriter):
    type_to_writer = {
        'environment': EnvironmentWriter,
        'comparison': ComparisonWriter,
        'cli': CommandLineWriter,
        'resource': ResourceWriter
    }
    requirements = '\n'.join([f" - {item}" for item in article.requirements])
    acquired = '\n'.join([f" - {strip_title(item)}" for item in acquired])
    context = WritingContext(
        source=source,
        target=target,
        title=strip_title(article.title),
        title_with_order=article.title.strip(),
        requirements=requirements if requirements.strip() != '' else 'N/A',
        acquired=acquired if acquired.strip() != '' else 'N/A',
    )
    return type_to_writer.get(article.type, DefaultWriter)(context)
