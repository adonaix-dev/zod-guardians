import { ArgumentsError } from "~/Core/Error/ArgumentsError";
import type { ZodIssue } from "~/Common/ZodIssue";

/**
 * Error thrown when no overload signature matches the provided
 * arguments.
 */
class OverloadsError extends Error {
    override name = "OverloadsError";
    override readonly cause!: ArgumentsError[];

    static #createErrors(issues: ZodIssue[][]): ArgumentsError[] {
        return issues.map((issues) => new ArgumentsError(issues));
    }

    constructor(issues: ZodIssue[][]) {
        const errors = OverloadsError.#createErrors(issues);

        super(
            `no overload signature matched the provided arguments\n${errors.reduce(
                (msg, error, i) => {
                    return `${msg}\tOverload at ${i}: ${error.toString().replace(/\n/, "\n\t")}\n`;
                },
                "",
            )}\b`,
        );

        Object.defineProperty(this, "cause", {
            value: errors,
            writable: false,
            configurable: true,
            enumerable: false,
        });
    }
}

export { OverloadsError };
