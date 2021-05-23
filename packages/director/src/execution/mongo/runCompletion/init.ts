import { setInterval } from 'timers';
// import { checkRunTimeouts } from './runCompletion';

export function initRunCompletion() {
  console.log('🎧 Initializing inactivity timeout task...');

  setInterval(async () => {
    try {
      // await checkRunTimeouts();
    } catch (error) {
      console.error(error);
    }
  }, 10000);
}
