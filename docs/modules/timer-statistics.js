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

function getTodayKey() {
    const currentDate = new Date()
    return currentDate.toISOString().split('T')[0];
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
    const storageKey = getTodayKey();

    const dataToSave = {
        stats: statsToSave,
        history: sessionsHistory,
    };

    console.log(`Сохранённые данные: ${dataToSave}`)

    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
}

function loadStatistics() {

    const storageKey = getTodayKey();

    console.log(storageKey);

    let todayData = JSON.parse(localStorage.getItem(storageKey) || '{}');

    /* обновляю данные dataToSave(statsToSave и sessionsHistory)
        если данных нет(ещё не сохраняли стату) то прописывает пустые переменные и пустой массив*/
    statsToSave = todayData.stats || {
        workSessions: 0,
        totalWorkTime: 0,
        averageSession: 0,
    }

    sessionsHistory = todayData.history || [];

    updateStatsDisplay();
}

export function loadStatisticsForDate(dateKey) {
    const data = JSON.parse(localStorage.getItem(dateKey))
    return data;
}

document.addEventListener('DOMContentLoaded', function () {
    loadStatistics();
})

/* localStorage.clear(); */

/* Функция saveDailyStats():
  - Получить ключ сегодняшней даты
  - Загрузить ВСЕ данные из localStorage (объект всех дней)
  - Обновить статистику для текущего ключа:
      * workSessions: увеличить на 1
      * totalWorkTime: прибавить sessionTime  
      * sessionsHistory: добавить sessionTime
      * averageSession: пересчитать
  - Сохранить обновленный объект обратно в localStorage */

/*   Функция loadDailyStats(dateKey):
  - Загрузить ВСЕ данные из localStorage
  - Найти объект статистики по dateKey
  - Если нет данных за эту дату - вернуть пустой шаблон
  - Отобразить найденную статистику */

/* Статистика становится объектом объектов, а не единым объектом

Ключом выступает дата вместо фиксированного 'PomodoroStatistics'

При сохранении мержим данные, а не перезаписываем всё */