
/* Состояния таймера */
export const timerState = {
    currentMode: "work",
    hasBeenStarted: false,
    workTime: 1500,
    breakTime: 300,
    hasCustomTime: false, /* меняли ли время */
    customTime: 0,        /* какое время */

    /* переменные для сохранения изменённых значений */
    currentHours: 0,
    currentMinutes: 0,
    currentSeconds: 0,
};