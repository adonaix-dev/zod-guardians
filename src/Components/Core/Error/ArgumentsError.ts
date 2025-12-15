import { createMessageBuilder } from "zod-validation-error";

import type { ZodIssue } from "~/Common/ZodIssue";

/**
 * Error thrown when arguments fail validation against a Zod schema.
 */
class ArgumentsError extends Error {
    static readonly #createMessage = createMessageBuilder({
        maxIssuesInMessage: 5,
        prefix: undefined,
    });

    override name = "ArgumentsError";

    constructor(issues: ZodIssue[]) {
        super(
            `failed to match to the provided arguments\n\t> ${ArgumentsError.#createMessage(issues as any)}`,
        );
    }
}

export { ArgumentsError };
