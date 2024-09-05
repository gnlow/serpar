import { pipe } from "./pipe.ts"
import { Token, Tree } from "./types.ts"

const handler: ProxyHandler<object> = {
    get(_, prop: string) {
        return (...tree: (string | Tree)[]) => new Tree(
            prop,
            ...tree,
        )
    }
}

export const $ = new Proxy({}, handler) as Record<string, (...tree: (string | Tree)[]) => Token>

const templateNormalize =
(input: string | TemplateStringsArray, ...params: unknown[]) =>
    typeof input == "string"
        ? input
        : input.reduce((prev, curr, i) => prev + params[i-1] + curr)

const taggable =
<O>
(f: (str: string) => O) =>
(input: string | TemplateStringsArray, ...params: unknown[]) =>
    f(templateNormalize(input, ...params))

export const rules = taggable(
    (ruleStr: string) => pipe(
        ruleStr,
        x => x
            .trim()
            .split("\n")
            .map(x => x
                .split("->")
                .map(x => x.trim())
            ),
        Object.fromEntries,
    )
)
