import { Platform } from 'react-native';
import { SERVER_URL_IOS, SERVER_URL_ANDROID } from '@env';

const SERVER_URL = Platform.OS === 'ios' ? SERVER_URL_IOS : SERVER_URL_ANDROID;

export const config = {
    SERVER_URL,
};
