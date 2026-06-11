import { setExtentoinalButtonEvents, get_cookie, calculate_menstruation_column_color, create_gradient, getLocalDate, swich_to_page, getElementFullSize, getElementMarginsSize } from "../utils.js"

import { showBackButton, hideBackButton, addBackButtonPressEvent } from "..//telegram.js"
import { BasePage } from "./base_page.js"
import { BottmMenuDialog } from "../dialogs/bottom_menu_dialog.js"

import { menstruationStarted, menstruationDelay, getMenstruationDays, getCurrentDay, getUserType } from "../api.js"
export class MainPage extends BasePage {
    constructor() {
        super()
        this.page = document.getElementById("main_page");
        this.page_name = "main_page"
        this.animate_object = this.page.getElementsByClassName("content")[0];
        this.create_view_callback(this)
        this.linear_gradient_length = 100
        this.linear_gradient = create_gradient([214, 207, 211], [255, 171, 212], this.linear_gradient_length)
        this.buttom_menu_dialog = new BottmMenuDialog()
        const open_bottom_menu_button = document.getElementById("open_bottom_menu_button")
        open_bottom_menu_button.onclick = () => {
            this.buttom_menu_dialog.show()
        }
        //console.log(user_lang);

    }
    on_open() {

        this.init_all_texts()
        // $("#ghgg").datepicker({autoSize: true});
        // flatpickr("#ghgg", {});
        
        const start_menstruation_date_dialog = document.getElementById("start_menstruation_date_dialog")
        const menstruation_dialog_button = start_menstruation_date_dialog.getElementsByClassName("button-submit")[0]


        const menstruation_date_input = document.getElementById("start_menstruation_dialog_date_input")
        const menstruation_start_button = document.getElementById("main_page_menstruation_start_button")
        const menstruation_delay_button = document.getElementById("main_page_menstruation_delay_button")
        const dialog_bottom_menu = document.getElementById("dialog_bottom_menu")
        const open_bottom_menu_btn = document.getElementById("openBottomMenuBtn")
        const content_buttons = document.getElementById("main_page_content_buttons")
        const main_page_user_tips_list = document.getElementById("main_page_user_tips_list")


        
        // const calendar_container  = this.page.querySelector("#calendar-container")
        this.tips = null
        this.load_data_from_api_status = 0
        let min_date = new Date();
        min_date.setDate(min_date.getDate() - 50)
        menstruation_date_input.min = getLocalDate(min_date)
        menstruation_date_input.max = getLocalDate()
        // add_user_event_dialog_date.max = getTodayLocalDate()


        // const calendar = new Calendar(calendar_container)

        // new Pikaday({ field: menstruation_date_input });
        // flatpickr("#start_menstruation_dialog_date_input", {
        //     dateFormat: "Y-m-d",
        //     appendTo: start_menstruation_date_dialog,
        //     minDate: new Date().fp_incr(-50),
        //     static: "true",
        //     disableMobile: "false",
        //     maxDate: "today",
        //     locale: user_lang
        // });
        this.user_type = null
        getUserType((data) => {
            this.user_type = data["user_type"]
            if (this.user_type == 0) { // User
                // Обработка кнопок
                getCurrentDay(data => {
                    const [, probability] = data.current_day_data;
                    menstruation_delay_button.style.display = probability >= 0.60 ? "flex" : "none";
                    menstruation_start_button.style.display = probability >= 0.60 ? "none" : "flex";
                    // this.load_data_from_api_status += 1
                    // this.on_load_data_from_api()
                });
            } else if (this.user_type == 1) {
                content_buttons.style.justifyContent = "flex-end";
                // this.load_data_from_api_status += 1
                // this.on_load_data_from_api()
            }

        }, () => {

        })



        menstruation_date_input.oninput = () => {

            if (menstruation_date_input.value == "" || menstruation_date_input.value > menstruation_date_input.max) {
                menstruation_dialog_button.disabled = true;
            } else {

                menstruation_dialog_button.disabled = false;


            }

        }
        menstruation_dialog_button.onclick = () => {
            start_menstruation_date_dialog.close()
            menstruation_start_button.disabled = true
            let parsedDate = new Date(menstruation_date_input.value)
            menstruationStarted(parsedDate.toISOString(), () => {
                this.update_content();

                const delta_minutes = 5
                const now = new Date()
                now.setMinutes(now.getMinutes() + delta_minutes)

                document.cookie = `MenstruationDelayClick=true;expires=${now.toUTCString()}`
                menstruation_delay_button.disabled = true
                menstruation_start_button.disabled = false
                this.hide_menstruation_start_button()
                

            })
        }
        setExtentoinalButtonEvents(menstruation_start_button, () => { //onclick

            let parsedDate = new Date(getLocalDate())
            menstruationStarted(parsedDate.toISOString(), () => {
                this.update_content();

                const delta_minutes = 5
                const now = new Date()
                now.setMinutes(now.getMinutes() + delta_minutes)

                document.cookie = `MenstruationDelayClick=true;expires=${now.toUTCString()}`
                menstruation_delay_button.disabled = true
                menstruation_start_button.disabled = false
                this.hide_menstruation_start_button()

            })
        }, () => { // onlongclick

            start_menstruation_date_dialog.showModal()


        })

        menstruation_delay_button.onclick = () => {
            menstruation_delay_button.disabled = true
            menstruationDelay(() => {
                this.update_content()

                if (get_cookie("MenstruationDelayClick") != "true") {
                    const delta_minutes = 5
                    const now = new Date()
                    now.setMinutes(now.getMinutes() + delta_minutes)

                    document.cookie = `MenstruationDelayClick=true;expires=${now.toUTCString()}`
                    menstruation_delay_button.disabled = true
                    this.show_menstruation_start_button()

                }
            })


        }

        this.update_content()

    }

