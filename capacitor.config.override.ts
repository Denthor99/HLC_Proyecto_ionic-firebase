import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'proyectoPeliculasFamosas',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

//export default config;

export default {
  config,
  android:{
    permissions:{
      READ_MEDIA_IMAGES: true
    }
  }
};