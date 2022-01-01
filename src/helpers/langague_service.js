
import React from 'react';
import { getLanguageCode, setLanguageCode } from "./sqlite_service";
export const LanguageCode = {
    "EN_US": "EN_US",
    "MM_ZW": "MM_ZW",
    "MM_UN": "MM_UN",
};

const getInitialLanguage = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedPrefs = window.localStorage.getItem('language');
        if (typeof storedPrefs === 'string') {
            switch (storedPrefs) {
                case LanguageCode.EN_US:
                    return LanguageCode.EN_US;
                case LanguageCode.MM_UN:
                    return LanguageCode.MM_UN;
                case LanguageCode.MM_ZW:
                    return LanguageCode.MM_ZW;
                default:
                    return LanguageCode.EN_US;
            }
        }
    }
    return LanguageCode.EN_US;
};

export const LanguageContext = React.createContext();

export const LanguageProvider = ({ initialLanguage, children }) => {
    const [lg, setLg] = React.useState(getInitialLanguage);
    const rawSetLanguage = (l) => {
        setLanguageCode(l).then(res => {
            if (res.success) {
                setLg(l);
            }
        });
    };

    if (initialLanguage) {
        rawSetLanguage(initialLanguage);
    }

    React.useEffect(() => {
        let isCancelled = false;
        getLanguageCode().then(res => {
            if (res.success) {
                setLg(res.data.code);
            }
        });
        return () => {
            isCancelled = true;
        };
    }, []);

    return (
        <LanguageContext.Provider value={{ code: lg, setLanguage: rawSetLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
