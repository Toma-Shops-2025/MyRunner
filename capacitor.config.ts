import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'shop.myrunner.twa',
  appName: 'MyRunner',
  webDir: 'dist',
  server: {
    url: 'https://myrunner.shop',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
