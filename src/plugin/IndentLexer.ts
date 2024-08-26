import {
    LexerInstance,
    LexerPlugin,
    LexerPluginInstance,
} from "../Lexer.ts"
import { Word } from "../../util/types.ts"

export class IndentLexer extends LexerPlugin {
    createInstance() {
        return new IndentLexerInstance()
    }
}

class IndentLexerInstance extends LexerPluginInstance {
    indents: number[] = []

    getNextTokens(instance: LexerInstance) {
        console.log(this.indents, instance.remainder.slice(0, 10))
        if (instance.remainder[0] != "\n") return false

        instance.pos++ // take \n
        const indent = instance.read(/ +/).length

        let prevIndent = this.indents[this.indents.length-1] || 0

        const result: Word[] = [["NL"]]

        if (prevIndent < indent) {
            result.push(["INDENT"])
            this.indents.push(indent)
        } else while (prevIndent > indent) {
            this.indents.pop()
            prevIndent = this.indents[this.indents.length] || 0
            result.push(["DEDENT"])
        }

        return result
    }
    *onEnd() {
        yield* this.indents.map(_ => ["DEDENT"])
    }
}
