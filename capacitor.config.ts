/// <reference types="@capawesome/capacitor-android-edge-to-edge-support" />

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
  plugins: {
    // Let @capawesome/capacitor-android-edge-to-edge-support own inset handling.
    SystemBars: {
      insetsHandling: 'disable',
      style: 'DARK',
    },
    EdgeToEdge: {
      backgroundColor: '#0a0a0a',
      statusBarColor: '#0a0a0a',
      navigationBarColor: '#0a0a0a',
    },
  },
};

export default config;
