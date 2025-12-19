"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Heading1, Heading2, Quote, Undo, Redo, Code, Strikethrough } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        // update
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50 rounded-t-lg">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={cn("p-1.5 rounded hover:bg-gray-200 transition", editor.isActive("bold") ? "bg-gray-300 text-black" : "text-gray-600")}
                title="Pogrubienie"
            >
                <Bold className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={cn("p-1.5 rounded hover:bg-gray-200 transition", editor.isActive("italic") ? "bg-gray-300 text-black" : "text-gray-600")}
                title="Kursywa"
            >
                <Italic className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={cn("p-1.5 rounded hover:bg-gray-200 transition", editor.isActive("strike") ? "bg-gray-300 text-black" : "text-gray-600")}
                title="Przekreślenie"
            >
                <Strikethrough className="h-4 w-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={cn("p-1.5 rounded hover:bg-gray-200 transition", editor.isActive("heading", { level: 2 }) ? "bg-gray-300 text-black" : "text-gray-600")}
                title="Nagłówek 2"
            >
                <Heading1 className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={cn("p-1.5 rounded hover:bg-gray-200 transition", editor.isActive("heading", { level: 3 }) ? "bg-gray-300 text-black" : "text-gray-600")}
                title="Nagłówek 3"
            >
                <Heading2 className="h-4 w-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn("p-1.5 rounded hover:bg-gray-200 transition", editor.isActive("bulletList") ? "bg-gray-300 text-black" : "text-gray-600")}
                title="Lista punktowana"
            >
                <List className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={cn("p-1.5 rounded hover:bg-gray-200 transition", editor.isActive("orderedList") ? "bg-gray-300 text-black" : "text-gray-600")}
                title="Lista numerowana"
            >
                <ListOrdered className="h-4 w-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            <button
                type="button"
                onClick={setLink}
                className={cn("p-1.5 rounded hover:bg-gray-200 transition", editor.isActive("link") ? "bg-gray-300 text-black" : "text-gray-600")}
                title="Link"
            >
                <LinkIcon className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={cn("p-1.5 rounded hover:bg-gray-200 transition", editor.isActive("blockquote") ? "bg-gray-300 text-black" : "text-gray-600")}
                title="Cytat"
            >
                <Quote className="h-4 w-4" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

            <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="p-1.5 rounded hover:bg-gray-200 transition text-gray-600 disabled:opacity-30"
                title="Cofnij"
            >
                <Undo className="h-4 w-4" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="p-1.5 rounded hover:bg-gray-200 transition text-gray-600 disabled:opacity-30"
                title="Ponów"
            >
                <Redo className="h-4 w-4" />
            </button>
        </div>
    );
};

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-indigo-600 hover:text-indigo-800 underline transition",
                },
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: "prose prose-sm sm:prose-base focus:outline-none min-h-[200px] p-4 max-w-none",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        immediatelyRender: false,
    });

    // Handle external updates to value (though be careful of loops)
    // We only update if the content is drastically different/empty to avoid cursor jumping
    useEffect(() => {
        if (editor && value !== editor.getHTML() && value === "") {
            editor.commands.setContent(value);
        }
    }, [value, editor]);


    return (
        <div className={cn("border border-gray-300 rounded-lg shadow-sm w-full bg-white overflow-hidden", className)}>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
