import { GraphQLSchema, parse, printSchema } from 'graphql';
import { codegen } from '@graphql-codegen/core';
import * as typescriptPlugin from '@graphql-codegen/typescript';
import fs from 'fs';
import path from 'path';
import pkgDir from 'pkg-dir';

export async function createTypesFromSchema(schemas: Array<GraphQLSchema>, typesOutputFiles: Array<string>): Promise<void> {
  if (schemas.length !== typesOutputFiles.length) throw new Error('The numbers of schemas and typesOutputFiles are not matched!');
  const rootDir = await pkgDir(__dirname);
  for (let i = 0; i < schemas.length; i++) {
    const config = {
      filename: typesOutputFiles[i],
      schema: parse(printSchema(schemas[i])),
      plugins: [
        {
          typescript: {}
        }
      ],
      pluginMap: {
        typescript: typescriptPlugin
      }
    };
    const output = await codegen(config as any);
    await fs.writeFileSync(path.join(rootDir as string, typesOutputFiles[i]), output);
    console.log(`Type Definition file (${path.join(rootDir as string, typesOutputFiles[i])}) was generated!`);
  }
}
