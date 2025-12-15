import type { ZodSchema } from "~/Common/ZodSchema";
import type { ZodInputArguments } from "~/Core/Types/ZodInputArguments";

/**
 * Represents the **compiled** function wrapper that is exposed to the
 * caller.
 *
 * @template This The type of the `this` context.
 * @template Args The tuple of Zod schemas.
 * @template Return The return type of the function.
 */
type ZodOutputFunction<This = any, Args extends ZodSchema = ZodSchema, Return = any> = (
    this: This,
    ...args: ZodInputArguments<Args>
) => Return;

export type { ZodOutputFunction };
