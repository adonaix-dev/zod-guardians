import type { ZodTuple } from "zod";

import type { Assert } from "@adonaix/types";

import { ArgumentsError } from "~/Core/Error/ArgumentsError";
import { resolveSchema } from "~/Core/ResolveSchema";
import type { ThisArg } from "~/Common/ThisArg";
import type { ZodInputFunction } from "~/Common/ZodInputFunction";
import type { ZodSchema } from "~/Common/ZodSchema";
import type { ZodSchemaArguments } from "~/Common/ZodSchemaArguments";
import type { ZodSchemaDefinition } from "~/Common/ZodSchemaDefinition";
import type { ZodSchemaRest } from "~/Common/ZodSchemaRest";
import type { ZodInputArguments } from "~/Core/Types/ZodInputArguments";

import type { ZodOutputFunction } from "./Types/ZodOutputFunction";

/**
 * Represents a function wrapper that automatically validates its
 * arguments using Zod schemas before execution.
 *
 * @template This The type of the `this` context.
 * @template Args The tuple of Zod schemas.
 * @template Return The return type of the function.
 */
class ZodFunction<This, Args extends ZodSchema = ZodSchema, Return = any> {
    readonly #schema: ZodTuple<ZodSchemaArguments<Args>, ZodSchemaRest<Args>>;
    readonly #fn: ZodInputFunction<This, Args, Return>;

    private constructor(
        args: ZodSchemaDefinition<Args>,
        fn: ZodInputFunction<This, Args, Return>,
    ) {
        this.#schema = resolveSchema(args);
        this.#fn = fn;
    }

    /**
     * Creates a new {@link ZodFunction `ZodFunction`} instance.
     *
     * @param args The definition of the arguments schemas. To define
     *   a rest parameter, wrap the last schema in an array (e.g.,
     *   `[z.string()]`).
     * @param fn The implementation of the function.
     */
    static create<const As extends ZodSchema, Return, This = void>(
        args: ZodSchemaDefinition<As>,
        fn: ZodInputFunction<This, As, Return>,
    ): ZodFunction<This, As, Return> {
        return new ZodFunction(args, fn);
    }

    /**
     * Executes the function with the provided arguments and `this`
     * context, performing validation.
     *
     * @param args The input arguments to validate and pass to the
     *   function.
     * @param thisArg The `this` context for the function execution.
     *
     * @returns The return value of the implemented function.
     * @throws {ArgumentsError} If validation fails.
     */
    apply(args: ZodInputArguments<Args>, thisArg: ThisArg<This>): Return {
        const { success, data, error } = this.#schema.safeParse(args);

        if (success) {
            return Reflect.apply(this.#fn, thisArg, data);
        }

        throw new ArgumentsError(error.issues);
    }

    /**
     * Compiles the validation and implementation into a single native
     * function.
     *
     * @returns A function that can be called directly.
     */
    compile(): ZodOutputFunction<This, Args, Return> {
        const self = this;

        return function (
            this: This,
            ...args: Assert<ZodInputArguments<Args>, any[]>
        ): Return {
            return self.apply(args, this as any);
        };
    }
}

export { ZodFunction };
