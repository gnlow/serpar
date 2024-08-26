import { Word } from "../util/types.ts"

type Rules = [string, RegExp][]

const isLowerCase =
(char: string) =>
    "a" <= char && char <= "z"

export class Lexer {
    rules
    constructor(rules: Rules) {
        this.rules = rules
    }

    *lex(input: string) {
        const lexer = new LexerInstance(this.rules, input)
        while (true) {
            const tokens = lexer.getNextTokens()
            if (!tokens) break
            if (!isLowerCase(tokens[0][0]))
                yield* tokens
        }
        yield* lexer.indents.map(_ => ["DEDENT"])
    }
    print(input: string) {
        return [...this.lex(input)].map(([type, ...args]) => type + (
            args.length
            && type != args[0]
                ? `(${args.join()})`
                : ""
        )).join(" ")
    }

    static from(rules: Rules) {
        return new Lexer(rules)
    }
}

const sticky =
(rx: RegExp) =>
    new RegExp(rx, "y")

export class LexerInstance {
    rules
    input
    pos = 0
    indents: number[] = []
    constructor(
        rules: Rules,
        input: string,
    ) {
        this.rules = rules
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

    readNL(): Word[] {
        this.pos++ // take \n
        const indent = this.read(/ +/).length

        let prevIndent = this.indents[this.indents.length-1] || -1

        const result: Word[] = [["NL"]]

        if (prevIndent < indent) {
            result.push(["INDENT"])
            this.indents.push(indent)
        } else while (prevIndent > indent) {
            this.indents.pop()
            prevIndent = this.indents[this.indents.length] || -1
            result.push(["DEDENT"])
        }

        return result
    }

    getNextTokens(): Word[] | false {
        if (this.remainder == "") return false

        for (const [id, rx] of this.rules) {
            const matched = this.read(rx)
            if (matched == "") continue
            return [[id, matched]]
        }

        if (this.remainder[0] == "\n") {
            return this.readNL()
        }

        throw new Error(`Unexpected '${this.remainder[0]}'`)
    }
}
