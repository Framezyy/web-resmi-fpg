import { useEffect, useRef } from 'react';

const SCRIPT_ID = 'cloudflare-turnstile-script';

const TurnstileWidget = ({ siteKey, onTokenChange, resetKey }) => {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);

    useEffect(() => {
        if (!siteKey || !containerRef.current) return undefined;

        let cancelled = false;
        const renderWidget = () => {
            if (cancelled || !window.turnstile || !containerRef.current) return;

            widgetIdRef.current = window.turnstile.render(containerRef.current, {
                sitekey: siteKey,
                theme: 'light',
                action: 'contact',
                callback: (token) => onTokenChange(token),
                'expired-callback': () => onTokenChange(''),
                'error-callback': () => onTokenChange(''),
            });
        };

        let script = document.getElementById(SCRIPT_ID);
        if (window.turnstile) {
            renderWidget();
        } else if (script) {
            script.addEventListener('load', renderWidget);
        } else {
            script = document.createElement('script');
            script.id = SCRIPT_ID;
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
            script.async = true;
            script.defer = true;
            script.addEventListener('load', renderWidget);
            document.head.appendChild(script);
        }

        return () => {
            cancelled = true;
            script?.removeEventListener('load', renderWidget);
            if (widgetIdRef.current !== null && window.turnstile) {
                window.turnstile.remove(widgetIdRef.current);
                widgetIdRef.current = null;
            }
        };
    }, [siteKey, onTokenChange, resetKey]);

    if (!siteKey) return null;
    return <div className="turnstile-container" ref={containerRef} />;
};

export default TurnstileWidget;
