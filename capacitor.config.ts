import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.bookshelf',
  appName: 'Bookshelf',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
