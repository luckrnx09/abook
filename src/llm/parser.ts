import { BaseOutputParser, OutputParserException } from "@langchain/core/output_parsers";

class MarkdownParser extends BaseOutputParser<string> {
  lc_namespace = ['langchain', 'output_parsers'];

  async parse(llmOutput: string): Promise<string> {
    try {
      const regex = /<RESPONSE>(.*?)<\/RESPONSE>/;
      const match = llmOutput.match(regex);
      const markdown = match ? match[1] : null;
      if (markdown === null) {
        throw new Error('Expected markdown be in <RESPONSE> tag');
      }
      return markdown;
    } catch (e) {
      throw new OutputParserException(
        `Failed to parse. Text: "${llmOutput}". Error: ${(e as Error).message}`
      );
    }
  }

  getFormatInstructions(): string {
    return 'Stick to output a markdown format and go in the <RESPONSE>real markdown content here</RESPONSE> tag. Do not return anything else.';
  }
}

export {MarkdownParser};
