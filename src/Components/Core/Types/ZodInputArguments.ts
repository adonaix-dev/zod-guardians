import type { input, ZodType } from "zod";

import type { ZodSchema } from "~/Common/ZodSchema";
import type { ZodSchemaArguments } from "~/Common/ZodSchemaArguments";
import type { ZodSchemaRest } from "~/Common/ZodSchemaRest";

type ZodSchemaInputArguments<Args extends ZodSchema> =
    ZodSchemaArguments<Args> extends infer Args extends any[]
        ? {
              -readonly [Key in keyof Args]: input<Args[Key]>;
          }
        : never;

/**
 * Represents the input arguments derived from a tuple of type
 * {@link ZodSchema `ZodSchema`}.
 *
 * @template Args The tuple of Zod schemas.
 */
type ZodInputArguments<Args extends ZodSchema> =
    ZodSchemaRest<Args> extends infer Rest extends ZodType
        ? [...ZodSchemaInputArguments<Args>, ...input<Rest>[]]
        : ZodSchemaInputArguments<Args>;

export type { ZodInputArguments };
