type Fn<A, B> = (input: A) => B

interface Pipe {
    <A>(value: A): A
    <A, B>(value: A, fn1: Fn<A, B>): B
    <A, B, C>(value: A, fn1: Fn<A, B>, fn2: Fn<B, C>): C
    <A, B, C, D>(
        value: A,
        fn1: Fn<A, B>,
        fn2: Fn<B, C>,
        fn3: Fn<C, D>,
    ): D
    <A, B, C, D, E>(
        value: A,
        fn1: Fn<A, B>,
        fn2: Fn<B, C>,
        fn3: Fn<C, D>,
        fn4: Fn<D, E>,
    ): E
    <A, B, C, D, E, F>(
        value: A,
        fn1: Fn<A, B>,
        fn2: Fn<B, C>,
        fn3: Fn<C, D>,
        fn4: Fn<D, E>,
        fn5: Fn<E, F>,
    ): F
    <A, B, C, D, E, F, G>(
        value: A,
        fn1: Fn<A, B>,
        fn2: Fn<B, C>,
        fn3: Fn<C, D>,
        fn4: Fn<D, E>,
        fn5: Fn<E, F>,
        fn6: Fn<F, G>,
    ): G
    <A, B, C, D, E, F, G, H>(
        value: A,
        fn1: Fn<A, B>,
        fn2: Fn<B, C>,
        fn3: Fn<C, D>,
        fn4: Fn<D, E>,
        fn5: Fn<E, F>,
        fn6: Fn<F, G>,
        fn7: Fn<G, H>,
    ): H
    <A, B, C, D, E, F, G, H, I>(
        value: A,
        fn1: Fn<A, B>,
        fn2: Fn<B, C>,
        fn3: Fn<C, D>,
        fn4: Fn<D, E>,
        fn5: Fn<E, F>,
        fn6: Fn<F, G>,
        fn7: Fn<G, H>,
        fn8: Fn<H, I>,
    ): I
    <A, B, C, D, E, F, G, H, I, J>(
        value: A,
        fn1: Fn<A, B>,
        fn2: Fn<B, C>,
        fn3: Fn<C, D>,
        fn4: Fn<D, E>,
        fn5: Fn<E, F>,
        fn6: Fn<F, G>,
        fn7: Fn<G, H>,
        fn8: Fn<H, I>,
        fn9: Fn<I, J>,
    ): J
}

export const pipe: Pipe = (value: unknown, ...fns: Fn<unknown, unknown>[]): unknown => {
    return fns.reduce((acc, fn) => fn(acc), value)
}