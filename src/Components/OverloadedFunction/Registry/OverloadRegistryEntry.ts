import type { ZodTuple } from "zod";

import type { ZodRawFunction } from "~/Common/ZodRawFunction";

interface OverloadRegistryEntry {
    schema: ZodTuple;
    fun: ZodRawFunction;
}

export type { OverloadRegistryEntry };
