import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.statpad.app',
  appName: 'StatPad',
  webDir: 'dist',
  server:{
    url: "http://localhost:3000" //http://localhost:3000 https://stat-pad-frontend.vercel.app/
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
