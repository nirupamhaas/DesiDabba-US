import React from 'react';

interface LogoProps {
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
            <rect x="6" y="7" width="12" height="5" rx="1" />
            <rect x="6" y="12" width="12" height="5" rx="1" />
            <path d="M6 17h12v3a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-3z" />
        </svg>
    );
};
