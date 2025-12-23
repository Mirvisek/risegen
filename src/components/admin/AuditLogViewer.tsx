"use client";

import { useState } from "react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Eye, X } from "lucide-react";

interface AuditLog {
    id: string;
    entityType: string;
    entityId: string;
    action: string;
    userEmail: string;
    details: string; // JSON string
    createdAt: Date;
}

export function AuditLogViewer({ logs: initialLogs, onLoadMore }: { logs: AuditLog[], onLoadMore: (offset: number, take: number) => Promise<AuditLog[]> }) {
    const [logs, setLogs] = useState<AuditLog[]>(initialLogs);
    const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
    const [parsedDetails, setParsedDetails] = useState<any>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const openModal = (log: AuditLog) => {
        try {
            setParsedDetails(JSON.parse(log.details));
        } catch (e) {
            setParsedDetails({});
        }
        setSelectedLog(log);
    };

    const closeModal = () => {
        setSelectedLog(null);
        setParsedDetails(null);
    };

    const handleLoadMore = async () => {
        setIsLoadingMore(true);
        try {
            const moreLogs = await onLoadMore(logs.length, 50);
            if (moreLogs.length < 50) {
                setHasMore(false);
            }
            setLogs((prev) => [...prev, ...moreLogs]);
        } catch (error) {
            console.error("Failed to load more logs:", error);
        } finally {
            setIsLoadingMore(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 shadow overflow-hidden border-b border-gray-200 dark:border-gray-800 sm:rounded-lg transition-colors">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kiedy</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kto</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Akcja</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Element</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Opcje</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:bg-opacity-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {format(new Date(log.createdAt), "dd MMM yyyy HH:mm", { locale: pl })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                    {log.userEmail}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${log.action === 'CREATE' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : ''}
                                        ${log.action === 'UPDATE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : ''}
                                        ${log.action === 'DELETE' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : ''}`}>
                                        {log.action === 'CREATE' && 'Utworzenie'}
                                        {log.action === 'UPDATE' && 'Edycja'}
                                        {log.action === 'DELETE' && 'Usunięcie'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {log.entityType} <span className="text-xs text-gray-400 dark:text-gray-500">({log.entityId.substring(0, 8)}...)</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => openModal(log)}
                                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 flex items-center gap-1 justify-end ml-auto"
                                    >
                                        <Eye className="h-4 w-4" />
                                        Podgląd
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {hasMore && (
                <div className="flex justify-center pt-4 pb-8">
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isLoadingMore ? "Ładowanie..." : "Załaduj więcej"}
                    </button>
                </div>
            )}

            {/* Modal */}
            {selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Szczegóły Zmiany: {selectedLog.entityType}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 pb-1">Przed Zmianą</h4>
                                    {parsedDetails?.before ? (
                                        <pre className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto whitespace-pre-wrap">
                                            {JSON.stringify(parsedDetails.before, null, 2)}
                                        </pre>
                                    ) : (
                                        <div className="text-sm text-gray-400 dark:text-gray-500 italic p-4">Brak danych (nowy element)</div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 pb-1">Po Zmianie</h4>
                                    {parsedDetails?.after ? (
                                        <pre className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto whitespace-pre-wrap">
                                            {JSON.stringify(parsedDetails.after, null, 2)}
                                        </pre>
                                    ) : (
                                        <div className="text-sm text-gray-400 dark:text-gray-500 italic p-4">Brak danych (usunięty element)</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="bg-white dark:bg-gray-800 py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Zamknij
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
