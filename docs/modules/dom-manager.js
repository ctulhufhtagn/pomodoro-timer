import { timer } from './timer-core.js';

/* Переменные хедера таймера*/
export const $timerModeSelector = document.querySelector('.timer__mode-selector');
export let $timerModeButtonWork = document.querySelector('.timer__mode-button--work');
export let $timerModeButtonBreak = document.querySelector('.timer__mode-button--break');

/* части дисплея таймера */
export let $timerDisplay = document.querySelector('.timer__display');
export let $timerHours = document.querySelector('[data-unit="hours"]');
export let $timerMinutes = document.querySelector('[data-unit="minutes"]');
export let $timerSeconds = document.querySelector('[data-unit="seconds"]');

/* Кнопки таймера */
export let $startButton = document.querySelector('.timer__button--start');
export let $pauseButton = document.querySelector('.timer__button--pause');
export let $resetButton = document.querySelector('.timer__button--reset');
export let $timerControls = document.querySelector('.timer__controls');


export function displayTimer() {

    let hours = Math.floor(timer.timeLeft / 3600);
    let minutes = Math.floor((timer.timeLeft % 3600) / 60);
    let seconds = Math.floor(timer.timeLeft % 60);
    console.log(timer.timeLeft);

    $timerHours.value = hours.toString().padStart(2, '0');
    $timerMinutes.value = minutes.toString().padStart(2, '0');
    $timerSeconds.value = seconds.toString().padStart(2, '0');

    console.log(`timeLeft: ${timer.timeLeft}, minutes: ${minutes}, calc: ${timer.timeLeft}/60`);
}

export function updateButtonState(state) {

    switch (state) {

        case 'idle':
            $startButton.classList.remove('timer__button--active');
            $pauseButton.classList.add('timer__button--active');
            $resetButton.classList.add('timer__button--active');

            $startButton.setAttribute('aria-hidden', 'true');
            $pauseButton.setAttribute('aria-hidden', 'false');
            $resetButton.setAttribute('aria-hidden', 'false');

            $pauseButton.focus();

            break;

        case 'pause':
            $pauseButton.classList.remove('timer__button--active');
            $startButton.classList.add('timer__button--active');

            $pauseButton.setAttribute('aria-hidden', 'true');
            $startButton.setAttribute('aria-hidden', 'false');

            $startButton.focus();

            break;

        case 'reset':
            $startButton.classList.add('timer__button--active');
            $pauseButton.classList.remove('timer__button--active');
            $resetButton.classList.remove('timer__button--active');

            $startButton.setAttribute('aria-hidden', 'false');
            $pauseButton.setAttribute('aria-hidden', 'true');
            $resetButton.setAttribute('aria-hidden', 'true');

            $startButton.focus();

            break;

    }
    console.log(state);
}