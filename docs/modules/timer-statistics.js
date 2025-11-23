import { timerState } from './state-manager.js';
import { updateSessionsCount, updateTotalTime, updateAverageSession } from './dom-manager.js';

let statsToSave = {
    workSessions: 0,
    totalWorkTime: 0,
    averageSession: 0,
}

let sessionsHistory = [];
console.log(sessionsHistory);

/* функция подсчёта среднего арифметического */
function calculateAverageSession() {
    if (sessionsHistory.length === 0) return 0;

    return sessionsHistory.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / sessionsHistory.length;
}

console.log('завершено сессий: ' + statsToSave.workSessions);

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
    if (timerState.currentMode === 'work' && sessionDuration >= 300) {

        /* Добавляем кол-во завершённых сессий */
        statsToSave.workSessions++;
        console.log('завершено сессий: ' + statsToSave.workSessions);

        /* Считаем общее время работы */
        const sessionTime = sessionDuration - timeLeft;

        statsToSave.totalWorkTime += sessionTime;

        console.log('Длительность сессии = ' + sessionTime)
        sessionsHistory.push(sessionTime);

        console.log(sessionsHistory);

        /* Считаем среднее арифметическое всех сессий */
        statsToSave.averageSession = calculateAverageSession();


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

    let data = JSON.parse(localStorage.getItem('PomodoroStatistics') || 'null');

    console.log(data)

    /* обновляю данные dataToSave(statsToSave и sessionsHistory) */
    statsToSave = data.stats;
    sessionsHistory = data.history;
    console.log(sessionsHistory);

    updateStatsDisplay();
}

document.addEventListener('DOMContentLoaded', function () {
    loadStatistics();
})