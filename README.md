<h1 align="center">⚡ abook⚡</h1>
<p align="center">
An AI writer for programming books that instruct developers to move easily from the acquired tech stack or program language to another
</p>

<div align="center">
Here's a book written by abook:

[Python for Web Developers: A Practical Guide](example/Python%20for%20Web%20Developers:%20A%20Practical%20Guide)

</div>

## Quick start 🚀
Notice: abook relies on [langchain](https://python.langchain.com/docs/get_started/introduction), we recommend to use Python 3.9+

1. Clone the repository

```bash
git clone https://github.com/luckrnx09/abook.git
cd abook
```

2. Install the dependencies

You should install [poetry](https://python-poetry.org/docs/basic-usage/#initialising-a-pre-existing-project) first, then run command:  
```bash
poetry install
```

3. Edit the `.env` file
```bash
vi .env
```
Set the `OPENAI_API_KEY`and `OPENAI_MODEL` variables
```bash
OPENAI_API_KEY=<your-api-key> # If not filled in, OPENAI_API_KEY will be read from the environment variable.
OPENAI_MODEL=<model-name> # Since generating books consumes more tokens, it is recommended to use a model with a larger context, defaulting to the ’gpt-3.5-turbo-16k‘
```


4. Prepare a book `metadata.json`

You can handwrite a JSON-formatted book catalog
```json
{
  "title": "Python for Web Developers: A Practical Guide",
  "source": "JavaScript",
  "target": "Python",
  "catalogs": [
    {
      "title": "Part 1: Python Basics",
      "chapters": [
        {
          "title": "Chapter 1 - Environment Setup",
          "articles": [
            {
              "title": "1. Python Installation",
              "type": "environment",
              "requirements": []
            }
          ]
        }
      ]
    }
  ]
}
```
It says a book called "Python for Web Developers: A Practical Guide" is going to be written to teach JavaScript engineers to learn Python quickly, and articles listed in catalogs will be created later.

You can see a full example [metadata.json](example/metadata.json).

Also, you can use ChatGPT to generate one, with prompts along the following:

---

You are working on a new book that instruct JavaScript engineer to learn Python, please generate a catalogs for me with JSON format.
Here is a example:

```json
{
  "title": "Book title",
  "source": "JavaScript",
  "target": "Python",
  "catalogs": [
    {
      "title": "Part title",
      "chapters": [
        {
          "title": "Chapter title",
          "articles": [
            {
              "title": "1. Article title",
              "type": "comparison", 
              "requirements": []
            }
          ]
        }
      ]
    }
  ]
}
```

---

The value of `article.type` can be: 
- environment: For articles are related to environment setup
- comparison: For articles instruct knowledge to readers by compare `source` and `target`
- cli: For articles instruct a command line tool
- resource: For articles to list the 3rd-party resources

The value of `article.requirements` is a string array. Any special requirements for writing can be added into it.

5. Run abook
```shell
poetry run python ./main.py <path-to-metadata.json>
```

AI may not write the book all at once (consider network connectivity, request frequency limitations, etc.).

You can run this command above again when some articles written failed.

It will automatically skip the articles that have already been written.

Finally, the book will save to the `.book` folder.

🎉 Enjoy it!

## License 📝

[MIT](LICENSE)
