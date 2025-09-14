declare module 'clsx' {
  export type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null | boolean;
  export interface ClassDictionary {
    [id: string]: any;
  }
  export interface ClassArray extends Array<ClassValue> { }
  export function clsx(...inputs: ClassValue[]): string;
}

declare module 'tailwind-merge' {
  export function twMerge(...inputs: string[]): string;
}