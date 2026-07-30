import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'shop.myrunner.twa',
  appName: 'MyRunner',
  webDir: 'dist/client',
  server: {
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
