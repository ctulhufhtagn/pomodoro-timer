import { $calendarDays } from './dom-manager.js';

const date = new Date();
const date2 = date.toLocaleDateString();
console.log(date);

const daysOfWeek = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'];

export function generateCalendar() {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    /* Пишем про нулевой день следующего месяца и нам показывает последний день текущего месяца => дней в месяце */
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    console.log(daysInMonth);

    const firstDayOfMonth = new Date(year, month, 1);

    const dateString = firstDayOfMonth.toLocaleDateString('ru-RU', {

        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });

    console.log(dateString);

    /* берём только первое слово из нашей строки даты(день) и потом находим индекс этого дня */
    const paddingDays = daysOfWeek.indexOf(dateString.split(',')[0]);
    console.log(paddingDays);

    /* Очищаем контейнер */
    $calendarDays.innerHTML = '';

    console.log('paddingDays:', paddingDays);

    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
        const day = document.createElement('div');

        console.log(day);

        if (i <= paddingDays) {
            day.classList.add('padding__day');
            day.textContent = '';
        } else {
            day.classList.add('dayOfTheMonth');
            day.textContent = i - paddingDays;
        }

        $calendarDays.appendChild(day);
    }

}

$calendarDays.addEventListener('click', (e) => {
    const clickedElement = e.target;
    console.log(clickedElement);

    let clickedDay = null;

    clickedDay = parseInt(clickedElement.textContent);
    console.log(typeof clickedElement.textContent);

    console.log(clickedDay);

    const clickedDate = new Date(year, month, clickedDay);

    /* console.log(clickedDate); */
})

function handleDayClick() {

}

/* 50 */