import { useEffect, useState } from 'react';

const useLoadGoogleMaps = (apiKey) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadScript = () => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
            script.async = true;
            script.defer = true;

            script.onload = () => setIsLoaded(true);
            script.onerror = () => console.error('Error loading Google Maps script');
            
            document.body.appendChild(script);
        };

        if (!isLoaded) {
            loadScript();
        }

        return () => {
            // Cleanup if needed
            const scripts = document.querySelectorAll('script[src^="https://maps.googleapis.com/maps/api/js"]');
            scripts.forEach(script => script.remove());
        };
    }, [isLoaded, apiKey]);

    return isLoaded;
};

export default useLoadGoogleMaps;