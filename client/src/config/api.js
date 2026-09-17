export const API_URL = process.env.REACT_APP_API_URL
    || (window.location.hostname === 'localhost'
        ? 'http://localhost/web-resmi-fpg/server/api'
        : '/server/api');
