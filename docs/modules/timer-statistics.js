import { timerState } from './state-manager.js';
import { updateSessionsCount, updateTotalTime, updateAverageSession } from './dom-manager.js';

let statsToSave = {
    workSessions: 0,
    totalWorkTime: 0,
    averageSession: 0,
}

let sessionsHistory = [];

/* функция подсчёта среднего арифметического */
function calculateAverageSession() {
    if (sessionsHistory.length === 0) return 0;

    return sessionsHistory.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / sessionsHistory.length;
}

/* функция форматирования времени в формат HH:MM:SS */
export function formatTime(totalSeconds) {

    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    let seconds = totalSeconds % 60;

    return {
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
    }
}

function updateStatsDisplay() {
    updateSessionsCount(statsToSave.workSessions);
    updateTotalTime(statsToSave.totalWorkTime);
    updateAverageSession(statsToSave.averageSession);
}

export function completeSession(sessionDuration, timeLeft) {

    const sessionTime = sessionDuration - timeLeft;

    if (timerState.currentMode === 'work' && sessionTime >= 300) {

        /* Добавляем кол-во завершённых сессий */
        statsToSave.workSessions++;
        console.log('завершено сессий: ' + statsToSave.workSessions);

        /* Считаем общее время работы */

        statsToSave.totalWorkTime += sessionTime;

        sessionsHistory.push(sessionTime);


        /* Считаем среднее арифметическое всех сессий */
        statsToSave.averageSession = Math.floor(calculateAverageSession());


        /* меняем данные на странице */
        updateStatsDisplay();

        /* сохраняем данные в локал */
        saveStatistics();
    }
}

function saveStatistics() {
    const dataToSave = {

        stats: statsToSave,
        history: sessionsHistory,
    };

    console.log(`Сохранённые данные: ${dataToSave}`)

    localStorage.setItem('PomodoroStatistics', JSON.stringify(dataToSave));
}

function loadStatistics() {

    let data = JSON.parse(localStorage.getItem('PomodoroStatistics') || '{}');

    /* обновляю данные dataToSave(statsToSave и sessionsHistory)
        если данных нет(ещё не сохраняли стату) то прописывает пустые переменные и пустой массив*/
    statsToSave = data.stats || {
        workSessions: 0,
        totalWorkTime: 0,
        averageSession: 0,
    }
    sessionsHistory = data.history || [];

    updateStatsDisplay();
}

document.addEventListener('DOMContentLoaded', function () {
    loadStatistics();
})