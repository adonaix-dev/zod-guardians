import { resolveSchema } from "~/Core/ResolveSchema";
import type { ZodInputFunction } from "~/Common/ZodInputFunction";
import type { ZodSchemaDefinition } from "~/Common/ZodSchemaDefinition";

import type { OverloadRegistryEntry } from "./OverloadRegistryEntry";

class ZodOverloadRegistry {
    private constructor(private readonly entries: OverloadRegistryEntry[] = []) {}

    static create(): ZodOverloadRegistry {
        return new ZodOverloadRegistry();
    }

    copyAndRegister(
        args: ZodSchemaDefinition,
        fun: ZodInputFunction,
    ): ZodOverloadRegistry {
        return new ZodOverloadRegistry([
            ...this.entries,
            {
                schema: resolveSchema(args),
                fun,
            },
        ]);
    }

    *getEntries(): Generator<OverloadRegistryEntry> {
        for (const entry of this.entries) {
            yield entry;
        }
    }
}

export { ZodOverloadRegistry };
