import type { ZodOverload } from "./ZodOverload";

/**
 * Represents the union of argument types accepted by the defined
 * overloads.
 *
 * @template Overloads The list of registered overloads.
 */
type ZodOverloadedArguments<Overloads extends readonly ZodOverload[]> = {
    [Key in keyof Overloads]: Overloads[Key]["arguments"];
}[keyof Overloads];

export type { ZodOverloadedArguments };
