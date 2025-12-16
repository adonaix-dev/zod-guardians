import type { ZodTuple } from "zod";

import type { Assert } from "@adonaix/types";

import { ArgumentsError } from "~/Core/Error/ArgumentsError";
import { resolveSchema } from "~/Core/ResolveSchema";
import type { ThisArg } from "~/Common/ThisArg";
import type { ZodRawFunction } from "~/Common/ZodRawFunction";
import type { ZodSchema } from "~/Common/ZodSchema";
import type { ZodSchemaArguments } from "~/Common/ZodSchemaArguments";
import type { ZodSchemaDefinition } from "~/Common/ZodSchemaDefinition";
import type { ZodSchemaRest } from "~/Common/ZodSchemaRest";
import type { ZodRawArguments } from "~/Core/Types/ZodRawArguments";

import type { ZodGuardedFunction } from "./Types/ZodGuardedFunction";

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
    readonly #fun: ZodRawFunction<This, Args, Return>;

    private constructor(
        args: ZodSchemaDefinition<Args>,
        fun: ZodRawFunction<This, Args, Return>,
    ) {
        this.#schema = resolveSchema(args);
        this.#fun = fun;
    }

    /**
     * Creates a new {@link ZodFunction `ZodFunction`} instance.
     *
     * @param args The definition of the arguments schemas. To define
     *   a rest parameter, wrap the last schema in an array (e.g.,
     *   `[z.string()]`).
     * @param fun The implementation of the function.
     */
    static create<const As extends ZodSchema, Return, This = void>(
        args: ZodSchemaDefinition<As>,
        fun: ZodRawFunction<This, As, Return>,
    ): ZodFunction<This, As, Return> {
        return new ZodFunction(args, fun);
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
    apply(args: ZodRawArguments<Args>, thisArg: ThisArg<This>): Return {
        const { success, data, error } = this.#schema.safeParse(args);

        if (success) {
            return Reflect.apply(this.#fun, thisArg, data);
        }

        throw new ArgumentsError(error.issues);
    }

    /**
     * Compiles the validation and implementation into a single native
     * function.
     *
     * @returns A function that can be called directly.
     */
    compile(): ZodGuardedFunction<This, Args, Return> {
        const self = this;

        return function (
            this: This,
            ...args: Assert<ZodRawArguments<Args>, any[]>
        ): Return {
            return self.apply(args, this as any);
        };
    }
}

export { ZodFunction };
