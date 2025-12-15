import type { ZodType } from "zod";

import type { ZodSchema } from "./ZodSchema";

/**
 * Extracts the **rest** parameter schema from a
 * {@link ZodSchema `ZodSchema`} tuple, if one is defined.
 *
 * @template Args The tuple of Zod schemas.
 */
type ZodSchemaRest<Args extends ZodSchema> = Args extends readonly [
    ...ZodType[],
    readonly [infer Rest],
]
    ? Rest extends ZodType
        ? Rest
        : never
    : never;

export type { ZodSchemaRest };
