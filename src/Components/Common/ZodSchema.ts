import type { ZodType } from "zod";

/**
 * Represents the fundamental structure of argument definitions.
 *
 * It can be a standard tuple of {@link ZodType `ZodType`} (for fixed
 * arguments) or a tuple ending with a nested tuple
 * {@link ZodType `[ZodType]`} (to represent a rest parameter).
 */
type ZodSchema = readonly ZodType[] | readonly [...ZodType[], readonly [ZodType]];

export type { ZodSchema };
