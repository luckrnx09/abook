from typing import List, Dict



class Book:
    class Catalog:
        class Chapter:
            class Article:
                def __init__(self,id: str, title: str, slug: str, sections: List[Section]):
                    self.id = id
                    self.title = title
                    self.slug = slug
                    self.sections = sections

   
            class Section:
                def __init__(self, id: str, title: str, prompt: str = '', content: str = ''):
                    self.id = id
                    self.title = title
                    self.prompt = prompt
                    self.content = content

            def __init__(self,id: str, title: str, articles: List[Article]):
                self.id = id
                self.title = title
                self.articles = articles


        def __init__(self,
                     id: str,
                     title: str,
                     chapters: List[Chapter]):
            self.id = id
            self.title = title
            self.chapters = chapters

    def __init__(self,
                 id: str,
                 title: str,
                 language: str,
                 author: str,
                 catalogs: List[Catalog]):
        self.id = id
        self.title = title
        self.language = language
        self.author = author
        self.catalogs = catalogs


    
   
    
class DraftSection:
    def __init__(self,id: str, content: str):
        self.id = id
        self.content = content
        
class DraftArticle:
    def __init__(self,id: str,sections: list[DraftArticle]):
        self.id = 

def create_book_from_json(json_dict: Dict[str, any]) -> Book:
    id = json_dict['id']
    title = json_dict['title']
    language = json_dict['language']
    author = json_dict['author']
    
    catalogs = []
    for catalog_json in json_dict['catalogs']:
        catalog_title = catalog_json['title']
        chapters = []
        for chapter_json in catalog_json['chapters']:
            chapter_title = chapter_json['title']
            articles = []
            for article_json in chapter_json['articles']:
                article_title = article_json['title']
                article_slug = article_json['slug']
                sections = []
                article = Article(article_title, article_slug, sections)
                    for section_json in article_json['sections']:
                        title = section_json['title']
                        prompt = section_json['prompt']
                        id = section_json['id']
                        section = Section(id, title, prompt)
                        article.sections.append(section)
                articles.append(article)
            chapter = Chapter(chapter_title, articles)
            chapters.append(chapter)
        catalog = Catalog(catalog_title, chapters)
        catalogs.append(catalog)
    
    return Book(id,title, language,author, catalogs)