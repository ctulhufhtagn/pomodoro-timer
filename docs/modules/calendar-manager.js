import { $calendarContainer, $calendarDays, $statsTitle, $calendarYearSelector, $statsCalendarButton, $modal, $modalOverlay, $calendarMonthSelector, } from './dom-manager.js';

import { loadStatisticsForDate, updateStatsDisplay } from './timer-statistics.js';

/* Управление модалкой */
$statsCalendarButton.addEventListener('click', openModal);

document.addEventListener('keydown', (e) => {

    if (e.key === 'Escape') {
        closeModal();
    }
})

/* document.addEventListener('click', (e) => {

    const monthList = document.querySelector('.calendar__months-list');

    if (monthList && monthList.classList.contains('calendar__months-list--opened')
        && !e.target.closest('calendar__month-selector')
        && !e.target.closest('calendar__months-list')) {
        closeMonthList();
    }
}) */

$modalOverlay.addEventListener('click', closeModal);
function openModal() {
    $modal.classList.add('modal--open');
    generateCalendar();
}

function closeModal() {
    $modal.classList.remove('modal--open');
}


/* Генерация календаря и его переменные */

const daysOfWeek = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'];
const months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
    'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
];

/* Переменные используются в двух функциях так что лучше хранить их в объекте */
const now = new Date();
const calendarDates = {
    date: now,
    day: now.getDate(),
    month: now.getMonth(),
    year: now.getFullYear(),
    clickedDate: null,
}

export function generateCalendar() {
    /* Пишем про нулевой день следующего месяца и нам показывает последний день текущего месяца => дней в месяце */
    const daysInMonth = new Date(calendarDates.year, calendarDates.month + 1, 0).getDate();

    const firstDayOfMonth = new Date(calendarDates.year, calendarDates.month, 1);

    const dateString = firstDayOfMonth.toLocaleDateString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    /* берём только первое число из нашей строки даты(день) и потом находим индекс этого дня */
    const paddingDays = daysOfWeek.indexOf(dateString.split(',')[0]);

    /* Очищаем контейнер */
    $calendarDays.innerHTML = '';

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

    const monthname = months[calendarDates.month]
    $calendarMonthSelector.textContent = monthname[0].toUpperCase() + monthname.slice(1);
    $calendarYearSelector.value = calendarDates.year;
}

function nextYear() {
    calendarDates.year = calendarDates.year + 1;
    console.log("год:", calendarDates.year)
    console.log("месяц:", + calendarDates.month)
    generateCalendar();
}

function prevYear() {
    calendarDates.year = calendarDates.year - 1;
    console.log("год:", calendarDates.year)
    console.log("месяц:", + calendarDates.month)
    generateCalendar();
}

function nextMonth() {
    calendarDates.month = calendarDates.month + 1;
    if (calendarDates.month > 11) {
        calendarDates.month = 0
        calendarDates.year++
    }
    console.log(calendarDates.month);
    generateCalendar();
}

function prevMonth() {
    calendarDates.month = calendarDates.month - 1;
    if (calendarDates.month < 0) {
        calendarDates.month = 11;
        calendarDates.year--;
    }
    console.log(calendarDates.month);
    generateCalendar();
}

function handleDayClick(clickedElement) {
    /* переводим текст кликнутого элемента в число */
    let clickedDay = null;
    clickedDay = parseInt(clickedElement.textContent);

    calendarDates.day = clickedDay;

    calendarDates.clickedDate = new Date(calendarDates.year, calendarDates.month, clickedDay);

    $statsTitle.textContent = `Статистика за ${clickedDay}.${calendarDates.month + 1}.${calendarDates.year}`;

    /* получаем из localstorage данные за выбранную дату */
    /* const dateKey = calendarDates.clickedDate.toISOString().split('T')[0]; */
    const dateKey = `${calendarDates.year}-${calendarDates.month + 1}-${clickedDay.toString().padStart(2, '0')}`

    console.log("dateKey: ", dateKey);

    const selectedDate = loadStatisticsForDate(dateKey);
    console.log('Данные за', clickedDay, ':', selectedDate);
    updateStatsDisplay(selectedDate);
    closeModal();
};


/* генерация месяцев */

function generateMonthList() {
    const monthList = document.createElement('ul');
    monthList.classList.add('calendar__months-list', 'calendar__months-list--opened');

    months.forEach((month, index) => {
        const monthDiv = document.createElement('li');
        monthDiv.classList.add('calendar__months-item');
        monthDiv.textContent = month;
        monthList.appendChild(monthDiv);
        monthDiv.dataset.monthIndex = index;
    });

    $calendarMonthSelector.appendChild(monthList);
    console.log($calendarMonthSelector);
    console.log("month:", calendarDates);
}

function toggleMonthList() {

    const monthList = document.querySelector('.calendar__months-list');

    if (!monthList) {
        generateMonthList();
    } else {
        monthList.classList.toggle('calendar__months-list--opened');
    }
}

function closeMonthList() {
    const monthList = document.querySelector('.calendar__months-list');
    if (monthList) {
        monthList.classList.remove('calendar__months-list--opened')
    }
}

function handleMonthSelect(clickedElement) {
    const monthNumber = parseInt(clickedElement.dataset.monthIndex);
    calendarDates.date = new Date(calendarDates.year, monthNumber, 1)
    calendarDates.month = monthNumber;
    console.log("calendarDates.month: ", calendarDates.month);

    generateCalendar();
    closeMonthList();
}

/* Общий родитель для обработки всех кликов */
$calendarContainer.addEventListener('click', handleCalendarClick);

function handleCalendarClick(e) {

    const clickedElement = e.target;
    console.log(clickedElement)

    if (clickedElement.classList.contains('dayOfTheMonth')) {
        handleDayClick(clickedElement);
    }

    else if (clickedElement.classList.contains('calendar__months-item')) {
        handleMonthSelect(clickedElement);
    }

    else if (clickedElement.closest('.calendar__month-selector')) {
        toggleMonthList();
    }

    else if (clickedElement.classList.contains('year-controls__up')) {
        nextYear();
    }

    else if (clickedElement.classList.contains('year-controls__down')) {
        prevYear();
    }

    else if (clickedElement.classList.contains('calendar__nav-btn--next')) {
        nextMonth();
    }

    else if (clickedElement.classList.contains('calendar__nav-btn--prev')) {
        prevMonth();
    }
}

/* Выбор дней по датам */
