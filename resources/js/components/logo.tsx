import { Link } from '@inertiajs/react';

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-lg">
                <svg 
                    width="28" 
                    height="28" 
                    viewBox="0 0 32 32" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-indigo-400"
                >
                    <path d="M8 22 L16 10 L24 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11 18 L21 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    <circle cx="16" cy="22" r="2" fill="currentColor"/>
                </svg>
            </div>
        </Link>
    );
}