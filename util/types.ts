export type Word = string[]
export type Tree = Word | [string, ...Tree[]]

export interface Parser {
    parse(words: Word[]): Tree[]
}