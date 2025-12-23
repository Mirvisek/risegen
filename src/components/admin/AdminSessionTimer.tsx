"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { Clock, Hourglass } from "lucide-react";

export function AdminSessionTimer() {
    const { data: session, update } = useSession();
    const [currentTime, setCurrentTime] = useState(Date.now());
    const lastActivityRef = useRef(Date.now());

    // Store the initial start time to prevent resets on session update
    const [startTime, setStartTime] = useState<number | null>(null);

    // Effect to update current time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Effect to latch valid start time
    useEffect(() => {
        if (session?.user?.iat && startTime === null) {
            setStartTime(session.user.iat * 1000);
        }
    }, [session, startTime]);

    // Effect to track user activity
    useEffect(() => {
        const updateActivity = () => {
            lastActivityRef.current = Date.now();
        };

        window.addEventListener('mousemove', updateActivity);
        window.addEventListener('click', updateActivity);
        window.addEventListener('keydown', updateActivity);
        window.addEventListener('scroll', updateActivity);

        return () => {
            window.removeEventListener('mousemove', updateActivity);
            window.removeEventListener('click', updateActivity);
            window.removeEventListener('keydown', updateActivity);
            window.removeEventListener('scroll', updateActivity);
        };
    }, []);

    // Effect to extend session if user is active
    useEffect(() => {
        const checkInterval = setInterval(async () => {
            if (!session?.user?.exp) return;

            const now = Date.now();
            const timeSinceLastActivity = now - lastActivityRef.current;

            // Check if user was active in the last 60 seconds
            if (timeSinceLastActivity < 60 * 1000) {
                const expiresAt = session.user.exp * 1000;
                const timeLeft = expiresAt - now;

                // If session has less than 4 minutes remaining (out of 5), refresh it
                // This ensures the session is extended if the user is active
                if (timeLeft < 4 * 60 * 1000) {
                    await update();
                }
            }
        }, 5000); // Check every 5 seconds

        return () => clearInterval(checkInterval);
    }, [session, update]);

    if (!session?.user?.exp || !session?.user?.iat) return null;

    const expiresAt = session.user.exp * 1000;
    // Use stored startTime if available to avoid reset on update, else fallback to current iat
    const effectiveStartTime = startTime || (session.user.iat * 1000);

    const timeLeft = Math.max(0, expiresAt - currentTime);
    const duration = Math.max(0, currentTime - effectiveStartTime);

    // Format milliseconds to MM:SS
    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const isWarning = timeLeft < 60 * 1000; // Less than 1 minute

    return (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors">
            <div className="flex flex-col space-y-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>Czas trwania:</span>
                    </div>
                    <span className="font-mono text-gray-700 dark:text-gray-300">{formatTime(duration)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Hourglass className="h-3 w-3" />
                        <span>Wygasa za:</span>
                    </div>
                    <span className={`font-mono font-bold ${isWarning ? 'text-red-600 dark:text-red-500 animate-pulse' : 'text-green-600 dark:text-green-500'}`}>
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>
        </div>
    );
}
