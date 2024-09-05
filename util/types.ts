export class Tree {
    type: string
    children: (Tree | string)[]
    constructor(
        type: string,
        ...children: (Tree | string)[]
    ) {
        if (
            type == Tree.ROOT
            && children.length == 1
        ) {
            const child = children[0]
            if (typeof child == "string") {
                throw new Error("?")
            }
            this.type = child.type
            this.children = child.children
        } else {
            this.type = type
            this.children = children    
        }
    }

    static get ROOT() {
        return "__ROOT"
    }
}

export class Token extends Tree {
    constructor(
        type: string,
        ...children: string[]
    ) {
        super(type, ...children)
    }
}

export interface Parser {
    parse(tokens: Token[]): Tree
}