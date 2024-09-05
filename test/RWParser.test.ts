import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts"
import { RWParser } from "../src/RWParser.ts"
import { $, rules } from "../util/testHelper.ts"

const { Num, Div, Mul, BinExpr } = $

Deno.test("RWParser.parse - basic", () => {
    assertEquals(
        RWParser.from(rules`
            Mul -> opA
            Div -> opA
            Add -> opB
            Sub -> opB
            expr opA expr -> BinExpr
            expr opB expr -> BinExpr
            Num -> expr
            BinExpr -> expr
        `).parse([
            Num("1"),
            Div(),
            Num("2"),
            Mul(),
            Num("3"),
        ]),
        BinExpr(
            BinExpr(
                Num("1"),
                Div(),
                Num("2"),
            ),
            Mul(),
            Num("3"),
        )
    )
})
