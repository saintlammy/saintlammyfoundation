declare module 'qrcode' {
  export function toDataURL(text: string, options?: any): Promise<string>;
  export function toString(text: string, options?: any): Promise<string>;
  export function toBuffer(text: string, options?: any): Promise<Buffer>;
  export function toFile(path: string, text: string, options?: any): Promise<void>;
  export function toFileStream(stream: any, text: string, options?: any): void;
}