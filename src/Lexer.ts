import { Word } from "../util/types.ts"

type Rules = [string, RegExp][]

const isLowerCase =
(char: string) =>
    "a" <= char && char <= "z"

export class Lexer {
    rules
    plugins
    constructor(
        rules: Rules,
        plugins: LexerPlugin[] = [],
    ) {
        this.rules = rules
        this.plugins = plugins
    }

    *lex(input: string) {
        const instance = new LexerInstance(this, input)
        while (true) {
            const tokens = instance.getNextTokens()
            if (!tokens) break
            if (!isLowerCase(tokens[0][0]))
                yield* tokens
        }
        for (const plugin of this.plugins) {
            yield* plugin.onEnd(instance)
        }
    }
    print(input: string) {
        return [...this.lex(input)].map(([type, ...args]) => type + (
            args.length
            && type != args[0]
                ? `(${args.join()})`
                : ""
        )).join(" ")
    }

    static from(
        rules: Rules,
        plugins: LexerPlugin[] = [],
    ) {
        return new Lexer(rules, plugins)
    }
}

const sticky =
(rx: RegExp) =>
    new RegExp(rx, "y")

export class LexerInstance {
    lexer
    input
    pos = 0
    constructor(
        lexer: Lexer,
        input: string,
    ) {
        this.lexer = lexer
        this.input = input
    }

    get remainder() {
        return this.input.slice(this.pos)
    }

    read(rx: RegExp) {
        const matched = this.remainder.match(sticky(rx))?.[0] || ""
        this.pos += matched.length
        return matched
    }

    getNextTokens(): Word[] | false {
        if (this.remainder == "") return false

        for (const [id, rx] of this.lexer.rules) {
            const matched = this.read(rx)
            if (matched == "") continue
            return [[id, matched]]
        }

        for (const plugin of this.lexer.plugins) {
            const result = plugin.getNextTokens(this)
            if (result) return result
        }

        throw new Error(`Unexpected '${this.remainder[0]}'`)
    }
}

export abstract class LexerPlugin {
    abstract getNextTokens(instance: LexerInstance): Word[] | false
    *onEnd(_instance: LexerInstance): Generator<Word> {}
}
