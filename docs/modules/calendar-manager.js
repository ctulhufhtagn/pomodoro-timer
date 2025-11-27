import { $calendarDays, $statsTitle } from './dom-manager.js';

import { loadStatisticsForDate } from './timer-statistics.js';

const daysOfWeek = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'];

/* Переменные используются в двух функциях так что лучше хранить их в объекте */
const calendarDates = {
    date: new Date(),
    day: null,
    month: null,
    year: null,
    clickedDate: null,
}

export function generateCalendar() {
    calendarDates.day = calendarDates.date.getDate();
    calendarDates.month = calendarDates.date.getMonth();
    calendarDates.year = calendarDates.date.getFullYear();

    /* Пишем про нулевой день следующего месяца и нам показывает последний день текущего месяца => дней в месяце */
    const daysInMonth = new Date(calendarDates.year, calendarDates.month + 1, 0).getDate();

    const firstDayOfMonth = new Date(calendarDates.year, calendarDates.month, 1);

    const dateString = firstDayOfMonth.toLocaleDateString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });

    /* берём только первое слово из нашей строки даты(день) и потом находим индекс этого дня */
    const paddingDays = daysOfWeek.indexOf(dateString.split(',')[0]);

    /* Очищаем контейнер */
    $calendarDays.innerHTML = '';

    console.log('paddingDays:', paddingDays);

    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
        const dayDiv = document.createElement('div');

        if (i <= paddingDays) {
            dayDiv.classList.add('padding__day');
            dayDiv.textContent = '';
        } else {
            dayDiv.classList.add('dayOfTheMonth');
            dayDiv.textContent = i - paddingDays;
        }

        $calendarDays.appendChild(dayDiv);
    }

}

$calendarDays.addEventListener('click', handleDayClick);

function handleDayClick(e) {
    const clickedElement = e.target;

    if (!clickedElement.classList.contains('dayOfTheMonth')) {
        return;
    }

    /* переводим текст кликнутого элемента в число */
    let clickedDay = null;
    clickedDay = parseInt(clickedElement.textContent);

    calendarDates.clickedDate = new Date(calendarDates.year, calendarDates.month, clickedDay);

    console.log(calendarDates);

    $statsTitle.textContent = `Статистика за ${clickedDay}.${calendarDates.month + 1}.${calendarDates.year}`;

    /* получаем из localstorage данные за выбранную дату */
    const dateKey = calendarDates.clickedDate.toISOString().split('T')[0];
    loadStatisticsForDate(dateKey);

    /* обновляем страницу */
    updateStatsDisplay();
}

/*  220 + 40 цель 300*/