import { EditorNav } from "@/components/editor-nav";

// Editor surface. Its own group so it gets the editor nav instead of the main one.
export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EditorNav />
      {children}
    </>
  );
}