    update_content() {

        getMenstruationDays((data) => {
            let diagram_list = document.getElementById("diagram_list");
            while (diagram_list.firstChild) {
                diagram_list.removeChild(diagram_list.lastChild);
            }
            const daysList = data.days_list;
            const diagramList = document.getElementById("diagram_list");

            // Функция для получения правильной формы слова "день"
            const getDayWordForm = (days) => {
                const lastDigit = days % 10;
                const lastTwoDigits = days % 100;

                if (lastDigit === 1 && lastTwoDigits !== 11) return "день";
                if (lastDigit >= 2 && lastDigit <= 4 && !(lastTwoDigits >= 12 && lastTwoDigits <= 14))
                    return "дня";
                return "дней";
            };
            const diagram_list_height = getElementFullSize(diagram_list).height - getElementMarginsSize(diagram_list).y
 
            // Обработка дней для диаграммы
            daysList.forEach(day => {
                const [dateStr, formattedDay, probabilityStr] = day;

                const date = new Date(Date.parse(dateStr));
                console.log(dateStr, date)
                date.setHours(0, 0, 0, 0);

                const probability = parseFloat(probabilityStr);
                const percent = Math.round(probability * 100);
                
                let column_width = "65%"
                let font_weight = "normal"
                const bgColor = calculate_menstruation_column_color(probability, this.linear_gradient, this.linear_gradient_length)
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const isToday = date.getTime() === today.getTime(); //TODO: проверить это на правильность!!!
                
                const border_radius = 4
                const borderStyle = isToday ? `${border_radius}px solid rgba(161, 255, 163, .7)` : "";

                const listItem = document.createElement('li');
                listItem.className = "list-item";
                if (isToday) {
                    font_weight = "bold"
                }
                const item_probability = document.createElement("p")
                item_probability.className = "item-probability"
                item_probability.innerText = `${percent}%`
                const item_date = document.createElement("p")
                item_date.className = "item-date"
                item_date.style = `font-weight: ${font_weight};`
                item_date.innerText = `${formattedDay}`
                listItem.appendChild(item_probability)
                listItem.appendChild(item_date)
                diagram_list.appendChild(listItem)
                const item_probability_height = getElementFullSize(item_probability).height
                const item_date_height = getElementFullSize(item_date).height 
                
                let column_height = parseInt(probability * (diagram_list_height - item_probability_height - item_date_height))
             
                //console.log(diagram_list_height, probability * (diagram_list_height / 2))
                if (isToday) {
                    column_height = parseInt(probability * (diagram_list_height - item_probability_height - item_date_height) - border_radius * 2)
                    column_width = `calc(65% - ${border_radius * 2}px)`
                }
                const item_column = document.createElement("div")
                item_column.className = "item-column"
                item_column.style = `height: ${column_height}px; 
                                width: ${column_width};
                                background-color: rgb(${bgColor});
                                border: ${borderStyle};`
                
                
                
                listItem.insertBefore(item_column, item_date);
                
            });

            // Обработка статуса менструации
            const diagramStatus = document.getElementById("diagram_menstruation_status");
            const daysBeforeStart = data.days_before_start;
            const daysBeforeStop = data.days_before_stop;
            let dynamic_content = TEXTS["pages"]["main_page"]["dynamic_content"]
            if (daysBeforeStart < 1) {
                // Статус окончания
                if (daysBeforeStop === 1) {
                    diagramStatus.textContent = dynamic_content["bottom_text_var4"] //"Месячные скорее всего закончатся завтра";
                } else if (daysBeforeStop === 2) {
                    diagramStatus.textContent = dynamic_content["bottom_text_var5"] //"Месячные скорее всего закончатся послезавтра";
                } else {
                    diagramStatus.textContent = `${dynamic_content["bottom_text_var6"]} ${daysBeforeStop} ${getDayWordForm(daysBeforeStop)}` //`Месячные скорее всего закончатся через ${daysBeforeStop} ${getDayWordForm(daysBeforeStop)}`;
                }
            } else {
                // Статус начала
                if (daysBeforeStart === 1) {
                    diagramStatus.textContent = dynamic_content["bottom_text_var2"] //"Месячные скорее всего начнутся завтра";
                } else if (daysBeforeStart === 2) {
                    diagramStatus.textContent = dynamic_content["bottom_text_var3"] //"Месячные скорее всего начнутся послезавтра";
                } else {
                    diagramStatus.textContent = `${dynamic_content["bottom_text_var1"]} ${daysBeforeStart} ${getDayWordForm(daysBeforeStart)}`//`Месячные скорее всего начнутся через ${daysBeforeStart} ${getDayWordForm(daysBeforeStart)}`;
                }
            }
            this.load_tips()
            // this.load_data_from_api_status += 1
            // this.on_load_data_from_api()
        })

    }
    show_menstruation_start_button(state) {
        const menstruation_start_button = document.getElementById("main_page_menstruation_start_button")
        const menstruation_delay_button = document.getElementById("main_page_menstruation_delay_button")
        if (state == 0) {
            menstruation_delay_button.style.display = "none";
            menstruation_start_button.style.display = "flex";
        } else {
            
        }

    }
    hide_menstruation_start_button(state) {
        const menstruation_start_button = document.getElementById("main_page_menstruation_start_button")
        const menstruation_delay_button = document.getElementById("main_page_menstruation_delay_button")
        if (state == 0) {
            menstruation_delay_button.style.display = "flex";
            menstruation_start_button.style.display = "none";
        } else {
            
        }

    }
    on_load_data_from_api() {
        
        if (this.load_data_from_api_status >= 2) {
            this.load_tips()
        }
    }
    load_tips() {
        const main_page_user_tips_list = document.getElementById("main_page_user_tips_list")
        // let cheight = parseInt(document.body.getBoundingClientRect().height - parseInt(document.getElementById("content_header").getBoundingClientRect().height + document.getElementById("main_page_content_buttons").getBoundingClientRect().height))

        // const calendar = new Calendary();
        // calendar.height = "unset"
        // calendar.insertTo('.calendar-block', '100%', `100%`);
        const page_content = this.page.querySelector(".content")
        
        let theight = getElementFullSize(this.page).height - getElementFullSize(page_content.querySelector(".content-header")).height - getElementFullSize(page_content.querySelector(".content-footer")).height - getElementMarginsSize(main_page_user_tips_list).y

        // // Устанавливаем колбэки
        // calendar.onSelectDayFromTray = (date) => {
        //     console.log('Выбран день из трея:', date.toLocaleDateString());
        // };

        // calendar.onSelectDayFromFull = (date, week) => {
        //     console.log('Выбран день из развернутого вида:', date.toLocaleDateString());
        //     console.log('Неделя:', week.map(d => d.toLocaleDateString()));
        // };
        // calendar.onOpenTray = () => {
        //     main_page_user_tips_list.style.display = "none"
        //     calendar.height = `${cheight}px`
        //     tips_list.style.height = `0px`
        // }
        // calendar.onCloseTray = () => {
        //     main_page_user_tips_list.style.display = "block"

        //     tips_list.style.height = `${theight}px`
        //     calendar.height = `unset`
        // }
        // Вставляем календарь в контейнер

        const tips_list = document.querySelector(".tips-list")


        tips_list.style.height = `${theight}px`
        // getUserTips((data) => {
        //     this.tips = data["tips"]
            
        //     while (main_page_user_tips_list.firstChild) {
        //         main_page_user_tips_list.removeChild(main_page_user_tips_list.lastChild);
        //     }
        //     this.tips.forEach((event) => {

        //         let event_block = document.createElement("li")

        //         event_block.className = "tips-list-item"
        //         event_block.style.height = `${theight - 45}px`
        //         event_block.id = `tips_list_item_${event.id}`

        //         event_block.innerHTML = `
        //             <div class="item-block">
        //                 <div>
        //                     <p class="item-title">${event.title}</p>
        //                     <p class="item-text">${event.date_text}</p>
        //                 </div>
        //                 <div id="tips_list_item_buttons_${event.id}" style="visibility: hidden">
        //                     <a href="#" data-action="edit" data-event_id=${event.id} style="margin-right: 10px">

        //                             <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        //                                 <g clip-path="url(#clip0_2001_170)">
        //                                     <path d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
        //                                         fill="#D9D9D9"/>
        //                                     <path d="M7.7447 13.9569L14.581 6.43657C14.8511 6.15227 15.2117 5.9956 15.5855 6.00009C15.9593 6.00459 16.3166 6.16989 16.581 6.46061C16.8453 6.75133 16.9957 7.14435 16.9999 7.55552C17.0041 7.96669 16.8618 8.36332 16.6034 8.66048L9.76593 16.1809C9.60995 16.3524 9.41129 16.4694 9.19498 16.517L7 17L7.43911 14.585C7.48237 14.347 7.5887 14.1285 7.7447 13.9569Z"
        //                                         stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
        //                                     <path d="M13.459 8.0625L15.209 9.9375" stroke="black"/>
        //                                 </g>
        //                                 <defs>
        //                                     <clipPath id="clip0_2001_170">
        //                                         <rect width="24" height="24" fill="white"/>
        //                                     </clipPath>
        //                                 </defs>
        //                             </svg>


        //                     </a>

        //                     <a href="#" data-action="delete" data-event_id=${event.id}>
        //                         <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        //                             <g clip-path="url(#clip0_2001_128)">
        //                                 <path d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
        //                                     fill="#D9D9D9"/>
        //                                 <path d="M9.8125 9.8125C9.92853 9.8125 10.0398 9.85859 10.1219 9.94064C10.2039 10.0227 10.25 10.134 10.25 10.25V15.5C10.25 15.616 10.2039 15.7273 10.1219 15.8094C10.0398 15.8914 9.92853 15.9375 9.8125 15.9375C9.69647 15.9375 9.58519 15.8914 9.50314 15.8094C9.42109 15.7273 9.375 15.616 9.375 15.5V10.25C9.375 10.134 9.42109 10.0227 9.50314 9.94064C9.58519 9.85859 9.69647 9.8125 9.8125 9.8125ZM12 9.8125C12.116 9.8125 12.2273 9.85859 12.3094 9.94064C12.3914 10.0227 12.4375 10.134 12.4375 10.25V15.5C12.4375 15.616 12.3914 15.7273 12.3094 15.8094C12.2273 15.8914 12.116 15.9375 12 15.9375C11.884 15.9375 11.7727 15.8914 11.6906 15.8094C11.6086 15.7273 11.5625 15.616 11.5625 15.5V10.25C11.5625 10.134 11.6086 10.0227 11.6906 9.94064C11.7727 9.85859 11.884 9.8125 12 9.8125ZM14.625 10.25C14.625 10.134 14.5789 10.0227 14.4969 9.94064C14.4148 9.85859 14.3035 9.8125 14.1875 9.8125C14.0715 9.8125 13.9602 9.85859 13.8781 9.94064C13.7961 10.0227 13.75 10.134 13.75 10.25V15.5C13.75 15.616 13.7961 15.7273 13.8781 15.8094C13.9602 15.8914 14.0715 15.9375 14.1875 15.9375C14.3035 15.9375 14.4148 15.8914 14.4969 15.8094C14.5789 15.7273 14.625 15.616 14.625 15.5V10.25Z"
        //                                     fill="black"/>
        //                                 <path d="M17.6875 7.625C17.6875 7.85706 17.5953 8.07962 17.4312 8.24372C17.2671 8.40781 17.0446 8.5 16.8125 8.5H16.375V16.375C16.375 16.8391 16.1906 17.2842 15.8624 17.6124C15.5342 17.9406 15.0891 18.125 14.625 18.125H9.375C8.91087 18.125 8.46575 17.9406 8.13756 17.6124C7.80937 17.2842 7.625 16.8391 7.625 16.375V8.5H7.1875C6.95544 8.5 6.73288 8.40781 6.56878 8.24372C6.40469 8.07962 6.3125 7.85706 6.3125 7.625V6.75C6.3125 6.51794 6.40469 6.29538 6.56878 6.13128C6.73288 5.96719 6.95544 5.875 7.1875 5.875H10.25C10.25 5.64294 10.3422 5.42038 10.5063 5.25628C10.6704 5.09219 10.8929 5 11.125 5H12.875C13.1071 5 13.3296 5.09219 13.4937 5.25628C13.6578 5.42038 13.75 5.64294 13.75 5.875H16.8125C17.0446 5.875 17.2671 5.96719 17.4312 6.13128C17.5953 6.29538 17.6875 6.51794 17.6875 6.75V7.625ZM8.60325 8.5L8.5 8.55163V16.375C8.5 16.6071 8.59219 16.8296 8.75628 16.9937C8.92038 17.1578 9.14294 17.25 9.375 17.25H14.625C14.8571 17.25 15.0796 17.1578 15.2437 16.9937C15.4078 16.8296 15.5 16.6071 15.5 16.375V8.55163L15.3967 8.5H8.60325ZM7.1875 7.625H16.8125V6.75H7.1875V7.625Z"
        //                                     fill="black"/>
        //                             </g>
        //                             <defs>
        //                                 <clipPath id="clip0_2001_128">
        //                                     <rect width="24" height="24" fill="white"/>
        //                                 </clipPath>
        //                             </defs>
        //                         </svg>
        //                     </a>
        //                 </div>
        //             </div>
        //         `
        //         main_page_user_tips_list.appendChild(event_block)

        //     })

        // }, () => { })
    }
    // init_all_texts() {
    //     const all_page_texts = TEXTS["pages"]["main_page"]
    //     const all_page_buttons_texts = TEXTS["pages"]["main_page"]["buttons"]
    //     const all_page_dialogs_texts = TEXTS["pages"]["main_page"]["dialogs"]
    //     // Texts

    //     document.getElementById("diagram-title").innerText = all_page_texts["top_text"]
    //     document.getElementById("start_menstruation_date_dialog_top_title").innerText = all_page_dialogs_texts["start_menstruation_dialog"]["title"]
    //     // Buttons
    //     document.getElementById("delayBtn").innerText = all_page_buttons_texts["menstruation_delay"]
    //     document.getElementById("menstruationStartBtn").innerText = all_page_buttons_texts["menstruation_start"]
    //     document.getElementById("main_page_tips_title").innerHTML = all_page_texts["tips_title"]

    //     // Array.prototype.forEach.call(this.page.getElementsByClassName("buttons-submit"), (el) => {
    //     //     el.innerHTML = all_page_buttons_texts["submit"]
    //     // })
    //     // Array.prototype.forEach.call(this.page.getElementsByClassName("buttons-cancel"), (el) => {
    //     //     el.innerHTML = all_page_buttons_texts["cancel"]
    //     // })
    // }
}