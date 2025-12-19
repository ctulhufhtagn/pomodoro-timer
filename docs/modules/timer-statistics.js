import { timerState } from './state-manager.js';
import { updateSessionsCount, updateTotalTime, updateAverageSession } from './dom-manager.js';

let todayStats = {
    workSessions: 0,
    totalWorkTime: 0,
    averageSession: 0,
    sessionsHistory: [],
};

let displayedStats = {
    workSessions: 0,
    totalWorkTime: 0,
    averageSession: 0,
}

/* функция подсчёта среднего арифметического */
function calculateAverageSession() {
    if (todayStats.sessionsHistory.length === 0) return 0;

    return todayStats.sessionsHistory.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / todayStats.sessionsHistory.length;
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

export function updateStatsDisplay(stats = todayStats) {
    updateSessionsCount(stats.workSessions || 0);
    updateTotalTime(stats.totalWorkTime || 0);
    updateAverageSession(stats.averageSession || 0);
}

export function getTodayKey() {
    const currentDate = new Date()
    return currentDate.toISOString().split('T')[0];
}

export function completeSession(sessionDuration, timeLeft) {

    const sessionTime = sessionDuration - timeLeft;

    if (timerState.currentMode === 'work' && sessionTime >= 300) {

        /* Добавляем кол-во завершённых сессий */
        todayStats.workSessions++;

        /* Считаем общее время работы */

        todayStats.totalWorkTime += sessionTime;

        todayStats.sessionsHistory.push(sessionTime);

        /* Считаем среднее арифметическое всех сессий */
        todayStats.averageSession = Math.floor(calculateAverageSession());

        /* меняем данные на странице */
        updateStatsDisplay();

        /* сохраняем данные в локал */
        saveStatistics();
    }
}

function saveStatistics() {
    const storageKey = getTodayKey();

    localStorage.setItem(storageKey, JSON.stringify(todayStats));
}

function loadStatistics() {

    const storageKey = getTodayKey();

    console.log("Данные за сегодня: " + storageKey);

    let storedData = JSON.parse(localStorage.getItem(storageKey) || '{}');

    todayStats = {
        workSessions: storedData.workSessions || 0,
        totalWorkTime: storedData.totalWorkTime || 0,
        averageSession: storedData.averageSession || 0,
        sessionsHistory: storedData.sessionsHistory || [],
    };

    updateStatsDisplay();
}

export function loadStatisticsForDate(dateKey) {
    const data = JSON.parse(localStorage.getItem(dateKey) || '{}')
    return data;
}

document.addEventListener('DOMContentLoaded', function () {
    loadStatistics();
})