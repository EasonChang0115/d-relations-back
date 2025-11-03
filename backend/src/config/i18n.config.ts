import { I18nOptions } from 'nestjs-i18n';
import * as path from 'path';

export const i18nConfig: I18nOptions = {
  fallbackLanguage: 'zh-TW',
  fallbackLanguageRegex: 'zh.*',
  loaderOptions: {
    path: path.join(__dirname, '../i18n/'),
    watch: true,
  },
};
