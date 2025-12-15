import type { output, ZodType } from "zod";

import type { ZodSchema } from "~/Common/ZodSchema";
import type { ZodSchemaArguments } from "~/Common/ZodSchemaArguments";
import type { ZodSchemaRest } from "~/Common/ZodSchemaRest";

type ZodSchemaOutputArguments<Args extends ZodSchema> =
    ZodSchemaArguments<Args> extends infer Args extends any[]
        ? {
              -readonly [Key in keyof Args]: output<Args[Key]>;
          }
        : never;

/**
 * Represents the output arguments derived from a tuple of type
 * {@link ZodSchema `ZodSchema`} (after transformation).
 *
 * @template Args The tuple of Zod schemas.
 */
type ZodOutputArguments<Args extends ZodSchema> =
    ZodSchemaRest<Args> extends infer Rest extends ZodType
        ? [...ZodSchemaOutputArguments<Args>, ...output<Rest>[]]
        : ZodSchemaOutputArguments<Args>;

export type { ZodOutputArguments };
