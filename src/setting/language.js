import React, { useContext, setState, useState } from 'react';
import { View } from 'react-native';

import LanguageListItem from '../components/language_list_item';
import { LanguageCode, LanguageContext } from "../helpers/langague_service";

const languages = [
    {
        locale: LanguageCode.EN_US,
        name: 'English',
        englishName: 'English',
    },
    {
        locale: LanguageCode.MM_UN,
        name: 'Burmese',
        englishName: 'Unicode'
    },
    {
        locale: LanguageCode.MM_ZW,
        name: 'Burmese',
        englishName: 'Zawgyi'
    },
];

export default function LanguageSelector({ navigation }) {
    const { code, setLanguage } = useContext(LanguageContext);
    const [currentLocale, setCurrentLocale] = useState(code);
    const onLocaleChange = async (locale) => {
        setLanguage(locale.locale);
        navigation.pop();
    }
    return (
        <View style={{ marginTop: 15 }}>
            {
                languages.map((language) => (
                    <LanguageListItem
                        key={language.locale}
                        isActive={language.locale === currentLocale}
                        locale={language.locale}
                        name={language.name}
                        englishName={language.englishName}
                        onChangeLocale={onLocaleChange}
                    />
                ))
            }
        </View>
    );
}

