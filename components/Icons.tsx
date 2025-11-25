
import React from 'react';

export const ImageUploadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
);

export const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

export const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a3.375 3.375 0 00-2.456-2.456L12.5 18l1.197-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.197a3.375 3.375 0 002.456 2.456L20.5 18l-1.197.398a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
);

export const WarnIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

export const YouTubeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.25,4,12,4,12,4S5.75,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.75,2,12,2,12s0,4.25,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.75,20,12,20,12,20s6.25,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.25,22,12,22,12S22,7.75,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z"/>
    </svg>
);

export const InstagramIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2c-2.717,0-3.056,0.011-4.122,0.06c-1.065,0.049-1.791,0.218-2.427,0.465c-0.636,0.247-1.176,0.583-1.716,1.123 C3.204,4.224,2.868,4.764,2.621,5.4C2.374,6.036,2.205,6.762,2.156,7.828C2.101,8.894,2.09,9.233,2.09,12s0.011,3.106,0.06,4.122 c0.049,1.065,0.218,1.791,0.465,2.427c0.247,0.636,0.583,1.176,1.123,1.716c0.54,0.54,1.08,0.876,1.716,1.123 c0.636,0.247,1.363,0.416,2.427,0.465c1.066,0.049,1.405,0.06,4.122,0.06s3.056-0.011,4.122-0.06 c1.065-0.049,1.791-0.218,2.427-0.465c0.636-0.247,1.176-0.583,1.716-1.123c0.54-0.54,0.876-1.08,1.123-1.716 c0.247-0.636,0.416-1.363,0.465-2.427c0.049-1.066,0.06-1.405,0.06-4.122s-0.011-3.106-0.06-4.122 c-0.049-1.065-0.218-1.791-0.465-2.427c-0.247-0.636-0.583-1.176-1.123-1.716C19.776,3.204,19.236,2.868,18.6,2.621 c-0.636-0.247-1.363-0.416-2.427-0.465C15.056,2.101,14.717,2.09,12,2.09C12,2,12,2,12,2z M12,4.869c2.828,0,5.131,2.303,5.131,5.131 s-2.303,5.131-5.131,5.131s-5.131-2.303-5.131-5.131S9.172,4.869,12,4.869z M12,15.249c1.794,0,3.249-1.455,3.249-3.249 s-1.455-3.249-3.249-3.249s-3.249,1.455-3.249,3.249S10.206,15.249,12,15.249z M16.941,7.869c-0.74,0-1.34,0.6-1.34,1.34 s0.6,1.34,1.34,1.34s1.34-0.6,1.34-1.34S17.681,7.869,16.941,7.869z"/>
    </svg>
);

export const InstagramStoryIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
);

export const CloseIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
