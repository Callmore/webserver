import path from "node:path";

export function absolutePath(relPath: string) {
    return path.join(__dirname, relPath);
}
