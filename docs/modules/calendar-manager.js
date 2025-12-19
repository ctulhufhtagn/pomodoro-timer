import { $calendarContainer, $calendarDays, $statsTitle, $calendarYearSelector, $statsCalendarButton, $modal, $modalOverlay, $calendarMonthSelector, $periodDropdownList, $dropdownText } from './dom-manager.js';

import { loadStatisticsForDate, updateStatsDisplay, getTodayKey } from './timer-statistics.js';

import { currentLanguage, updateMonthHeader, languageData, texts } from './lang.js';

/* Управление модалкой */
$statsCalendarButton.addEventListener('click', openModal);

document.addEventListener('keydown', (e) => {

    if (e.key === 'Escape') {
        closeModal();
    }
})

$modalOverlay.addEventListener('click', closeModal);
function openModal() {
    $modal.classList.add('modal--open');
    generateCalendar();
}

function closeModal() {
    $modal.classList.remove('modal--open');
    periodModalClose();
}

/* Генерация календаря и его переменные */

const daysOfWeek = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'];
const months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
    'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
];

/* Переменные используются в двух функциях так что лучше хранить их в объекте */
const now = new Date();
window.calendarDates = {
    date: now,
    day: now.getDate(),
    month: now.getMonth(),
    year: now.getFullYear(),
    clickedDate: null,
}

function getMonthData() {
    /* Пишем про нулевой день следующего месяца и нам показывает последний день текущего месяца => дней в месяце */
    const daysInMonth = new Date(calendarDates.year, calendarDates.month + 1, 0).getDate();

    const firstDayOfMonth = new Date(calendarDates.year, calendarDates.month, 1);

    return {
        daysInMonth,
        firstDayOfMonth,
    }
}

export function generateCalendar() {

    const monthData = getMonthData(/* calendarDates.year, calendarDates.month */);

    const dateString = monthData.firstDayOfMonth.toLocaleDateString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    /* берём только первое число из нашей строки даты(день) и потом находим индекс этого дня */
    const paddingDays = daysOfWeek.indexOf(dateString.split(',')[0]);

    /* Очищаем контейнер */
    $calendarDays.innerHTML = '';

    const totalCells = 42;

    for (let i = 0; i < totalCells/* paddingDays + monthData.daysInMonth */; i++) {
        const dayDiv = document.createElement('div');

        if (i < paddingDays || i >= paddingDays + monthData.daysInMonth) {
            dayDiv.classList.add('padding__day');
            dayDiv.textContent = '';
        } else {
            dayDiv.classList.add('dayOfTheMonth');
            dayDiv.textContent = i - paddingDays + 1;
        }

        $calendarDays.appendChild(dayDiv);
    }

    $calendarYearSelector.value = calendarDates.year;

    if (currentLanguage === 'en') {
        updateMonthHeader();
    } else {
        const monthname = months[calendarDates.month]
        $calendarMonthSelector.textContent = monthname[0].toUpperCase() + monthname.slice(1);
    }
}

function nextYear() {
    calendarDates.year = calendarDates.year + 1;
    generateCalendar();
    updateButtonVisibility();
}

function prevYear() {
    calendarDates.year = calendarDates.year - 1;
    generateCalendar();
    updateButtonVisibility();
}

function nextMonth() {
    calendarDates.month = calendarDates.month + 1;
    if (calendarDates.month > 11) {
        calendarDates.month = 0
        calendarDates.year++
    }
    generateCalendar();
    periodModalClose();
    updateButtonVisibility();
}

function prevMonth() {
    calendarDates.month = calendarDates.month - 1;
    if (calendarDates.month < 0) {
        calendarDates.month = 11;
        calendarDates.year--;
    }
    generateCalendar();
    periodModalClose();
    updateButtonVisibility();
}

