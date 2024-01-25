declare global {
    interface Window {
        config: { SERVER_URL: string };
    }
}

window.config = {
    SERVER_URL: window.config.SERVER_URL || '${VITE_SERVER}',
};

export {};
