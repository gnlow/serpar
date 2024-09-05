import {
    LexerInstance,
    LexerPlugin,
    LexerPluginInstance,
} from "../Lexer.ts"
import { Token } from "../../util/types.ts"

export class IndentLexer extends LexerPlugin {
    createInstance() {
        return new IndentLexerInstance()
    }
}

class IndentLexerInstance extends LexerPluginInstance {
    indents: number[] = []

    getNextTokens(instance: LexerInstance) {
        if (instance.remainder[0] != "\n") return false

        instance.pos++ // take \n
        const indent = instance.read(/ +/).length

        let prevIndent = this.indents[this.indents.length-1] || 0

        const result: Token[] = [new Token("NL")]

        if (prevIndent < indent) {
            result.push(new Token("INDENT"))
            this.indents.push(indent)
        } else while (prevIndent > indent) {
            this.indents.pop()
            prevIndent = this.indents[this.indents.length] || 0
            result.push(new Token("DEDENT"))
        }

        return result
    }
    *onEnd() {
        yield* this.indents.map(_ => new Token("DEDENT"))
    }
}
