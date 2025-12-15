import z from "zod";
import type { ZodTuple, ZodType } from "zod";

import type { ZodSchema } from "~/Common/ZodSchema";
import type { ZodSchemaArguments } from "~/Common/ZodSchemaArguments";
import type { ZodSchemaDefinition } from "~/Common/ZodSchemaDefinition";
import type { ZodSchemaRest } from "~/Common/ZodSchemaRest";

function resolveSchema<As extends ZodSchema>(
    args: ZodSchemaDefinition<As>,
): ZodTuple<ZodSchemaArguments<As>, ZodSchemaRest<As>> {
    args = typeof args === "function" ? args(z) : args;

    let restType: ZodType | null = null;

    if (Array.isArray(args.at(-1))) {
        restType = (args.at(-1) as [ZodType])[0];
    }

    return (
        restType ? z.tuple(args.slice(0, -1) as any).rest(restType) : z.tuple(args as any)
    ) as any;
}

export { resolveSchema };
