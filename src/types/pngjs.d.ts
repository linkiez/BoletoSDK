declare module 'pngjs' {
  export interface PNGOptions {
    width?: number;
    height?: number;
    colorType?: number;
  }

  export class PNG {
    static sync: {
      write(png: PNG): Buffer;
    };

    data: Buffer;
    height: number;
    width: number;

    constructor(options?: PNGOptions);
  }
}