function handleDayClick(clickedElement) {
    /* переводим текст кликнутого элемента в число */
    let clickedDay = null;
    clickedDay = parseInt(clickedElement.textContent);

    calendarDates.day = clickedDay;

    calendarDates.clickedDate = new Date(calendarDates.year, calendarDates.month, clickedDay);
    let clickedDayWithZero = clickedDay.toString().padStart(2, '0')

    let monthPlusOne = calendarDates.month + 1;
    let monthWithZero = monthPlusOne.toString().padStart(2, '0');
    /* $statsTitle.textContent = `Статистика за ${clickedDayWithZero}.${monthWithZero}.${calendarDates.year}`; */
    $statsTitle.textContent = `${texts[currentLanguage].selectPeriod} ${clickedDayWithZero}.${monthWithZero}.${calendarDates.year}`;

    /* получаем из localstorage данные за выбранную дату */
    /* const dateKey = calendarDates.clickedDate.toISOString().split('T')[0]; */
    const dateKey = `${calendarDates.year}-${calendarDates.month + 1}-${clickedDay.toString().padStart(2, '0')}`

    const selectedDate = loadStatisticsForDate(dateKey);
    updateStatsDisplay(selectedDate);
    closeModal();
};


/* генерация месяцев */

function generateMonthList() {
    const monthList = document.createElement('ul');
    monthList.classList.add('calendar__months-list', 'calendar__months-list--opened');

    const monthsArray = languageData[currentLanguage].months;

    monthsArray.forEach((month, index) => {
        const monthDiv = document.createElement('li');
        monthDiv.classList.add('calendar__months-item');
        monthDiv.textContent = month;
        monthList.appendChild(monthDiv);
        monthDiv.dataset.monthIndex = index;
    });

    $calendarMonthSelector.appendChild(monthList);
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


    generateCalendar();
    closeMonthList();
}

/* Общий родитель для обработки всех кликов */
$calendarContainer.addEventListener('click', handleCalendarClick);

function handleCalendarClick(e) {

    const clickedElement = e.target;
    console.log(clickedElement)

    if (!clickedElement.closest('.calendar__month-selector, .calendar__month-list')) {
        closeMonthList();
    }

    if (!clickedElement.closest('.period-dropdown__list, .dropdown__text, .dropdown__arrow-down')) {
        periodModalClose();
    }

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

    else if (clickedElement.matches('.dropdown__text, .dropdown__arrow-down')) {
        periodModalOpen();
    }

    else if (clickedElement.classList.contains('period-dropdown__item')) {
        const period = e.target.dataset.period;

        const periodMap = {
            'day': (window.texts && window.texts[currentLanguage] && window.texts[currentLanguage].dayPeriod) || 'Day',
            'week': (window.texts && window.texts[currentLanguage] && window.texts[currentLanguage].weekPeriod) || 'Week',
            'month': (window.texts && window.texts[currentLanguage] && window.texts[currentLanguage].monthPeriod) || 'Month'
        };

        $dropdownText.textContent = periodMap[period];

        if (period === 'week') {
            selectWeekPeriod(getMonday());
            selection.periodMod = 'week';
            $statsTitle.textContent = texts[currentLanguage].statsTitleWeek
            $dropdownText.textContent = texts[currentLanguage].weekPeriod
        }

        if (period === 'month') {
            const monthStats = selectMonthPeriod();
            updateStatsDisplay(monthStats);

            const monthNumber = calendarDates.month;
            const monthName = texts[currentLanguage].months[monthNumber];
            console.log(monthName);
            const monthTitleCase = monthName[0].toUpperCase() + monthName.slice(1);
            $statsTitle.textContent = `${texts[currentLanguage].selectPeriod} ${monthTitleCase}`
            selection.periodMod = 'month';
            $dropdownText.textContent = texts[currentLanguage].monthPeriod
        }

        if (period === 'day') {
            selection.periodMod = 'day';
            /* $dropdownText.textContent = 'День'; */
            $dropdownText.textContent = texts[currentLanguage].dayPeriod

            calendarDates.year = new Date().getFullYear();
            calendarDates.month = new Date().getMonth();
            calendarDates.day = new Date().getDate();

            generateCalendar();

            const todayKey = getTodayKey();
            console.log(todayKey);
            const dayStats = loadStatisticsForDate(todayKey);
            updateStatsDisplay(dayStats);

            $statsTitle.textContent = `${texts[currentLanguage].statsTitleDay}`;
        }
        periodModalClose();
        closeModal();
    }
}

