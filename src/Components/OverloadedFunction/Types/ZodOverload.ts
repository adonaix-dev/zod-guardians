import type { ZodSchema } from "~/Common/ZodSchema";
import type { ZodInputArguments } from "~/Core/Types/ZodInputArguments";

/**
 * Represents the structure of a single function overload.
 *
 * @template Args The input arguments type for this overload.
 * @template Return The return type for this overload.
 */
interface ZodOverload<Args extends ZodSchema = ZodSchema, Return = any> {
    arguments: ZodInputArguments<Args>;
    return: Return;
}

export type { ZodOverload };
