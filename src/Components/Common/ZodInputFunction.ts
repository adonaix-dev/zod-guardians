import type { ZodOutputArguments } from "~/Core/Types/ZodOutputArguments";

import type { ZodSchema } from "./ZodSchema";

/**
 * Represents the **implementation** of a function that accepts
 * arguments validated by Zod.
 *
 * @template This The type of the `this` context.
 * @template Args The tuple of Zod schemas.
 * @template Return The return type of the function.
 */
type ZodInputFunction<This = any, Args extends ZodSchema = ZodSchema, Return = any> = (
    this: This,
    ...args: ZodOutputArguments<Args>
) => Return;

export type { ZodInputFunction };
