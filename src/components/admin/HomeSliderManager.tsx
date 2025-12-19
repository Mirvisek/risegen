"use client";

import { useState, useActionState, useEffect } from "react";
import { createHomeSlide, updateHomeSlide, deleteHomeSlide } from "@/app/admin/o-nas/actions";
import { updateHeroConfig } from "@/app/admin/wyglad/actions";
import { Loader2, Plus, Upload, Save, Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";
import { DeleteSlideButton } from "@/components/admin/DeleteSlideButton";

type SlideData = {
    id: string;
    image: string;
    title: string | null;
    subtitle: string | null;
    link: string | null;
    author: string | null;
    alignment: string;
    order: number;
};

function HeroConfigForm({ config }: { config: any }) {
    const [state, action] = useActionState(updateHeroConfig, null);
    // Initialize with empty strings if null to avoid uncontrolled/controlled warnings
    const initialImage = config?.staticHeroImage || "";
    const [preview, setPreview] = useState<string | null>(initialImage || null);
    const [imageUrl, setImageUrl] = useState<string>(initialImage);
    const [enabled, setEnabled] = useState(config?.enableHeroSlider ?? true);

    // Effect to update local state if config prop changes (e.g. after server revalidate)
    // This complements the 'key' approach to ensure robust updates
    useEffect(() => {
        if (config) {
            const newImage = config.staticHeroImage || "";
            setImageUrl(newImage);
            setPreview(newImage || null);
            setEnabled(config.enableHeroSlider ?? true);
        }
    }, [config]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert("Plik jest zbyt duży (maks. 10MB)");
            e.target.value = "";
            return;
        }

        // Optimistic preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Upload failed");
            }

            const data = await res.json();
            if (data.url) {
                setImageUrl(data.url);
                console.log("Image uploaded successfully:", data.url);
            }
        } catch (err) {
            console.error("Upload failed", err);
            alert("Wystąpił błąd podczas wgrywania zdjęcia.");
            // Revert preview
            setPreview(imageUrl || null);
        }
    };

    return (
        <form action={action} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6 mb-8">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tryb Banera</h3>
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="enableHeroSlider"
                        name="enableHeroSlider"
                        defaultChecked={enabled}
                        onChange={(e) => setEnabled(e.target.checked)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="enableHeroSlider" className="text-sm font-medium text-gray-700">
                        Włącz Slajder (Karuzelę)
                    </label>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-7">
                    Odznacz, aby użyć pojedynczego, statycznego banera.
                </p>
            </div>

            {!enabled && (
                <div className="space-y-4 border-t pt-4">
                    <h4 className="font-medium text-gray-800">Konfiguracja Statycznego Banera</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Zdjęcie Tła</label>
                            <div className="relative h-40 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                                {preview ? (
                                    <Image src={preview} alt="Static Hero" fill className="object-cover" />
                                ) : (
                                    <Upload className="text-gray-400 h-8 w-8" />
                                )}
                                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Maks. 10MB. Zalecane: 1920x1080px (16:9)</p>
                            <input type="hidden" name="staticHeroImage" value={imageUrl} />
                            <div className="mt-3">
                                <label className="block text-sm font-medium mb-1">Wyrównanie (Pion)</label>
                                <select
                                    name="staticHeroAlignment"
                                    defaultValue={config?.staticHeroAlignment || "center"}
                                    className="w-full border rounded px-3 py-2 text-sm bg-white"
                                >
                                    <option value="center">Środek (Center)</option>
                                    <option value="top">Góra (Top)</option>
                                    <option value="bottom">Dół (Bottom)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Tytuł</label>
                                <input type="text" name="staticHeroTitle" defaultValue={config?.staticHeroTitle || ""} className="w-full border rounded px-3 py-2 text-sm" placeholder="np. Witamy w RiseGen" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Podtytuł / Opis</label>
                                <textarea name="staticHeroSubtitle" rows={3} defaultValue={config?.staticHeroSubtitle || ""} className="w-full border rounded px-3 py-2 text-sm" placeholder="np. Razem zmieniamy świat..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Autor zdjęcia tła</label>
                                <input type="text" name="staticHeroAuthor" defaultValue={config?.staticHeroAuthor || ""} className="w-full border rounded px-3 py-2 text-sm" placeholder="np. Jan Kowalski" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 flex items-center gap-2">
                    <Save className="h-4 w-4" /> Zapisz Konfigurację
                </button>
            </div>

            {state?.message && <p className={`text-sm ${state.success ? "text-green-600" : "text-red-600"}`}>{state.message}</p>}
        </form>
    );
}

