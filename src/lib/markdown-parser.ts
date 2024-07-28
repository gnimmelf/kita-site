import DOMPurify from "isomorphic-dompurify";
import { marked, MarkedExtension, RendererThis, Tokens } from 'marked';
import { mangle } from "marked-mangle";

const HEADING_OFFSET = 2;

const customExtension = (): MarkedExtension => {
  return {
    useNewRenderer: true,
    renderer: {
      heading(this: RendererThis, token: Tokens.Heading): string {
        // increase depth by `offset`
        const text = this.parser.parseInline(token.tokens);
        const level = token.depth + HEADING_OFFSET;
        return `<h${level}>${text}</h${level}>`;
      },
      link(this: RendererThis, token: Tokens.Link): string {
        const text = this.parser.parseInline(token.tokens);
        const isExternal = token.href.startsWith('http')
        const html = `<a ${isExternal ? 'target="_blank"' : ''} href="${token.href}">${text}</a>`
        return html
      }
    }
  }
}

marked.use(mangle());
marked.use(customExtension());

export default async (mdStr: string , options = { sanitizeHtml: false }) => {
  let html = await marked.parse(mdStr)

  if (options.sanitizeHtml) {
    console.log('Sanitizing rendered markdown')
    html = DOMPurify.sanitize(html, {
      ADD_ATTR: ['target']
    })
  }

  return html
}