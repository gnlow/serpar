import { Token, Tree, Parser } from "../util/types.ts"
import { escape } from "jsr:@std/regexp@1.0.0/escape"

export class RWParser implements Parser {
    rule
    constructor(rule: Record<string, string>) {
        this.rule = rule
    }

    parse(tokens: Token[]): Tree {
        const list: string[] = []
        const input = tokens.map((token, i) => {
            return token.type + i
        }).join(" ")
        let output = input
        let prev = output

        while (true) {
            for (const [from, to] of Object.entries(this.rule)) {
                prev = output
                const regex = new RegExp(
                    from
                        .split(" ")
                        .map(x => escape(x) + "\\d*")
                        .join(" "),
                )
                output = output.replace(regex, match => {
                    // console.log(`[${from} -> ${to}]`)
                    // console.log(output, "\n")
                    list.push(match)
                    return to + (tokens.length + list.length - 1)
                })
                if (prev != output) break
            }
            if (prev == output) break
        }

        const makeTree = (id: string): Tree => {
            const index = Number(id.match(/\d+$/)?.[0] || -1)
            if (index == -1) return new Tree(id)

            const type = id.match(/^(.*[^\d]+)\d+$/)![1]

            if (index < tokens.length) {
                return tokens[index]
            } else {
                const result =
                    list[index - tokens.length]
                        .split(" ")
                        .flatMap(makeTree)
                if (type[0] < "Z") {
                    return new Tree(
                        type,
                        ...result,
                    )
                } else {
                    return new Tree(Tree.ROOT, ...result)
                }
            }
        }

        return new Tree(
            Tree.ROOT,
            ...output
                .split(" ")
                .map(makeTree),
        )
    }

    static from(rule: Record<string, string>) {
        return new RWParser(rule)
    }
}
