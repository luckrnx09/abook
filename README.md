<h1 align="center">⚡ abook⚡</h1>
<p align="center">
An AI powered command-line tool for generating any books from scratch
</p>

<div align="center">
Here is a book written based on abook:

📚 **Python Guide for JavaScript Engineers** | [Read it online](http://luckrnx09.com/python-guide-for-javascript-engineers/)
</div>

## Getting started
### Prepare
Run `cp .env.example .env` then fill the `.env` file:
- OPENAI_API_KEY: Required, string, type your open api key
- OPENAI_MODEL: Required, string, type your open ai model name
- OPENAI_BASE_URL: Optional, string, type your custom openai api url
- VERBOSE: Optional, `true` or `false`, determine whether or not to print conversation details when interacting with openai

### Install
You can install `abook` as a global command as following: 
```bash
yarn global add abook
```
or
```bash
npm install -g abook
```
or
```bash
pnpm install -g abook
```
Then you can use `abook -V` to print the abook version installed.

If you don't want to install it globally, you can use `npx` to run abook directly: 
```bash
npx abook
```
### Usage
|command|description|
|--|--|
 | ls              |list all the ideas|
 | new             |create an idea|
 | outline <idea>  |generate outline from an idea|
 | publish <idea>  |convert book content to markdown|
 | rm <idea>       |remove an idea|
 | run <idea>      |generate book content from an idea with outline|
 | help [command]  |display help for command|

## Develop
TODO

## Contribute
Any code enhancements, documentation updates, unit tests are welcome.

Any changes that alter functionality, please submit an issue first.

## License
This project is under [MIT](LICENSE) license
