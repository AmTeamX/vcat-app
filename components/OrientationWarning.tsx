'use client';

import { useEffect, useState } from 'react';

export default function OrientationWarning() {
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            setIsPortrait(window.innerHeight > window.innerWidth);
        };

        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);

        return () => {
            window.removeEventListener('resize', checkOrientation);
            window.removeEventListener('orientationchange', checkOrientation);
        };
    }, []);

    if (!isPortrait) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-600 text-white p-8">
            <div className="text-center">
                <div className="text-9xl mb-8">📱 ↻</div>
                <h1 className="text-5xl font-bold mb-4">Please Rotate Your Device</h1>
                <p className="text-3xl">
                    This application works best in landscape mode
                </p>
            </div>
        </div>
    );
}
