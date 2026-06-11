import { getMonthEventedDays } from "../api.js"
import { getLocalDate } from "../utils.js"
export class Calendary {
    constructor() {
        this.container = null;
        
        this.selectedDate = this.getWeekDates(new Date())[0];
        this.isExpanded = false;
        // this.onSelectWeekFromTray = null;
        this.onSelectWeekFromFull = null;
        this.onOpenTray = null;
        this.onCloseTray = null;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.swipeThreshold = 50;
        this.isAnimating = false;
        this.width = "100%"
        this.height = "100%"
    }

    // Основной метод для вставки календаря в контейнер
    insertTo(obj) {
        if (!obj) {
            console.error('Контейнер не предоставлен');
            return;
        }

        // Создаем контейнер календаря
        this.container = document.createElement('div');
        this.container.className = 'calendar-container';

        // Устанавливаем размеры, если предоставлены


        // // Генерируем первоначальное представление (трей)
        // this.renderTrayView();

        // Вставляем в целевой объект
        if (typeof obj === 'string') {
            const targetElement = document.querySelector(obj);
            if (targetElement) {
                targetElement.appendChild(this.container);
            } else {
                console.error('Элемент не найден:', obj);
                return;
            }
        } else if (obj instanceof HTMLElement) {
            obj.appendChild(this.container);
        } else {
            console.error('Неподдерживаемый тип контейнера');
            return;
        }
    }
    render() {
       
        if (this.isExpanded) {
            this.renderFullView()
        } else {
            this.renderTrayView()
        }
    }
    // Рендер трея (свернутого состояния)
    renderTrayView() {
        
        this.container.innerHTML = '';
        this.isExpanded = false;

        this.container.style.width = this.width;
        this.container.style.height = this.height;
        // Создаем заголовок
        const header = document.createElement('div');
        header.className = 'calendar-header';

        const monthText = document.createElement('div');
        monthText.className = 'current-month';
        monthText.textContent = this.getMonthYearText(this.selectedDate);

        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-button';
        toggleButton.innerHTML = '▼';
        toggleButton.addEventListener('click', () => this.toggleView());

        header.appendChild(monthText);
        header.appendChild(toggleButton);

        // Создаем дни недели
        const weekDays = document.createElement('div');
        weekDays.className = 'week-days';
        ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'week-day';
            dayElement.textContent = day;
            weekDays.appendChild(dayElement);
        });

        // Создаем дни текущей недели
        const trayDays = document.createElement('div');
        trayDays.className = 'tray-days';
        // trayDays.addEventListener('click', () => this.selectFromTray(date));
        
        const weekDates = this.getWeekDates(this.selectedDate);
        weekDates.forEach(date => {
            const dayButton = this.createDayButton(date, false);
            
            trayDays.appendChild(dayButton);
        });

        // Добавляем все элементы в контейнер
        this.container.appendChild(header);
        this.container.appendChild(weekDays);
        this.container.appendChild(trayDays);
        getMonthEventedDays(getLocalDate(this.selectedDate), (data) => {
            let eventedDays = []
            for (let i = 0; i < data["dates"].length; i++) {
                eventedDays.push(new Date(data["dates"][i]))
            }

            weekDates.forEach(date => {
                
                let dayButton = this.container.querySelector(`#day-button-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`)
                if (eventedDays.map(d => d.toISOString()).includes(date.toISOString())) {
                    dayButton.classList.add("evented")
                }
                // dayButton.addEventListener('click', () => this.selectWeekFromFull(date, week));
                
            })
      
        })

        


        // Добавляем анимацию появления
        //                this.container.classList.add('slide-in');-->
    }



    // Создание кнопки дня
    createDayButton(date, isOtherMonth = false) {
        const dayButton = document.createElement('button');
        dayButton.className = 'day-button';
        dayButton.id = `day-button-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
        if (this.isToday(date)) dayButton.classList.add('today');
        // if (this.isSameDate(date, this.selectedDate)) dayButton.classList.add('selected');
        if (isOtherMonth) dayButton.classList.add('other-month');

        dayButton.textContent = date.getDate();

        // Добавляем индикатор событий для некоторых дней
        // if (Math.random() > 0.7) {
        //     const eventDot = document.createElement('div');
        //     eventDot.className = 'event-dot';
        //     dayButton.appendChild(eventDot);
        // }

        return dayButton;
    }

    // Рендер развернутого вида
    renderFullView() {

        this.container.innerHTML = '';
        this.isExpanded = true;
        
        this.container.style.width = this.width;
        this.container.style.height = this.height;
        // Создаем заголовок
        const header = document.createElement('div');
        header.className = 'calendar-header';

        const monthText = document.createElement('div');
        monthText.className = 'current-month';
        monthText.textContent = this.getMonthYearText(this.selectedDate);

        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-button';
        toggleButton.innerHTML = '✕';
        toggleButton.addEventListener('click', () => this.toggleView());

        header.appendChild(monthText);
        header.appendChild(toggleButton);

        // Создаем дни недели
        const weekDays = document.createElement('div');
        weekDays.className = 'week-days';
        ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'week-day';
            dayElement.textContent = day;
            weekDays.appendChild(dayElement);
        });

        // Создаем контейнер для полного месяца
        const fullDaysContainer = document.createElement('div');
        fullDaysContainer.className = 'full-days';

        // Контейнер для месяца
        const monthContainer = document.createElement('div');
        monthContainer.className = 'month-container';

        // Получаем все дни месяца
        const weeks = this.getWeeksInMonth(this.selectedDate);
        
        weeks.forEach(week => {
            const weekRow = document.createElement('div');
            weekRow.className = 'week-row';
            weekRow.addEventListener('click', () => this.selectWeekFromFull(week));
            week.forEach(date => {
                const isOtherMonth = date.getMonth() !== this.selectedDate.getMonth()
                const dayButton = this.createDayButton(date, isOtherMonth)
                

                // dayButton.addEventListener('click', () => this.selectWeekFromFull(date, week));
                weekRow.appendChild(dayButton)
            })
            monthContainer.appendChild(weekRow);
        });
        this.setupSwipeEvents(monthContainer);
        // Добавляем область для свайпа
        // const swipeArea = document.createElement('div');
        // swipeArea.className = 'swipe-area';
        // this.setupSwipeEvents(swipeArea);

        // Добавляем индикатор загрузки
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';

        fullDaysContainer.appendChild(monthContainer);
        // fullDaysContainer.appendChild(swipeArea);
        fullDaysContainer.appendChild(loadingIndicator);

        // Добавляем все элементы в контейнер
        this.container.appendChild(header);
        this.container.appendChild(weekDays);
        this.container.appendChild(fullDaysContainer);

        // Добавляем анимацию появления
        //                this.container.classList.add('slide-in');
        getMonthEventedDays(getLocalDate(this.selectedDate), (data) => {
            let eventedDays = []
            for (let i = 0; i < data["dates"].length; i++) {
                eventedDays.push(new Date(data["dates"][i]))
            }
            weeks.forEach(week => {
                week.forEach(date => {
                    
                    let dayButton = this.container.querySelector(`#day-button-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`)
                    
                    if (eventedDays.map(d => d.toISOString()).includes(date.toISOString())) {
                        dayButton.classList.add("evented")
                    }
                    // dayButton.addEventListener('click', () => this.selectWeekFromFull(date, week));
                    
                })
            })

        })
    }

    // Настройка обработчиков свайпа
    setupSwipeEvents(element) {

        element.addEventListener('touchstart', (e) => {
            // console.log(12)
            this.touchStartX = e.changedTouches[0].screenX;
            this.touchStartY = e.changedTouches[0].screenY;
        }, false);

        element.addEventListener('touchend', (e) => {
            // if (this.isAnimating) return;

            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;

            const diffX = touchEndX - this.touchStartX;
            const diffY = touchEndY - this.touchStartY;

            // Проверяем, является ли жест primarily горизонтальным

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > this.swipeThreshold) {

                if (diffX > 0) {

                    this.swipeToPreviousMonth();
                } else {
                    this.swipeToNextMonth();
                }
            }
        }, false);
    }

    // Переход к следующему месяцу по свайпу
    swipeToNextMonth() {
        // if (this.isAnimating) return;
        this.isAnimating = true;

        const fullDaysContainer = this.container.querySelector('.full-days');
        const monthContainer = this.container.querySelector('.month-container');
        const loadingIndicator = this.container.querySelector('.loading-indicator');

        // Показываем индикатор загрузки
        loadingIndicator.style.display = 'block';

        // Анимация исчезновения текущего месяца
        //                monthContainer.classList.add('month-slide-prev');-->

        setTimeout(() => {
            // Меняем месяц
            this.selectedDate.setMonth(this.selectedDate.getMonth() + 1);

            // Обновляем заголовок
            this.container.querySelector('.current-month').textContent = this.getMonthYearText(this.selectedDate);

            // Перерисовываем дни месяца
            const weeks = this.getWeeksInMonth(this.selectedDate);
            monthContainer.innerHTML = '';

            weeks.forEach(week => {
                const weekRow = document.createElement('div');
                weekRow.className = 'week-row';

                week.forEach(date => {
                    const isOtherMonth = date.getMonth() !== this.selectedDate.getMonth();
                    const dayButton = this.createDayButton(date, isOtherMonth);
                    dayButton.addEventListener('click', () => this.selectWeekFromFull(week));
                    weekRow.appendChild(dayButton);
                });

                monthContainer.appendChild(weekRow);
            });

            // Анимация появления нового месяца
            //                    monthContainer.classList.remove('month-slide-prev');-->
            //                    monthContainer.classList.add('month-slide-next');-->

            // Скрываем индикатор загрузки
            loadingIndicator.style.display = 'none';

            //                    setTimeout(() => {-->
            //&lt;!&ndash;                        monthContainer.classList.remove('month-slide-next');&ndash;&gt;-->
            //                        this.isAnimating = false;-->
            //                    }, 300);-->
        }, 1);
    }

    // Переход к предыдущему месяцу по свайпу
    swipeToPreviousMonth() {
        // console.log(this.isAnimating)
        // if (this.isAnimating) return;
        this.isAnimating = true;

        const fullDaysContainer = this.container.querySelector('.full-days');
        const monthContainer = this.container.querySelector('.month-container');
        const loadingIndicator = this.container.querySelector('.loading-indicator');

        // Показываем индикатор загрузки
        loadingIndicator.style.display = 'block';

        // Анимация исчезновения текущего месяца
        //                monthContainer.classList.add('month-slide-next');-->

        setTimeout(() => {
            // Меняем месяц
            this.selectedDate.setMonth(this.selectedDate.getMonth() - 1);

            // Обновляем заголовок
            this.container.querySelector('.current-month').textContent = this.getMonthYearText(this.selectedDate);

            // Перерисовываем дни месяца
            const weeks = this.getWeeksInMonth(this.selectedDate);
            monthContainer.innerHTML = '';

            weeks.forEach(week => {
                const weekRow = document.createElement('div');
                weekRow.className = 'week-row';

                week.forEach(date => {
                    const isOtherMonth = date.getMonth() !== this.selectedDate.getMonth();
                    const dayButton = this.createDayButton(date, isOtherMonth);
                    dayButton.addEventListener('click', () => this.selectWeekFromFull(date, week));
                    weekRow.appendChild(dayButton);
                });

                monthContainer.appendChild(weekRow);
            });

            // Анимация появления нового месяца
            //                    monthContainer.classList.remove('month-slide-next');-->
            //                    monthContainer.classList.add('month-slide-prev');-->

            // Скрываем индикатор загрузки
            loadingIndicator.style.display = 'none';

            setTimeout(() => {
                //                        monthContainer.classList.remove('month-slide-prev');-->
                this.isAnimating = false;
            }, 1);
        }, 1);
    }

    // Переключение между треем и развернутым видом
    toggleView() {
        // if (this.isAnimating) return;

        //                this.container.classList.remove('slide-in');-->
        //                this.container.classList.add('slide-out');-->

        setTimeout(() => {

            if (this.isExpanded) {
                this.renderTrayView();
                // this.height = "unset"
                if (this.onCloseTray != null) {
                    this.onCloseTray();
                }
                
            } else {
                this.renderFullView();
                // this.height = "100%"
                if (this.onOpenTray != null) {
                    this.onOpenTray();
                }
                
            }
        }, 1);
    }

    // // Обработка выбора дня в трее
    // selectFromTray(date) {
    //     this.selectedDate = date;
    //     this.selectedDate = new Date(date);
        
    //     // this.container.querySelector('.current-month').textContent = this.getMonthYearText(this.selectedDate);
    //     if (this.onSelectWeekFromTray && typeof this.onSelectWeekFromTray === 'function') {
    //         this.onSelectWeekFromTray(date);
    //     }

    //     this.renderTrayView();
    // }

    // Обработка выбора дня в развернутом виде
    selectWeekFromFull(week) {
       

        
        this.selectedDate = new Date(week[0]);
        
        if (this.onSelectWeekFromFull && typeof this.onSelectWeekFromFull === 'function') {
            this.onSelectWeekFromFull(week[0], week);
        }

        
        this.toggleView();
    }

    // Вспомогательные методы
    getMonthYearText(date) {
        const months = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    getWeekDates(date) {
        const currentDate = new Date(date);
        const dayOfWeek = currentDate.getDay();
        const startDate = new Date(currentDate);
        
        // Исправленный расчет понедельника
        if (dayOfWeek === 0) {
            // Если воскресенье, отнимаем 6 дней чтобы получить понедельник
            startDate.setDate(currentDate.getDate() - 6);
        } else {
            // Для остальных дней отнимаем (dayOfWeek - 1) дней
            startDate.setDate(currentDate.getDate() - (dayOfWeek - 1));
        }

        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const weekDate = new Date(startDate);
            weekDate.setDate(startDate.getDate() + i);
            weekDates.push(weekDate);
        }

        return weekDates;
    }
    getWeeksInMonth(date) {
        // Создаем даты с нулевым временем (00:00:00)
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        // Нормализуем время до 00:00:00 для всех дат
        firstDay.setHours(0, 0, 0, 0);
        lastDay.setHours(0, 0, 0, 0);
        
        const weeks = [];
        let currentDate = new Date(firstDay);
        currentDate.setHours(0, 0, 0, 0); // Нормализуем текущую дату
        
        // Переходим к понедельнику предыдущей недели, если первый день месяца не понедельник
        const dayOfWeek = currentDate.getDay();
        const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        currentDate.setDate(currentDate.getDate() + daysToMonday);
        
        while (currentDate <= lastDay || weeks.length < 6) {
            let week = [];
            for (let i = 0; i < 7; i++) {
                // Создаем новую дату с нулевым временем
                const dayDate = new Date(currentDate);
                dayDate.setHours(0, 0, 0, 0);
                week.push(dayDate);
                currentDate.setDate(currentDate.getDate() + 1);
            }
            weeks.push(week);
            
            // Прерываем цикл, если вышли за пределы следующего месяца
            if (currentDate.getMonth() > date.getMonth() && currentDate.getFullYear() >= date.getFullYear()) {
                break;
            }
        }
        
        return weeks;
    }

    isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    }

    isSameDate(date1, date2) {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    }

    // Методы показа/скрытия календаря
    show() {
        if (this.container) {
            this.container.style.display = 'flex';
            this.container.classList.add('fade-in');
        }
    }

    hide() {
        if (this.container) {
            this.container.classList.add('fade-out');
            setTimeout(() => {
                this.container.style.display = 'none';
                this.container.classList.remove('fade-out');
            }, 1);
        }
    }
}