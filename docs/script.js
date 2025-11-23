/* Работа таймера */
import { startTimer, pauseTimer, resetTimer, timer } from './modules/timer-core.js'

/* Состояния таймера */
import { timerState } from './modules/state-manager.js';

/* Грузим и воспроизводим звуки */
import { loadAllSounds } from './modules/sound-loader.js'
import { playSound } from './modules/sound-player.js'

import {
    /* Переменные хедера таймера */
    $timerModeSelector,
    $timerModeButtonWork,
    $timerModeButtonBreak,

    /* части дисплея таймера */
    $timerDisplay,
    $timerHours,
    $timerMinutes,
    $timerSeconds,

    /* Кнопки таймера */
    $startButton,
    $pauseButton,
    $resetButton,
    $timerControls,

    /* функция отображения и изменения кнопок*/
    updateButtonState,

} from './modules/dom-manager.js'

/* Обработчики событий */

$timerControls.addEventListener('click', (event) => {
    let clickedButton = event.target;

    if (!clickedButton.classList.contains('timer__button')) {
        return;
    }

    if (clickedButton === $startButton) {
        startTimer();
    }

    else if (clickedButton === $pauseButton) {
        pauseTimer();
    }

    else if (clickedButton === $resetButton) {
        resetTimer();
    }
});

/* Слушатель на родителя и переключение цвета у кнопки при нажатии на неё и меняем время в зависимости от модуля*/
$timerModeSelector.addEventListener('click', (event) => {

    let clickedModule = event.target;

    if (!clickedModule.classList.contains('timer__mode-button')) {
        return;
    }

    if (clickedModule.classList.contains('timer__mode-button--work')) {

        if (timer.isRunning && timerState.currentMode === "break") {
            resetTimer();
        }

        clickedModule.classList.add('timer__mode-button--active');
        $timerModeButtonBreak.classList.remove('timer__mode-button--active');

        $timerHours.value = '00';
        $timerMinutes.value = '25';
        $timerSeconds.value = '00';

        timerState.currentMode = "work";
        timer.timeLeft = timerState.workTime;
    }

    else if (clickedModule.classList.contains('timer__mode-button--break')) {

        if (timer.isRunning && timerState.currentMode === "work") {
            resetTimer();
        }

        clickedModule.classList.add('timer__mode-button--active')
        $timerModeButtonWork.classList.remove('timer__mode-button--active');

        $timerHours.value = '00';
        $timerMinutes.value = '05';
        $timerSeconds.value = '00';

        timerState.currentMode = "break";
        timer.timeLeft = timerState.breakTime;
    }
});

/* слушатель на $timerDisplay, для клавиш down, up, и энтер */
$timerDisplay.addEventListener('input', function (event) {

    const clickedElement = event.target;

    if (!event.target.classList.contains('timer__part')) {
        return;
    }

    clickedElement.value = clickedElement.value.replace(/[^\d]/g, '');

    if (clickedElement.value.length > 2) {
        clickedElement.value = clickedElement.value.slice(0, 2);
    }

});

$timerDisplay.addEventListener('focusout', function (event) {

    const clickedElement = event.target;

    if (!clickedElement.classList.contains('timer__part')) {
        return;
    }

    if (clickedElement.value === '') {
        clickedElement.value = '00';
    }

    if (clickedElement.value.length === 1) {
        clickedElement.value = '00';
    }
});

$timerDisplay.addEventListener('keydown', function (event) {

    const clickedElement = event.target;

    if (!clickedElement.classList.contains('timer__part')) {
        return;
    }

    switch (event.code) {

        case 'ArrowDown': {

            let value = +clickedElement.value || 0;

            timerState.hasCustomTime = true;

            /* получаем дата-юнит элементов  */
            const unit = clickedElement.dataset.unit;

            if (value > 0) {

                value--;
                clickedElement.value = value.toString().padStart(2, '0');

                if (unit === 'hours') {
                    timerState.currentHours = value;
                }

                else if (unit === 'minutes') {
                    timerState.currentMinutes = value;
                }

                else if (unit === 'seconds') {
                    timerState.currentSeconds = value;
                }

            }

            break;

        }

        case 'ArrowUp': {

            let value = +clickedElement.value || 0;

            timerState.hasCustomTime = true;

            /* получаем дата-юнит элементов  */
            const unit = clickedElement.dataset.unit;

            /* создаём переменную, которую нельзя будет перейти */

            const max = unit === 'hours' ? 99 : 59;

            if (value < max) {

                value++;
                clickedElement.value = value.toString().padStart(2, '0');

                if (unit === 'hours') {
                    timerState.currentHours = value;
                }

                else if (unit === 'minutes') {
                    timerState.currentMinutes = value;
                }

                else if (unit === 'seconds') {
                    timerState.currentSeconds = value;
                }

            }

            break;
        }

        case 'Enter': {

            timerState.hasCustomTime = true;

            event.stopPropagation();

            event.preventDefault();

            /* timer.timeLeft = timerState.currentHours * 3600 +
                timerState.currentMinutes * 60 +
                timerState.currentSeconds */

            startTimer();

            break;
        }
    }
});

/* Загружаем звуки, после dom дерева */

document.addEventListener('DOMContentLoaded', function () {
    loadAllSounds();
})