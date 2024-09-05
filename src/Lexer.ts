import { Token } from "../util/types.ts"

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
            if (!isLowerCase(tokens[0].type))
                yield* tokens
        }
        for (const plugin of instance.pluginInstances) {
            yield* plugin.onEnd(instance)
        }
    }
    print(input: string) {
        return [...this.lex(input)].map(({ type, children }) => type + (
            children.length
            && type != children[0]
                ? `(${children.join()})`
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
    pluginInstances
    input
    pos = 0
    constructor(
        lexer: Lexer,
        input: string,
    ) {
        this.lexer = lexer
        this.input = input
        this.pluginInstances = lexer.plugins
            .map(plugin => plugin.createInstance())
    }

    get remainder() {
        return this.input.slice(this.pos)
    }

    read(rx: RegExp) {
        const matched = this.remainder.match(sticky(rx))?.[0] || ""
        this.pos += matched.length
        return matched
    }

    getNextTokens(): Token[] | false {
        if (this.remainder == "") return false

        for (const [id, rx] of this.lexer.rules) {
            const matched = this.read(rx)
            if (matched == "") continue
            return [new Token(id, matched)]
        }

        for (const pluginInstance of this.pluginInstances) {
            const result = pluginInstance.getNextTokens(this)
            if (result) return result
        }

        throw new Error(`Unexpected '${this.remainder[0]}'`)
    }
}

export abstract class LexerPlugin {
    abstract createInstance(): LexerPluginInstance
}

export abstract class LexerPluginInstance {
    abstract getNextTokens(instance: LexerInstance): Token[] | false
    *onEnd(_instance: LexerInstance): Generator<Token> {}
}