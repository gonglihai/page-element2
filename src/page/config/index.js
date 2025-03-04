import { defaultConfig } from './default';
import Util from '../util'

export const config = defaultConfig()

export function setConfig(newConfig) {
  if (!newConfig) {
    return;
  }
  Util.objectMerge(config, newConfig);
}

