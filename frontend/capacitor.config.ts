import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.statpad.app',
  appName: 'StatPad',
  webDir: 'dist',
  server:{
    url: "http://localhost:5173/"
  }
};

export default config;
