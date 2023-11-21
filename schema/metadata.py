from typing import List, Dict


class Article:
    def __init__(self, title: str, type: str, requirements: List[str]):
        self.title = title
        """
        value of type can be environment, comparison, cli or resource
        """
        self.type = type
        self.requirements = requirements


class Chapter:
    def __init__(self, title: str, articles: List[Article]):
        self.title = title
        self.articles = articles


class Catalog:
    def __init__(self, title: str, chapters: List[Chapter]):
        self.title = title
        self.chapters = chapters


class Book:
    def __init__(self, title: str, catalogs: List[Catalog], source: str, target: str):
        self.title = title
        self.catalogs = catalogs
        self.source = source
        self.target = target


def create_book_from_json(json_dict: Dict[str, any]) -> Book:
    title = json_dict['title']
    source = json_dict['source']
    target = json_dict['target']
    
    catalogs = []
    for catalog_json in json_dict['catalogs']:
        catalog_title = catalog_json['title']
        chapters = []
        for chapter_json in catalog_json['chapters']:
            chapter_title = chapter_json['title']
            articles = []
            for article_json in chapter_json['articles']:
                article_title = article_json['title']
                article_type = article_json['type']
                requirements = article_json['requirements']
                article = Article(article_title, article_type, requirements)
                articles.append(article)
            chapter = Chapter(chapter_title, articles)
            chapters.append(chapter)
        catalog = Catalog(catalog_title, chapters)
        catalogs.append(catalog)
    
    return Book(title, catalogs, source, target)