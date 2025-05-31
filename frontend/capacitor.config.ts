import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.statpad.app',
  appName: 'StatPad',
  webDir: 'dist',
  server:{
    url: "https://stat-pad-frontend.vercel.app/"
  },
  "plugins": {
    "StatusBar": {
      "overlaysWebView": false,
      "style": "DARK",
      "backgroundColor": "#15181D"
    }
  }
};

export default config;
