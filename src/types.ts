import type { DevelopmentConfig } from './config/config.default.js';

declare module '@eggjs/core' {
  // add EggAppConfig overrides types
  interface EggAppConfig {
    development: DevelopmentConfig;
  }
}
