declare module 'sanitize-html' {
  export interface TransformTagResult {
    tagName: string;
    attribs: Record<string, string>;
  }

  export interface IOptions {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    allowedSchemes?: string[];
    allowProtocolRelative?: boolean;
    transformTags?: Record<
      string,
      (tagName: string, attribs: Record<string, string>) => TransformTagResult
    >;
  }

  function sanitizeHtml(dirty: string, options?: IOptions): string;
  export default sanitizeHtml;
}
