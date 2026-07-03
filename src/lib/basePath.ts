// GitHub Pages project sites are served under /<repo-name>/. The base path is
// injected at build time via NEXT_PUBLIC_BASE_PATH (see next.config.ts and
// .github/workflows/deploy.yml) so this file never needs to know the repo name.
export function withBasePath(path: string): string {
  if (!path.startsWith("/")) {
    throw new Error(`withBasePath expects an absolute path, got: ${path}`);
  }
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}${path}`;
}
