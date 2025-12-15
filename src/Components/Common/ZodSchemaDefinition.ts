import type { ZodType } from "zod";

import type { Zod } from "./Zod";
import type { ZodSchema } from "./ZodSchema";

/**
 * Represents a definition for arguments, which can be a tuple of
 * {@link ZodType `ZodType`} or a callback that returns one.
 *
 * @template Args The tuple of Zod schemas.
 */
type ZodSchemaDefinition<Args extends ZodSchema = ZodSchema> = Args | ((z: Zod) => Args);

export type { ZodSchemaDefinition };
