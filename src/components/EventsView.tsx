"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format, isSameDay } from "date-fns";
import { pl } from "date-fns/locale";
import Link from "next/link";
import { Calendar as CalendarIcon, MapPin, ExternalLink, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarButtons } from "./CalendarButtons";

interface Event {
    id: string;
    title: string;
    slug: string;
    date: Date;
    location: string | null;
    content: string;
    images: string; // JSON string
}

export function EventsView({ events, googleCalendarId }: { events: Event[], googleCalendarId?: string | null }) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Process events for calendar tile content
    const eventsByDate = events.reduce((acc: any, event) => {
        const dateStr = format(new Date(event.date), "yyyy-MM-dd");
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(event);
        return acc;
    }, {});

    const filteredEvents = events.filter(e => isSameDay(new Date(e.date), selectedDate));
    const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).slice(0, 3);




    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    const totalPages = Math.ceil(events.length / itemsPerPage);
    const paginatedEvents = events.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Calendar & Selected Date Events */}
            <div className="lg:col-span-12 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 transition-colors duration-300">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                            <CalendarIcon className="h-5 w-5" /> Interaktywny Kalendarz
                        </h3>
                        <div className="calendar-container border dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                            <Calendar
                                onChange={(val) => setSelectedDate(val as Date)}
                                value={selectedDate}
                                locale="pl-PL"
                                className="react-calendar-custom"
                                tileClassName={({ date }) => {
                                    const dateStr = format(date, "yyyy-MM-dd");
                                    return eventsByDate[dateStr] ? "has-events" : null;
                                }}
                            />
                        </div>
                        {googleCalendarId && (
                            <Link
                                href={`https://calendar.google.com/calendar/u/0/embed?src=${googleCalendarId}&ctz=Europe/Warsaw`}
                                target="_blank"
                                className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition"
                            >
                                <ExternalLink className="h-4 w-4" /> Pełny Kalendarz Google
                            </Link>
                        )}
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            Wydarzenia na dzień {format(selectedDate, "dd MMMM yyyy", { locale: pl })}
                        </h3>
                        <div className="space-y-4 min-h-[200px]">
                            <AnimatePresence mode="popLayout">
                                {filteredEvents.length > 0 ? (
                                    filteredEvents.map(event => (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="group bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-transparent hover:border-indigo-300 dark:hover:border-indigo-500 transition"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                                                        {event.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                                                        <MapPin className="h-3 w-3" /> {event.location || "Online / Brak lokalizacji"}
                                                    </p>
                                                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-bold mt-1">
                                                        Godzina: {format(new Date(event.date), "HH:mm")}
                                                    </p>
                                                </div>
                                                <Link
                                                    href={`/wydarzenia/${event.slug}`}
                                                    className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition"
                                                >
                                                    <ChevronRight className="h-4 w-4 text-gray-900 dark:text-white" />
                                                </Link>
                                            </div>
                                            <CalendarButtons event={event} />
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 h-full">
                                        <CalendarIcon className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-2" />
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">Brak zaplanowanych wydarzeń na ten dzień.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* List of All Events */}
            <div className="lg:col-span-12 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white italic">Wszystkie Wydarzenia</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>Pokaż na stronie:</span>
                        <select
                            value={itemsPerPage}
                            onChange={handleLimitChange}
                            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-900 dark:text-gray-100"
                            suppressHydrationWarning
                        >
                            {[5, 10, 15, 20, 25].map((val) => (
                                <option key={val} value={val}>
                                    {val}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {paginatedEvents.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {paginatedEvents.map((event, i) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 flex flex-col group transition-colors duration-300"
                                >
                                    <div className="relative aspect-video overflow-hidden">
                                        {JSON.parse(event.images)[0] ? (
                                            <img
                                                src={JSON.parse(event.images)[0]}
                                                alt={event.title}
                                                className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
                                                <CalendarIcon className="h-12 w-12 text-indigo-200 dark:text-indigo-700" />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400 shadow-sm">
                                            {format(new Date(event.date), "dd.MM.yyyy")}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{event.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                                            {event.location && <span className="block mb-2 font-bold text-indigo-500 flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>}
                                        </p>
                                        <Link
                                            href={`/wydarzenia/${event.slug}`}
                                            className="inline-flex items-center justify-center w-full bg-gray-900 dark:bg-gray-800 text-white font-bold py-3 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-700 transition"
                                        >
                                            Szczegóły <ChevronRight className="h-4 w-4 ml-1" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center gap-4 mt-12">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className={`px-6 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 font-medium transition
                                        ${currentPage === 1
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                                >
                                    Poprzednia
                                </button>
                                <span className="px-4 py-2 text-gray-500 dark:text-gray-400 flex items-center">
                                    Strona {currentPage} z {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`px-6 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 font-medium transition
                                        ${currentPage === totalPages
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                                >
                                    Następna
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-24 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-lg text-gray-500 dark:text-gray-400">
                            Brak wydarzeń.
                        </p>
                    </div>
                )}
            </div>

            <style jsx global>{`
                .react-calendar-custom {
                    width: 100% !important;
                    background: transparent !important;
                    border: none !important;
                    font-family: inherit !important;
                }
                .react-calendar-custom button {
                    color: inherit;
                }
                .dark .react-calendar-custom button:enabled:hover {
                    background-color: #374151 !important;
                }
                .dark .react-calendar-custom .react-calendar__tile--now {
                    background: #374151 !important;
                    color: white !important;
                }
                .dark .react-calendar-custom .react-calendar__tile--active {
                    background: #4f46e5 !important;
                    color: white !important;
                }
                .dark .react-calendar-custom .react-calendar__month-view__days__day--weekend {
                    color: #f87171 !important;
                }
                .dark .react-calendar-custom .react-calendar__navigation button:disabled {
                    background-color: transparent !important;
                    color: #4b5563 !important;
                }
                .dark .react-calendar-custom .react-calendar__navigation button:enabled:hover,
                .dark .react-calendar-custom .react-calendar__navigation button:enabled:focus {
                    background-color: #374151 !important;
                }
                
                .has-events {
                    position: relative;
                }
                .has-events::after {
                    content: "";
                    position: absolute;
                    bottom: 2px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 4px;
                    height: 4px;
                    background: #4f46e5;
                    border-radius: 50%;
                }
            `}</style>
        </div>
    );
}
