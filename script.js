/* Переменные хедера таймера*/
const $timerModeSelector = document.querySelector('.timer__mode-selector');
let $timerModeButtonWork = document.querySelector('.timer__mode-button--work');
let $timerModeButtonBreak = document.querySelector('.timer__mode-button--break');

/* части дисплея таймера */
let $timerDisplay = document.querySelector('.timer__display');

let $timerHours = document.querySelector('[data-unit="hours"]');
let $timerMinutes = document.querySelector('[data-unit="minutes"]');
let $timerSeconds = document.querySelector('[data-unit="seconds"]');

/* Кнопки таймера */
let $startButton = document.querySelector('.timer__button--start');
let $pauseButton = document.querySelector('.timer__button--pause');
let $resetButton = document.querySelector('.timer__button--reset');
let $timerControls = document.querySelector('.timer__controls');

/* $startButton.addEventListener('click', startTimer); */

/* Состояния таймера */
let currentMode = "work";
let hasBeenStarted = false;
let workTime = 1500;
let breakTime = 300;
let hasCustomTime = false; /* меняли ли время */
let customTime = 0;        /* какое время */

intervalId = null /* ID таймера для остановки  */

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

        if (isRunning && currentMode === "break") {
            resetTimer();
        }

        clickedModule.classList.add('timer__mode-button--active');
        $timerModeButtonBreak.classList.remove('timer__mode-button--active');

        $timerHours.value = '00';
        $timerMinutes.value = '25';
        $timerSeconds.value = '00';

        currentMode = "work";
        timeLeft = workTime;
    }

    else if (clickedModule.classList.contains('timer__mode-button--break')) {

        if (isRunning && currentMode === "work") {
            resetTimer();
        }

        clickedModule.classList.add('timer__mode-button--active')
        $timerModeButtonWork.classList.remove('timer__mode-button--active');

        $timerHours.value = '00';
        $timerMinutes.value = '05';
        $timerSeconds.value = '00';

        currentMode = "break";
        timeLeft = breakTime;
    }
});

/* переменные для сохранения изменённых значений */

let currentHours = 0;
let currentMinutes = 0;
let currentSeconds = 0;

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

            hasCustomTime = true;

            /* получаем дата-юнит элементов  */
            const unit = clickedElement.dataset.unit;

            if (value > 0) {

                value--;
                clickedElement.value = value.toString().padStart(2, '0');

                if (unit === 'hours') {
                    currentHours = value;
                }

                else if (unit === 'minutes') {
                    currentMinutes = value;
                }

                else if (unit === 'seconds') {
                    currentSeconds = value;
                }

            }

            break;

        }

        case 'ArrowUp': {

            let value = +clickedElement.value || 0;

            hasCustomTime = true;

            /* получаем дата-юнит элементов  */
            const unit = clickedElement.dataset.unit;

            /* создаём переменную, которую нельзя будет перейти */

            const max = unit === 'hours' ? 99 : 59;

            if (value < max) {

                value++;
                clickedElement.value = value.toString().padStart(2, '0');

                if (unit === 'hours') {
                    currentHours = value;
                }

                else if (unit === 'minutes') {
                    currentMinutes = value;
                }

                else if (unit === 'seconds') {
                    currentSeconds = value;
                }

            }

            break;
        }

        case 'Enter': {

            hasCustomTime = true;

            event.stopPropagation();

            event.preventDefault();

            startTimer(currentHours, currentMinutes, currentSeconds);

            break;
        }
    }
});

/* функция работы таймера */

let timeLeft = 0;
let isRunning = false;
/* let currentTime = 0; */

function displayTimer() {

    let hours = Math.floor(timeLeft / 3600);
    let minutes = Math.floor((timeLeft % 3600) / 60);
    let seconds = Math.floor(timeLeft % 60);
    console.log(timeLeft);

    $timerHours.value = hours.toString().padStart(2, '0');
    $timerMinutes.value = minutes.toString().padStart(2, '0');
    $timerSeconds.value = seconds.toString().padStart(2, '0');

    console.log(`timeLeft: ${timeLeft}, minutes: ${minutes}, calc: ${timeLeft}/60`);
}

function startTimer() {

    if (isRunning) {
        return;
    }

    console.log('раннинг до того как меняется в ф-ии:', isRunning);

    isRunning = true;

    updateButtonState('idle');

    if (!hasBeenStarted) {

        if (hasCustomTime) {

            timeLeft = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

            console.log('в кастоме', isRunning);

        } else {
            /* === условие ? если истинно : если ложно */
            timeLeft = currentMode === "work" ? workTime : breakTime;
        }

        hasBeenStarted = true;

        console.log(hasBeenStarted);

    }

    console.log('timeleft = ' + timeLeft);

    displayTimer();

    intervalId = setInterval(() => {

        if (timeLeft <= 0) {
            clearInterval(intervalId);
            console.log("Таймер завершён!");
            isRunning = false;
            return;
        }

        timeLeft--;

        displayTimer();

        console.log(timeLeft);

    }, 1000);

}

function pauseTimer() {

    console.log('Pause called, intervalId:', intervalId);

    /* останавливаем таймер и сохраняем его время, меняем состояние */
    clearInterval(intervalId);

    isRunning = false;
    intervalId = null;

    updateButtonState('pause');

}

function resetTimer() {

    clearInterval(intervalId);

    isRunning = false;
    hasBeenStarted = false;

    timeLeft = currentMode === "work" ? workTime : breakTime;

    displayTimer();
    updateButtonState('reset');

    console.log('timeleft = ' + timeLeft);
}

function updateButtonState(state) {

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

