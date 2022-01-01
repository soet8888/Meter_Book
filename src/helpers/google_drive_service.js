

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GDrive } from "@robinbobin/react-native-google-drive-api-wrapper";


export const getGDrive = async () => {
    try {
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        await GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/drive'],
            shouldFetchBasicProfile: true,
            webClientId: '96959650637-iijpivhahrfk68r9su2o8v8n7oiuotha.apps.googleusercontent.com',
            offlineAccess: true
        });

        await GoogleSignin.signIn();
        const token = await GoogleSignin.getTokens();
        if (token.accessToken) {
            const gdrive = new GDrive();
            gdrive.accessToken = token.accessToken;
            return { success: true, drive: gdrive }
        }
        return { success: false }
    } catch (error) {
        console.log('Gauth error', error)
        return { success: false }
    }
}