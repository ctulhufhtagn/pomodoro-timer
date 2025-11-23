import { timerState } from './state-manager.js';
import { updateButtonState, updateTimerDisplay } from './dom-manager.js';
import { playSound } from './sound-player.js';
import { completeSession, formatTime } from './timer-statistics.js';

export const timer = {
    timeLeft: 0,
    isRunning: false,
    intervalId: null, /* ID таймера для остановки  */
}

export function startTimer() {

    if (timer.isRunning) {
        return;
    }

    console.log('раннинг до того как меняется в ф-ии:', timer.isRunning);

    timer.isRunning = true;

    updateButtonState('idle');

    if (!timerState.hasBeenStarted) {

        if (timerState.hasCustomTime) {

            timer.timeLeft = timerState.currentHours * 3600 + timerState.currentMinutes * 60 + timerState.currentSeconds;

            console.log('в кастоме', timer.isRunning);

        } else {
            /* === условие ? если истинно : если ложно */
            timer.timeLeft = timerState.currentMode === "work" ? timerState.workTime : timerState.breakTime;
        }

        timerState.sessionDuration = timer.timeLeft;
        console.log('время сессии = ' + timerState.sessionDuration);

        timerState.hasBeenStarted = true;

        updateTimerDisplay(timer.timeLeft);

        console.log(timerState.hasBeenStarted);

    }

    console.log('timeleft = ' + timer.timeLeft);

    timer.intervalId = setInterval(() => {

        if (timer.timeLeft <= 0) {
            completeSession(timerState.sessionDuration, timer.timeLeft);
            playSound(timerState.currentMode);
            clearInterval(timer.intervalId);
            updateButtonState('reset');
            console.log("Таймер завершён!");
            timer.isRunning = false;
            return;
        }

        timer.timeLeft--;
        updateTimerDisplay(timer.timeLeft);
        /* console.log(timer.timeLeft); */

    }, 1000);

}

export function pauseTimer() {

    console.log('Pause called, intervalId:', timer.intervalId);

    /* останавливаем таймер и сохраняем его время, меняем состояние */
    clearInterval(timer.intervalId);

    timer.isRunning = false;
    timer.intervalId = null;

    updateButtonState('pause');

}

export function resetTimer() {

    completeSession(timerState.sessionDuration, timer.timeLeft);

    clearInterval(timer.intervalId);

    timer.isRunning = false;
    timerState.hasBeenStarted = false;

    timer.timeLeft = timerState.currentMode === "work" ? timerState.workTime : timerState.breakTime;

    /* formatTime(); */
    updateButtonState('reset');

    console.log('timeleft = ' + timer.timeLeft);
}