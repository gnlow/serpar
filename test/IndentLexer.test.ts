import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts"
import { Lexer } from "../src/Lexer.ts"
import { IndentLexer } from "../src/plugin/IndentLexer.ts"

const lexer = new Lexer(
    [
        ["ws", /[^\S\n]+/],
        ["Num", /\d+(.\d+)?/],
        ["Id", /[a-zA-Z]+/],
        ["Op", /[+\-*/()]/],
    ],
    [ new IndentLexer ],
)

Deno.test("IndentLexer - 1", () => {
    assertEquals(
        lexer.print(
            "hello\n" +
            "   world(2)"
        ),
        "Id(hello) NL INDENT Id(world) Op(() Num(2) Op()) DEDENT",
    )
})
Deno.test("IndentLexer - 2", () => {
    assertEquals(
        lexer.print(
            "hello\n" +
            "world(2)"
        ),
        "Id(hello) NL Id(world) Op(() Num(2) Op())",
    )
})
