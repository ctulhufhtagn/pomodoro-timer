import { $calendarMonthSelector, $sidebarButtonLang } from './dom-manager.js';

export const texts = {
    ru: {
        // Заголовок приложения
        /* appTitle: "Учись, собака!", */

        // Таймер
        workMode: "Работа",
        breakMode: "Отдых",
        timerStart: "Старт",
        timerPause: "Пауза",
        timerReset: "Сброс",

        // Статистика
        statsTitleDay: "Статистика за день",
        statsTitleWeek: "Статистика за неделю",
        statsTitleMonth: "Статистика за месяц",
        sessionsCompleted: "Завершено сессий",
        totalWorkTime: "Общее время работы",
        averageSession: "Средняя сессия",

        // Календарь
        selectPeriod: "Статистика за",
        dayPeriod: "День",
        weekPeriod: "Неделя",
        monthPeriod: "Месяц",

        // Модалка настройки звуков
        soundWorkMode: "Работа",
        soundBreakMode: "Отдых",

        // Дни недели (для календаря)
        daysOfWeek: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
        daysOfWeekFull: ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'],

        // Месяцы
        months: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
        monthsGenitive: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
    },

    en: {
        /* appTitle: "Study, dog!", */
        workMode: "Work",
        breakMode: "Break",
        timerStart: "Start",
        timerPause: "Pause",
        timerReset: "Reset",
        statsTitleDay: "Daily Statistics",
        statsTitleWeek: "Weekly Statistics",
        statsTitleMonth: "Monthly Statistics",
        sessionsCompleted: "Sessions completed",
        totalWorkTime: "Total working time",
        averageSession: "Average session",
        selectPeriod: "Statistics for",
        dayPeriod: "Day",
        weekPeriod: "Week",
        monthPeriod: "Month",
        soundWorkMode: "Work",
        soundBreakMode: "Break",
        daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        daysOfWeekFull: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthsGenitive: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }
};

export const languageData = {
    ru: {
        daysOfWeek: ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'],
        months: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
        monthsGenitive: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
    },
    en: {
        daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        months: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
        monthsGenitive: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
    }
};

export let currentLanguage = 'ru';

export function switchLanguage() {
    if (currentLanguage === 'ru') {
        currentLanguage = 'en';
        $sidebarButtonLang.textContent = 'EN'
    } else {
        currentLanguage = 'ru';
        $sidebarButtonLang.textContent = 'RU'
    }
}

export function updateMonthHeader() {
    const monthSelector = document.querySelector('.calendar__month-selector');
    if (monthSelector) {
        const monthName = languageData[currentLanguage].months[window.calendarDates.month]
        monthSelector.textContent = monthName[0].toUpperCase() + monthName.slice(1);
    }
}

export function updateDropdownText() {
    const dropdownText = document.querySelector('.dropdown__text');
    /* const dropdownName = languageData[currentLanguage]. */
}

export function updateAllText() {
    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(element => {
        const key = element.dataset.lang;

        if (texts[currentLanguage] && texts[currentLanguage][key]) {
            element.textContent = texts[currentLanguage][key]
        }
    })
}

export function updateCalendarDayHeaders() {
    const dayHeaders = document.querySelectorAll('.calendar__day-header');
    const days = texts[currentLanguage].daysOfWeek;

    dayHeaders.forEach((day, index) => {
        day.textContent = days[index]
    });
}