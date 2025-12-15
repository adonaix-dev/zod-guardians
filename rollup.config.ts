import { posix } from "node:path";

import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { parse } from "acorn";
import { generate } from "astring";
import deepmerge from "deepmerge";
import dts from "rollup-plugin-dts";
import prettier from "rollup-plugin-prettier";
import { SourceMapGenerator } from "source-map-js";
import type { Plugin, RollupOptions } from "rollup";

import pkg from "./package.json" with { type: "json" };

function getOptions(
    input: string,
    outputExtension: string,
    options: RollupOptions = {},
): RollupOptions {
    const { name } = posix.parse(posix.resolve(input));
    const filename = `${name}.${outputExtension}`;
    const file = posix.join("./dist", filename);

    return deepmerge(
        {
            input,
            output: {
                format: "esm",
                file,
                plugins: [
                    prettier({
                        filepath: file,
                    }),
                ],
            },
            plugins: [
                nodeResolve(),
                typescript({
                    include: ["**"],
                }),
            ],
            external: [
                ...Object.keys(pkg.dependencies ?? {}),
                ...Object.keys(pkg.peerDependencies ?? {}),
            ],
        } satisfies RollupOptions,
        options,
    );
}

export function uncomment(): Plugin {
    return {
        name: "uncomment",
        renderChunk(source, { fileName }) {
            const ast = parse(source, {
                ecmaVersion: "latest",
                sourceType: "module",
            });

            const sourceMap = new SourceMapGenerator({ file: fileName });
            // @ts-ignore
            const code = generate(ast, { sourceMap });

            return {
                code,
                map: sourceMap.toJSON() as any,
            };
        },
    };
}

export default [
    getOptions("./src/index.ts", "d.ts", {
        plugins: [
            dts({
                respectExternal: true,
            }),
        ],
        external: [/^zod\/.*/g],
    }),
    getOptions("./src/index.ts", "js", {
        plugins: [uncomment()],
    }),
] satisfies RollupOptions[];
