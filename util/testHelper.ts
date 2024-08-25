import { Word, Tree } from "./types.ts"

const handler: ProxyHandler<object> = {
    get(_, prop) {
        return (...tree: (string | Tree)[]) => [
            prop,
            ...tree,
        ]
    }
}

export const $ = new Proxy({}, handler) as Record<string, (...tree: (string | Tree)[]) => Word>
