import { marked, RendererThis, Tokens } from 'marked';

const HEADING_OFFSET = 2;

const extension = {
    useNewRenderer: true,
    renderer: {
      heading(this: RendererThis, token: Tokens.Heading): string {
        // increase depth by `offset`
        const text = this.parser.parseInline(token.tokens);
        const level = token.depth + HEADING_OFFSET;
        return `<h${level}>${text}</h${level}>`;
      }
    }
  };
  
  marked.use(extension);

  export default marked.parse