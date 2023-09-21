import { Writable } from 'stream';


export default class WritableStream extends Writable {
  data = '';

  // @ts-ignore
  override write(chunk: any, encoding: BufferEncoding, callback?: (error: Error | null | undefined) => void): boolean {
    this.data = this.data.concat(chunk.toString());
    callback?.(null);
    return true;
  }

  writeString(message: string) {
    this.data = this.data.concat(message);
  }
}
