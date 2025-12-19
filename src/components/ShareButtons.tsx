"use client";

import { Share2, Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
    title: string;
    url?: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
                <Share2 className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Udostępnij</span>
            </div>

            <div className="flex flex-wrap gap-2">
                <a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                    aria-label="Udostępnij na Facebooku"
                >
                    <Facebook className="h-4 w-4" />
                    Facebook
                </a>

                <a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition text-sm"
                    aria-label="Udostępnij na Twitterze"
                >
                    <Twitter className="h-4 w-4" />
                    Twitter
                </a>

                <a
                    href={shareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition text-sm"
                    aria-label="Udostępnij na LinkedIn"
                >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                </a>

                <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
                    aria-label="Skopiuj link"
                >
                    {copied ? (
                        <>
                            <Check className="h-4 w-4" />
                            Skopiowano!
                        </>
                    ) : (
                        <>
                            <LinkIcon className="h-4 w-4" />
                            Kopiuj link
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
