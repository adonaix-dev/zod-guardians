import type { ZodTuple } from "zod";

import { ArgumentsError } from "~/Core/Error/ArgumentsError";
import { resolveSchema } from "~/Core/ResolveSchema";
import type { ZodSchema } from "~/Common/ZodSchema";
import type { ZodSchemaArguments } from "~/Common/ZodSchemaArguments";
import type { ZodSchemaDefinition } from "~/Common/ZodSchemaDefinition";
import type { ZodSchemaRest } from "~/Common/ZodSchemaRest";

import type { ZodGuardedArguments } from "./Types/ZodGuardedArguments";
import type { ZodRawArguments } from "./Types/ZodRawArguments";

/**
 * A utility class for validating a list of arguments against a
 * defined tuple of Zod schemas.
 *
 * @template Args The tuple of Zod schemas.
 */
class ZodArguments<Args extends ZodSchema = ZodSchema> {
    readonly #schema: ZodTuple<ZodSchemaArguments<Args>, ZodSchemaRest<Args>>;

    private constructor(args: ZodSchemaDefinition<Args>) {
        this.#schema = resolveSchema(args);
    }

    /**
     * Creates a new {@link ZodArguments `ZodArguments`} instance.
     *
     * @param args The definition of the arguments schemas. To define
     *   a rest parameter, wrap the last schema in an array (e.g.,
     *   `[z.string()]`).
     */
    static create<const As extends ZodSchema>(
        args: ZodSchemaDefinition<As>,
    ): ZodArguments<As> {
        return new ZodArguments(args);
    }

    /**
     * Validates the provided arguments against the defined schemas.
     *
     * @param args The input arguments to validate.
     *
     * @returns The validated and transformed output arguments.
     * @throws {ArgumentsError} If validation fails.
     */
    assert(args: ZodRawArguments<Args>): ZodGuardedArguments<Args> {
        const { success, data, error } = this.#schema.safeParse(args);
        if (success) {
            return data as any;
        }

        throw new ArgumentsError(error.issues);
    }
}

export { ZodArguments };
