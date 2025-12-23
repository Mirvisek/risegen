"use client";

import { useEffect, useState } from "react";
import { Download, Share, PlusSquare, X, Smartphone } from "lucide-react";

export function InstallAppPrompt() {
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Sprawdź czy to iOS
        const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(ios);

        // Sprawdź czy aplikacja jest już zainstalowana (standalone)
        const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
        setIsStandalone(standalone);

        // Jeśli już zainstalowana, nie pokazuj
        if (standalone) {
            setIsVisible(false);
            return;
        }

        // Obsługa Android/Desktop prompt
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Dla iOS pokazujemy zawsze jeśli to mobilka (bo nie ma eventu)
        // Dla Androida jeśli nie złapaliśmy eventu (np. już odrzucono), to i tak możemy pokazać instrukcję?
        // Ale lepiej polegać na evencie dla Androida, a dla iOS na UserAgent.
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (ios && isMobile && !standalone) {
            setIsVisible(true);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setIsVisible(false);
            }
            setDeferredPrompt(null);
        }
    };

    if (!mounted || isStandalone || !isVisible) return null;

    return (
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-6 text-white shadow-lg relative mb-8 animate-in slide-in-from-top duration-500">
            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                aria-label="Zamknij"
            >
                <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm shrink-0">
                    <Smartphone className="w-8 h-8" />
                </div>
                <div className="flex-1 space-y-3">
                    <div>
                        <h3 className="text-xl font-bold mb-1">Zainstaluj Aplikację</h3>
                        <p className="text-indigo-100 text-sm leading-relaxed">
                            Zainstaluj panel admina na ekranie głównym telefonu, aby mieć szybszy dostęp i wygodniej zarządzać stroną.
                            Aplikacja zapamięta Twoje logowanie.
                        </p>
                    </div>

                    {isIOS ? (
                        <div className="text-sm bg-black/20 p-4 rounded-lg space-y-3 border border-white/10">
                            <p className="flex items-center gap-2 font-medium">
                                1. Kliknij przycisk "Udostępnij" <Share className="w-4 h-4 ml-1" />
                            </p>
                            <p className="flex items-center gap-2 font-medium">
                                2. Wybierz opcję "Do ekranu początk." <PlusSquare className="w-4 h-4 ml-1" />
                            </p>
                        </div>
                    ) : (
                        deferredPrompt && (
                            <button
                                onClick={handleInstallClick}
                                className="inline-flex items-center gap-2 bg-white text-indigo-700 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-50 transition shadow-sm hover:shadow-md active:scale-95"
                            >
                                <Download className="w-4 h-4" />
                                Zainstaluj teraz
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