function SlideForm({ initialData, onClose }: { initialData?: SlideData; onClose: () => void }) {
    const action = initialData ? updateHomeSlide.bind(null, initialData.id) : createHomeSlide;
    const [state, formAction, isPending] = useActionState(action, { success: false, message: "" });
    const [preview, setPreview] = useState<string | null>(initialData?.image || null);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            alert("Plik jest zbyt duży (maks. 10MB)");
            e.target.value = "";
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.url) {
                const hiddenInput = document.getElementById("slide-image-url") as HTMLInputElement;
                if (hiddenInput) hiddenInput.value = data.url;
            }
        } catch (err) { console.error("Upload failed", err); }
    };

    if (state?.success) {
        // Simple success handling
        setTimeout(onClose, 500);
    }

    return (
        <form action={formAction} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4 mb-6">
            <h3 className="font-medium">{initialData ? "Edytuj Slajd" : "Nowy Slajd"}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium mb-1">Zdjęcie</label>
                    <div className="relative h-40 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                        {preview ? (
                            <Image src={preview} alt="Preview" fill className="object-cover" />
                        ) : (
                            <Upload className="text-gray-400 h-8 w-8" />
                        )}
                        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                    <input type="hidden" name="image" id="slide-image-url" defaultValue={initialData?.image || ""} />
                    <p className="text-xs text-gray-500 mt-1">Kliknij aby zmienić. Maks. 10MB.</p>
                    <p className="text-xs text-gray-400">Rekomendowane: 1920x1080px (16:9)</p>
                </div>

                <div className="col-span-2 md:col-span-1 space-y-3">
                    <div>
                        <label className="block text-sm font-medium">Tytuł</label>
                        <input type="text" name="title" defaultValue={initialData?.title || ""} className="w-full border rounded px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Podtytuł</label>
                        <input type="text" name="subtitle" defaultValue={initialData?.subtitle || ""} className="w-full border rounded px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Link (opcjonalnie)</label>
                        <input type="text" name="link" defaultValue={initialData?.link || ""} className="w-full border rounded px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Autor zdjęcia</label>
                        <input type="text" name="author" defaultValue={initialData?.author || ""} className="w-full border rounded px-3 py-2 text-sm" placeholder="np. Jan Kowalski" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Kolejność</label>
                        <input type="number" name="order" defaultValue={initialData?.order || 0} className="w-full border rounded px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Wyrównanie (Pion)</label>
                        <select
                            name="alignment"
                            defaultValue={initialData?.alignment || "center"}
                            className="w-full border rounded px-3 py-2 text-sm bg-white"
                        >
                            <option value="center">Środek (Center)</option>
                            <option value="top">Góra (Top)</option>
                            <option value="bottom">Dół (Bottom)</option>
                        </select>
                    </div>
                </div>
            </div>

            {state?.message && <p className={`text-sm ${state.success ? "text-green-600" : "text-red-600"}`}>{state.message}</p>}

            <div className="flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800">Anuluj</button>
                <button type="submit" disabled={isPending} className="px-4 py-2 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2">
                    {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                    Zapisz
                </button>
            </div>
        </form>
    );
}

export function HomeSliderManager({ slides, config }: { slides: SlideData[]; config: any }) {
    const [isEditing, setIsEditing] = useState<SlideData | null | "NEW">(null);
    const sliderEnabled = config?.enableHeroSlider ?? true;

    return (
        <div className="space-y-8">
            <HeroConfigForm config={config} key={config?.updatedAt ? new Date(config.updatedAt).getTime() : 'init'} />

            {sliderEnabled && (
                <div className="space-y-6 pt-6 border-t">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Zarządzanie Slajdami</h3>
                        <button onClick={() => setIsEditing("NEW")} className="flex items-center gap-2 text-sm bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700">
                            <Plus className="h-4 w-4" /> Dodaj Slajd
                        </button>
                    </div>

                    {isEditing && (
                        <SlideForm
                            initialData={isEditing === "NEW" ? undefined : isEditing}
                            onClose={() => setIsEditing(null)}
                        />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {slides.map(slide => (
                            <div key={slide.id} className="bg-white border rounded-lg overflow-hidden shadow-sm flex flex-col h-full">
                                <div className="relative h-48 w-full bg-gray-100">
                                    <Image src={slide.image} alt={slide.title || "Slide"} fill className="object-cover" />
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <h4 className="font-medium text-gray-900 truncate">{slide.title || "(Bez tytułu)"}</h4>
                                    <p className="text-sm text-gray-500 truncate mb-4">{slide.subtitle}</p>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div className="text-xs text-gray-500 flex flex-col gap-1">
                                            <span>Kolejność: {slide.order}</span>
                                            {slide.link && <span className="truncate max-w-[120px] text-indigo-500">{slide.link}</span>}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setIsEditing(slide)}
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition"
                                                title="Edytuj"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </button>
                                            <DeleteSlideButton slideId={slide.id} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {slides.length === 0 && (
                            <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 border border-dashed rounded-lg">
                                Brak slajdów. Dodaj pierwszy slajd.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
