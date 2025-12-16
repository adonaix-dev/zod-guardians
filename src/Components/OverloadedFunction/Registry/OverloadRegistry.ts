import { resolveSchema } from "~/Core/ResolveSchema";
import type { ZodRawFunction } from "~/Common/ZodRawFunction";
import type { ZodSchemaDefinition } from "~/Common/ZodSchemaDefinition";

import type { OverloadRegistryEntry } from "./OverloadRegistryEntry";

class OverloadRegistry {
    private constructor(private readonly entries: OverloadRegistryEntry[] = []) {}

    static create(): OverloadRegistry {
        return new OverloadRegistry();
    }

    copyAndRegister(args: ZodSchemaDefinition, fun: ZodRawFunction): OverloadRegistry {
        return new OverloadRegistry([
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

export { OverloadRegistry };
