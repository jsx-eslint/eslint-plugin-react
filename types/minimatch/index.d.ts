// Type override for minimatch to support TypeScript < 4.0
// Labeled tuple syntax [name: type] is not supported in TS 3.9

declare module 'minimatch' {
  export interface IMinimatch {
    pattern: string;
    options: IOptions;
    set: string[][];
    regexp: RegExp | null;
    negate: boolean;
    comment: boolean;
    empty: boolean;
    partial: boolean;

    makeRe(): RegExp | false;
    match(fname: string, partial?: boolean): boolean;
    matchOne(file: string[], pattern: string[], partial?: boolean): boolean;
    hasMagic(): boolean;
  }

  export interface IOptions {
    nobrace?: boolean;
    nocomment?: boolean;
    nonegate?: boolean;
    debug?: boolean;
    noglobstar?: boolean;
    noext?: boolean;
    nocase?: boolean;
    matchBase?: boolean;
    flipNegate?: boolean;
    partial?: boolean;
    dot?: boolean;
    preserveMultipleSlashes?: boolean;
    optimizationLevel?: number;
    platform?: string;
    windowsPathsNoEscape?: boolean;
  }

  export function minimatch(path: string, pattern: string, options?: IOptions): boolean;
  export function filter(pattern: string, options?: IOptions): (path: string) => boolean;
  export function match(list: string[], pattern: string, options?: IOptions): string[];
  export function makeRe(pattern: string, options?: IOptions): RegExp | false;

  export class Minimatch implements IMinimatch {
    constructor(pattern: string, options?: IOptions);
    pattern: string;
    options: IOptions;
    set: string[][];
    regexp: RegExp | null;
    negate: boolean;
    comment: boolean;
    empty: boolean;
    partial: boolean;

    makeRe(): RegExp | false;
    match(fname: string, partial?: boolean): boolean;
    matchOne(file: string[], pattern: string[], partial?: boolean): boolean;
    hasMagic(): boolean;
  }

  export default minimatch;
}
