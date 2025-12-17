import type { UnionToIntersection } from "type-fest";

import type { ZodOverload } from "./ZodOverload";

/**
 * Represents the final compiled overloaded function type.
 *
 * @template This The type of the `this` context.
 * @template Overloads The list of registered overloads.
 */
type ZodGuardedOverloadedFunction<
    This,
    Overloads extends readonly ZodOverload[],
> = UnionToIntersection<
    {
        [Key in keyof Overloads]: Overloads[Key] extends {
            arguments: infer Arguments extends any[];
            return: infer Return;
        }
            ? (this: This, ...args: Arguments) => Return
            : never;
    }[number]
>;

export type { ZodGuardedOverloadedFunction };
