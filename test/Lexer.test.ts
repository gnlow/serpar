import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts"
import { Lexer } from "../src/Lexer.ts"
import { IndentLexer } from "../src/plugin/indentLexer.ts"

const lexer = new Lexer(
    [
        ["ws", /[^\S\n]+/],
        ["Num", /\d+(.\d+)?/],
        ["Id", /[a-zA-Z]+/],
        ["Op", /[+\-*/()]/],
    ],
    [ new IndentLexer ],
)

Deno.test("Lexer.print - basic arithmetic", () => {
    assertEquals(
        lexer.print("1.25 + 2"),
        "Num(1.25) Op(+) Num(2)",
    )
})

Deno.test("Lexer.print - indent", () => {
    assertEquals(
        lexer.print(
            "hello\n" +
            "   world(2)"
        ),
        "Id(hello) NL INDENT Id(world) Op(() Num(2) Op()) DEDENT",
    )
})