/* Выбор дней по датам */

function periodModalOpen() {
    $periodDropdownList.classList.toggle('period-dropdown__list--opened');
}

function periodModalClose() {
    $periodDropdownList.classList.remove('period-dropdown__list--opened');
}

let selection = {
    periodMod: 'day',
    startDay: null,
    endDay: null,
}

function getMonday() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const dayOfMonth = today.getDate();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    let monday = new Date();
    monday.setDate(today.getDate() - daysToMonday);

    /* const mondayString = monday.toLocaleDateString('ru-RU') */
    return monday;
}
getMonday();

let currentMonday = null;
let dateKeys = []
function selectWeekPeriod(monday) {
    currentMonday = monday;
    dateKeys = [];

    console.log('Понедельник недели:', monday.toLocaleDateString());

    const weekStats = {
        workSessions: 0,
        totalWorkTime: 0,
        averageSession: 0,
    };

    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(currentMonday);
        currentDay.setDate(currentMonday.getDate() + i);

        let year = currentDay.getFullYear();
        let monthNumber = currentDay.getMonth() + 1;
        let monthString = monthNumber.toString().padStart(2, '0');
        let dayNumber = currentDay.getDate();
        let dayString = dayNumber.toString().padStart(2, '0');
        /* перевожу в формат такого же ключа как в localStorage */
        let dateKey = `${year}-${monthString}-${dayString}`;

        dateKeys.push(dateKey);

        const dayStats = loadStatisticsForDate(dateKey);

        /* суммирую статистику */
        weekStats.workSessions += dayStats.workSessions || 0;
        weekStats.totalWorkTime += dayStats.totalWorkTime || 0;
    }

    /* по новой считаем среднюю сессию */
    if (weekStats.workSessions > 0) {
        weekStats.averageSession = Math.round(weekStats.totalWorkTime / weekStats.workSessions);
    }

    updateStatsDisplay(weekStats);
    $statsTitle.textContent = `Статистика за неделю`;
    return weekStats;
}

function selectMonthPeriod() {
    const monthData = getMonthData(calendarDates.year, calendarDates.month);
    const currentDate = new Date(monthData.firstDayOfMonth);

    const monthStats = {
        workSessions: 0,
        totalWorkTime: 0,
        averageSession: 0,
    };

    for (let day = 1; day <= monthData.daysInMonth; day++) {

        const dateString = currentDate.toLocaleDateString('ru-RU');
        const day1 = dateString.split('.')[0];
        const month = dateString.split('.')[1];
        const year = dateString.split('.')[2];
        const keyString = `${year}-${month}-${day1}`;

        dateKeys.push(keyString);
        currentDate.setDate(currentDate.getDate() + 1);
        const dayStats = loadStatisticsForDate(keyString);

        /* суммирую статистику */
        monthStats.workSessions += dayStats.workSessions || 0;
        monthStats.totalWorkTime += dayStats.totalWorkTime || 0;
    }

    return monthStats;
}

/* Убираем выбор статы за неделю если выбран не текущий год/месяц */
function updateButtonVisibility() {
    const currentDate = new Date();
    const isCurrentMonth = (calendarDates.year === currentDate.getFullYear()
        && calendarDates.month === currentDate.getMonth());

    const weekButton = document.querySelector('[data-period="week"]');

    if (weekButton) {
        if (isCurrentMonth) {
            weekButton.style.display = 'block';
            weekButton.disabled = false;
            weekButton.style.opacity = '1';
            weekButton.style.cursor = 'pointer';
            weekButton.title = 'Статистика за текущую неделю';
        } else {
            weekButton.style.display = 'none';
            weekButton.disabled = true;
            weekButton.style.opacity = '0.5';
            weekButton.style.cursor = 'not-allowed';
            weekButton.title = 'Доступно только для текущего месяца';
        }
    }
}