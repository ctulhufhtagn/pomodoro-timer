import { timer } from './timer-core.js';
import { formatTime } from './timer-statistics.js';

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

/* Статистика */
const $sessionsCount = document.querySelector('#sessions-count');
const $totalTime = document.querySelector('#total-time');
const $averageSession = document.querySelector('#average-session');
export const $statsCalendarButton = document.querySelector('.stats__calendar-button');

/* Календарь */
export const $modal = document.querySelector('.modal');
export const $modalOverlay = document.querySelector('.modal__overlay');
export const $calendarContainer = document.querySelector('.calendar__container');
export const $calendarDays = document.querySelector('.calendar__days');
export const $statsTitle = document.querySelector('.stats__title');
export const $calendarYearSelector = document.querySelector('.calendar__year-selector')
export const $calendarMonthSelector = document.querySelector('.calendar__month-selector');
export const $calendarNavBtnNext = document.querySelector('.calendar__nav-btn--next')
export const $calendarNavBtnPrev = document.querySelector('.calendar__nav-btn--prev')
export const $periodDropdownList = document.querySelector('.period-dropdown__list');
export const $dropdownText = document.querySelector('.dropdown__text');

/* Переключение цветовой темы */
export const $sidebar = document.querySelector('.sidebar');
export const $sidebarButtonTheme = document.querySelector('.sidebar__button--theme');
export const $sidebarButtonLang = document.querySelector('.sidebar__button--lang');
export const $page = document.querySelector('.page')

/* Смена языка */
export const $buttonLang = document.querySelector('.sidebar__button--lang')

/* Регулировка звука */
export const volumeSlider = document.querySelector('.volume-slider');
export const soundModal = document.querySelector('.sound-modal');
export const muteBtn = document.querySelector('.mute-button');

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

export function updateTimerDisplay(secondsToDisplay) {

    let formattedTime = formatTime(secondsToDisplay);

    $timerHours.value = formattedTime.hours;
    $timerMinutes.value = formattedTime.minutes;
    $timerSeconds.value = formattedTime.seconds;

    /* */
    $timerHours.classList.remove('timer__part--active');
    $timerMinutes.classList.remove('timer__part--active');
    $timerSeconds.classList.remove('timer__part--active');

    if ($timerHours.value > 0) $timerHours.classList.add('timer__part--active');
    if ($timerMinutes.value > 0 || $timerHours.value > 0) $timerMinutes.classList.add('timer__part--active');
    if ($timerSeconds.value > 0 || $timerMinutes.value > 0) $timerSeconds.classList.add('timer__part--active');
}

/* функции для отображения статистики */
export function updateSessionsCount(count) {
    $sessionsCount.textContent = count;
}

export function updateTotalTime(seconds) {
    const time = formatTime(seconds);
    $totalTime.textContent = `${time.hours}:${time.minutes}:${time.seconds}`
}

export function updateAverageSession(seconds) {
    const time = formatTime(seconds)
    $averageSession.textContent = `${time.hours}:${time.minutes}:${time.seconds}`;
}