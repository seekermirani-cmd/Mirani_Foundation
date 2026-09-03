import { ImageIcon } from "lucide-react";

/**
 * Visual stand-in for a blog post photo that hasn't been uploaded yet.
 * Used on cards/detail pages for admin-created posts (see
 * `BLOG_IMAGE_PLACEHOLDER` in `src/lib/blog-store.ts`) and in the "Add
 * Blog" form preview.
 */
export function ImagePlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-muted text-muted-foreground ${className}`}
    >
      <ImageIcon className="h-8 w-8" strokeWidth={1.5} />
      <span className="text-xs font-medium">Image coming soon</span>
    </div>
  );
}
