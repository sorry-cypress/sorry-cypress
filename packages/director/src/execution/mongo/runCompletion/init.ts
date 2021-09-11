import { getLogger } from '@sorry-cypress/logger';
import { setInterval } from 'timers';
import { checkRunTimeouts } from './runCompletion';

export function initRunCompletion() {
  getLogger().log('🎧 Initializing inactivity timeout task...');

  setInterval(async () => {
    try {
      await checkRunTimeouts();
    } catch (error) {
      getLogger().error(error);
    }
  }, 10000);
}
