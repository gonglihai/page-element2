import _ from 'lodash';

import { defaultConfig } from './default';

export const config = defaultConfig()

export function setConfig(newConfig) {
  if (!newConfig) {
    return;
  }
  _.merge(config, newConfig);
}