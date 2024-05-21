from schema.typing import create_book_from_json
from dotenv import load_dotenv
from writer.factory import create_writer
import os
import json
import sys
from datetime import datetime
import time

load_dotenv(override=True)


def write_file(filename, content):
    folder_path = os.path.dirname(filename)
    file_name = os.path.basename(filename)
    
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
    
    with open(os.path.join(folder_path, file_name), 'w', encoding='utf-8') as file:
        file.write(content)


def main():
    if len(sys.argv) < 2:
        raise Exception("metadata file is required")
    metadata_filename = sys.argv[1]
    if not os.path.exists(metadata_filename):
        raise Exception(f"metadata file '{metadata_filename}' is not exist")
    
    error_count = 0
    with open(metadata_filename, 'r', encoding='utf-8') as file:
        book = create_book_from_json(json.load(file))
        acquired = []
        for catalog in book.catalogs:
            for chapter in catalog.chapters:
                for article in chapter.articles:
                    filename = os.path.join('.books', book.title, catalog.title,
                                            chapter.title,
                                            f"{article.title}.md")
                    if os.path.exists(filename):
                        acquired.append(article.title)
                        continue
                    print(f'[{datetime.now()}] Generating article: [{article.title}.md]')
                    try:
                        markdown = create_writer(book.source, book.target, article,
                                                 acquired).write()
                        write_file(filename, markdown)
                        print(f'\t ✔️ [{article.title}.md] '
                              f'was saved!')
                    except Exception as e:
                        error_count += 1
                        print(f'\t ❌ [{article.title}.md] '
                              f'generate failed!')
                        print(e)
                        time.sleep(10)
                    
                    acquired.append(article.title)
    if error_count > 0:
        print(f'⚠️ {error_count} articles generate failed, a re-run will automatically '
              f'regenerate them')
    else:
        print(f'🎉 All the articles of the book [{book.title}] are generated!')


main()
