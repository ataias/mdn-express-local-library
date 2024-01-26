# template-express

This is a template for starting an express project with the following

- [TypeScript](https://www.typescriptlang.org): type checker
- [Bun](https://bun.sh): runtime
- [Biome](https://biomejs.dev): formatter and linter
- [Zed](https://zed.dev): local settings using Biome for formatting

## Notes

- We use TypeScript only in the lint phase, instead of being part of the build, because `bun` can simply run TypeScript files directly, so we simply consider TypeScript the final output.
  - This may be something to be analyzed, of course, maybe there are problems but I think it is a good simplification to start
