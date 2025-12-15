import type { ZodType } from "zod";

import type { ZodSchema } from "./ZodSchema";

/**
 * Extracts the **fixed** argument schemas from a
 * {@link ZodSchema `ZodSchema`} tuple, excluding the rest parameter
 * definition if it exists.
 *
 * @template Args The tuple of Zod schemas.
 */
type ZodSchemaArguments<Args extends ZodSchema> = Args extends readonly [
    ...infer SchemaArguments extends ZodType[],
    readonly [ZodType],
]
    ? SchemaArguments
    : Args;

export type { ZodSchemaArguments };
