export declare type Key = string;
export declare type Customize = (a: any, b: any, key: Key) => any;
export interface ICustomizeOptions {
    customizeArray?: Customize;
    customizeObject?: Customize;
}
export declare enum CustomizeRule {
    Match = "match",
    Append = "append",
    Prepend = "prepend",
    Replace = "replace"
}
