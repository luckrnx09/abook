import {
  BaseOutputParser,
  OutputParserException,
} from '@langchain/core/output_parsers';

class MarkdownParser extends BaseOutputParser<string> {
  lc_namespace = ['langchain', 'output_parsers'];

  async parse(llmOutput: string): Promise<string> {
    try {
      const regex = /<RESPONSE>([\s\S]*?)<\/RESPONSE>/;
      const match = llmOutput.match(regex);
      const markdown = match ? match[1] : null;
      if (markdown === null) {
        throw new Error('Expected markdown be in <RESPONSE> tag');
      }
      return markdown;
    } catch (e) {
      throw new OutputParserException(
        `Failed to parse. Text: "${llmOutput}" \nError: ${(e as Error).message}`
      );
    }
  }

  getFormatInstructions(): string {
    return ''; // Keep it empty and move the instruction to the end of the system prompt because it's not working well in GPT 3.5
  }
}

const markdownParser = new MarkdownParser();
export {markdownParser};
