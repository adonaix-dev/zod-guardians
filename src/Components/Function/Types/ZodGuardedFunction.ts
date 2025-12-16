import type { ZodSchema } from "~/Common/ZodSchema";
import type { ZodRawArguments } from "~/Core/Types/ZodRawArguments";

/**
 * Represents the **compiled** function wrapper that is exposed to the
 * caller.
 *
 * @template This The type of the `this` context.
 * @template Args The tuple of Zod schemas.
 * @template Return The return type of the function.
 */
type ZodGuardedFunction<This = any, Args extends ZodSchema = ZodSchema, Return = any> = (
    this: This,
    ...args: ZodRawArguments<Args>
) => Return;

export type { ZodGuardedFunction };
