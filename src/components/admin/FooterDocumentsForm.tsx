import { AttachmentsManager, Attachment } from "./AttachmentsManager";
import { useState } from "react";
import { useActionState } from "react";
import { updateFooterDocuments } from "@/app/admin/wyglad/actions";
import { Loader2, Save } from "lucide-react";

interface Props {
    config: {
        footerDocuments?: string | null;
    } | null;
}

const initialState = {
    success: false,
    message: "",
};

export function FooterDocumentsForm({ config }: Props) {
    const [state, formAction, isPending] = useActionState(updateFooterDocuments, initialState);

    const [documents, setDocuments] = useState<Attachment[]>(() => {
        if (config?.footerDocuments) {
            try {
                return JSON.parse(config.footerDocuments);
            } catch (e) {
                return [];
            }
        }
        return [];
    });

    const handleChange = (newDocs: Attachment[]) => {
        // Limit to 3 is enforced here too? The DB field says max 3.
        if (newDocs.length > 3) {
            alert("Maksymalnie 3 dokumenty w stopce.");
            return;
        }
        setDocuments(newDocs);
    };

    return (
        <form action={formAction} className="bg-white shadow sm:rounded-lg p-6 space-y-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 border-b pb-2">Dokumenty w Stopce</h3>

            {state?.message && (
                <div className={`p-4 rounded-md ${state.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    <p className="text-sm">{state.message}</p>
                </div>
            )}

            <div>
                <p className="text-sm text-gray-500 mb-4">
                    Możesz dodać maksymalnie 3 dokumenty (np. Polityka Prywatności, Regulamin, Statut), które będą widoczne w stopce strony obok praw autorskich.
                </p>

                <AttachmentsManager
                    attachments={documents}
                    onChange={handleChange}
                />
                <input type="hidden" name="footerDocuments" value={JSON.stringify(documents)} />
            </div>

            <div className="pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex justify-center items-center gap-2 rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
                >
                    {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                    {isPending ? "Zapisywanie..." : "Zapisz Dokumenty"}
                </button>
            </div>
        </form>
    );
}
