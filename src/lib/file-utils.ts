import { unlink } from "fs/promises";
import { join } from "path";

export async function deleteFile(fileUrl: string) {
    if (!fileUrl) return;

    try {
        // We expect URLs like /uploads/filename.ext
        if (!fileUrl.startsWith("/uploads/")) {
            // Not a local upload, maybe external URL or invalid
            return;
        }

        // Remove the leading slash to get relative path from public
        const relativePath = fileUrl.substring(1);
        const fullPath = join(process.cwd(), "public", relativePath);

        await unlink(fullPath);
        console.log(`Deleted file: ${fullPath}`);
    } catch (error) {
        console.error(`Failed to delete file ${fileUrl}:`, error);
        // We don't throw here to avoid breaking the main operation if file deletion fails
        // (e.g. file already gone)
    }
}
