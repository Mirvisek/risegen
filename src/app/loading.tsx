export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative flex items-center justify-center">
                <div className="absolute animate-ping inline-flex h-12 w-12 rounded-full bg-indigo-400 opacity-75"></div>
                <div className="relative inline-flex h-12 w-12 rounded-full bg-indigo-600 items-center justify-center">
                    <div className="h-6 w-6 border-b-2 border-white rounded-full animate-spin"></div>
                </div>
            </div>
            <span className="sr-only">Ładowanie...</span>
        </div>
    );
}
