import type { ZodOverloadedArguments } from "./ZodOverloadedArguments";
import type { ZodOverload } from "./ZodOverload";

/**
 * Determines the return type based on the matching overload for the
 * provided arguments.
 *
 * @template Overloads The list of registered overloads.
 * @template Args The arguments provided to the function.
 */
type ZodOverloadReturn<
    Overloads extends readonly ZodOverload[],
    Args extends ZodOverloadedArguments<Overloads>,
> = Overloads extends readonly [
    infer First extends ZodOverload,
    ...infer Tail extends readonly ZodOverload[],
]
    ? Args extends First["arguments"]
        ? First["return"]
        : ZodOverloadReturn<Tail, Args>
    : never;

export type { ZodOverloadReturn };
