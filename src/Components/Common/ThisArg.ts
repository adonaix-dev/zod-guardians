import type { missing } from "@adonaix/types";

/**
 * Determines the type of the `this` context, handling cases where it
 * might be missing.
 *
 * @template Type The type of the `this` context.
 */
type ThisArg<Type> = unknown extends Type ? void : Type extends missing ? void : Type;

export type { ThisArg };
