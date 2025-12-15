import type { ZodTuple } from "zod";

import type { ZodInputFunction } from "~/Common/ZodInputFunction";

interface OverloadRegistryEntry {
    schema: ZodTuple;
    fun: ZodInputFunction;
}

export type { OverloadRegistryEntry };
