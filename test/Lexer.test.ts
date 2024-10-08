import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts"
import { Lexer } from "../src/Lexer.ts"

const lexer = new Lexer(
    [
        ["ws", /[^\S\n]+/],
        ["Num", /\d+(.\d+)?/],
        ["Id", /[a-zA-Z]+/],
        ["Op", /[+\-*/()]/],
    ],
)

Deno.test("Lexer.print - basic arithmetic", () => {
    assertEquals(
        lexer.print("1.25 + 2"),
        "Num(1.25) Op(+) Num(2)",
    )
})
