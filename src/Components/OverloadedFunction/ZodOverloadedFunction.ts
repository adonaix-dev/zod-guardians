import { OverloadsError } from "~/OverloadedFunction/Error/OverloadsError";
import { OverloadRegistry } from "~/OverloadedFunction/Registry/OverloadRegistry";
import type { ThisArg } from "~/Common/ThisArg";
import type { ZodIssue } from "~/Common/ZodIssue";
import type { ZodRawFunction } from "~/Common/ZodRawFunction";
import type { ZodSchema } from "~/Common/ZodSchema";
import type { ZodSchemaDefinition } from "~/Common/ZodSchemaDefinition";

import type { ZodGuardedOverloadedFunction } from "./Types/ZodGuardedOverloadedFunction";
import type { ZodOverload } from "./Types/ZodOverload";
import type { ZodOverloadedArguments } from "./Types/ZodOverloadedArguments";
import type { ZodOverloadReturn } from "./Types/ZodOverloadReturn";

/**
 * Represents a function that supports multiple signatures
 * (overloads), validating arguments against Zod schemas to determine
 * the correct implementation to execute.
 *
 * @template This The type of the `this` context.
 * @template Overloads The list of registered overloads.
 */
class ZodOverloadedFunction<This, Overloads extends readonly ZodOverload[] = []> {
    #registry: OverloadRegistry;

    private constructor(registry: OverloadRegistry = OverloadRegistry.create()) {
        this.#registry = registry;
    }

    /**
     * Creates a new
     * {@link ZodOverloadedFunction `ZodOverloadedFunction`} instance.
     */
    static create<This = void>(): ZodOverloadedFunction<This> {
        return new ZodOverloadedFunction();
    }

    /**
     * Registers a new overload signature and its implementation.
     *
     * @param args The definition of the arguments schemas for this
     *   overload. To define a rest parameter, wrap the last schema in
     *   an array (e.g., `[z.string()]`).
     *
     *   If a function is provided, it is evaluated once at creation
     *   time and must return a stable schema definition.
     * @param fn The implementation of the function for this specific
     *   overload.
     *
     * @returns A new instance with the added overload.
     */
    overload<const As extends ZodSchema, R>(
        args: ZodSchemaDefinition<As>,
        fn: ZodRawFunction<This, As, R>,
    ): ZodOverloadedFunction<This, [ZodOverload<As, R>, ...Overloads]> {
        return new ZodOverloadedFunction(this.#registry.copyAndRegister(args, fn));
    }

    /**
     * Executes the function by finding the first matching overload
     * for the provided arguments.
     *
     * @param args The input arguments.
     * @param thisArg The `this` context.
     *
     * @returns The return value of the matched overload
     *   implementation.
     * @throws {OverloadsError} If no overload matches the provided
     *   arguments.
     */
    apply<As extends ZodOverloadedArguments<Overloads>>(
        args: As,
        thisArg: ThisArg<This>,
    ): ZodOverloadReturn<Overloads, As> {
        const issues: ZodIssue[][] = [];

        for (const { schema, fun } of this.#registry.getEntries()) {
            const { success, data, error } = schema.safeParse(args);
            if (success) {
                return Reflect.apply(fun, thisArg, data);
            }

            issues.push(error.issues);
        }

        throw new OverloadsError(issues);
    }

    /**
     * Bundles the registered overloads into a single closure that
     * handles dispatching.
     *
     * @returns A function that can be called directly.
     */
    compile(): ZodGuardedOverloadedFunction<This, Overloads> {
        const self = this;

        return function (this: This, ...args: any) {
            return self.apply(args, this as any);
        } as any;
    }
}

export { ZodOverloadedFunction };
