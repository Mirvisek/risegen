"use client";

import { Calendar, Plus } from "lucide-react";

interface Event {
    id: string;
    title: string;
    slug: string;
    date: Date;
    location: string | null;
    content: string;
}

export function CalendarButtons({ event }: { event: Event }) {
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    const date = new Date(event.date);
    const endDate = new Date(date.getTime() + 60 * 60 * 1000);

    const formatDateICS = (d: Date) =>
        `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

    const getGoogleCalendarUrl = () => {
        const start = formatDateICS(date);
        const end = formatDateICS(endDate);
        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.content.substring(0, 500))}&location=${encodeURIComponent(event.location || "")}`;
    };

    const getOutlookUrl = () => {
        const start = date.toISOString();
        const end = endDate.toISOString();
        return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${encodeURIComponent(event.title)}&startdt=${start}&enddt=${end}&body=${encodeURIComponent(event.content.substring(0, 500))}&location=${encodeURIComponent(event.location || "")}`;
    };

    const downloadICS = () => {
        const start = formatDateICS(date);
        const end = formatDateICS(endDate);
        const content = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//RiseGen//Events//PL',
            'BEGIN:VEVENT',
            `UID:${event.id}@risegen.pl`,
            `DTSTAMP:${formatDateICS(new Date())}`,
            `DTSTART:${start}`,
            `DTEND:${end}`,
            `SUMMARY:${event.title}`,
            `DESCRIPTION:${event.content.replace(/\n/g, '\\n').substring(0, 500)}`,
            `LOCATION:${event.location || ''}`,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');

        const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${event.slug}.ics`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-wrap gap-3 mt-6">
            <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-md hover:-translate-y-0.5"
                title="Dodaj do Kalendarza Google"
            >
                <div className="w-4 h-4 rounded bg-[#4285F4] flex items-center justify-center text-[10px] text-white">G</div>
                Google
            </a>
            <a
                href={getOutlookUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5"
                title="Dodaj do Outlook"
            >
                <div className="w-4 h-4 rounded bg-[#0078D4] flex items-center justify-center text-[10px] text-white">O</div>
                Outlook
            </a>
            <button
                onClick={downloadICS}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-indigo-200 dark:hover:shadow-none hover:-translate-y-0.5"
                title="Pobierz plik ICS (Apple / Android / Windows)"
            >
                <Calendar className="h-4 w-4" />
                Kalendarz (iCal)
            </button>
        </div>
    );
}
