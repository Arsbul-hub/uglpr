import { swich_to_page, temp_buffer, removeAllChildren, getElementFullSize, setExtentoinalButtonEvents, getElementMarginsSize, calculateFontSizeByWords, getLocalDate, hide_element } from "../utils.js"
import { set_last_menstruation_date_page, have_code_page } from "../pages.js"
import { EventedDay, EventsType, User } from "../structures.js"
import { BasePage } from "./base_page.js"
import { showBackButton, hideBackButton, addBackButtonPressEvent } from "../telegram.js"
import { getEventedDays } from "../api.js"
import { Calendary } from "../modules/calendar.js"
import { ManageEventsDialog } from "../dialogs/manage_events_dialog.js"
import { EditEventsDialog } from "../dialogs/edit_events_dialog.js"
export class EventsPage extends BasePage {
    constructor() {
        super()
        this.page = document.getElementById("events_page");

        this.page_name = "events_page"
        this.animate_object = this.page.querySelector(".content");

        this.create_view_callback(this)
        this.events_page_user_events_cards_list = document.getElementById("events_page_user_events_cards_list")
        this.calendar = new Calendary();
        this.calendar.height = "unset"
        this.calendar.insertTo('.calendar-block', '100%', `100%`);
        this.currentSelectWeekday = this.calendar.currentDate
        let theight = 100 //parseInt(this.page.getBoundingClientRect().height - parseInt(document.getElementById("content_header").getBoundingClientRect().height ))
        this.cheight = 0
        this.manage_events_dialog = new ManageEventsDialog(() => { this.load_events_cards_list() })
        this.events_page_manage_events_button = document.getElementById("events_page_manage_events_button")

        // Устанавливаем колбэки
        // this.calendar.onSelectDayFromTray = (date) => {

        //     if (this.currentSelectWeekday != date) {
        //         this.currentSelectWeekday = date

        //         this.load_events_cards_list()
        //     }
        // };
        this.events_data_list = {}
        this.calendar.onSelectWeekFromFull = (date, week) => {

            if (this.currentSelectWeekday != date) {
                this.currentSelectWeekday = date
                this.load_events_cards_list()
            }
        };
        this.calendar.onOpenTray = () => {

            // this.events_page_user_events_cards_list.style.display = "none"
            // this.calendar.height = `${theight}%`

            let temp_cheight = getElementFullSize(this.page).height - (getElementFullSize(this.page.querySelector(".content").querySelector(".content-header")).height - this.cheight) //getElementFullSize(this.events_page_user_events_cards_list).height) - getElementMarginsSize(this.events_page_user_events_cards_list).y


            this.events_page_user_events_cards_list.style.height = `${temp_cheight}px`
        }
        this.calendar.onCloseTray = () => {
            // this.events_page_user_events_cards_list.style.display = "block"

            this.events_page_user_events_cards_list.style.height = `${this.cheight}px`
            // this.calendar.height = `unset`
        }
        this.events_page_user_events_cards_list.onclick = (e) => {

            if (e.target.closest('a[data-action="edit"]')) {

                if (e.target.closest('a[data-action="edit"]')) {
                    const link = e.target.closest('a[data-action="edit"]');
                    const eventId = link.dataset.event_id;
                    edit_user_event_dialog.showModal()
                }
            }
            else if (e.target.closest('a[data-action="delete"]')) {
                const link = e.target.closest('a[data-action="delete"]');
                const eventId = link.dataset.event_id;

                delete_user_event_dialog.showModal()

            }
        }
        this.events_page_manage_events_button.onclick = () => {
            this.manage_events_dialog.show()
        }

    }
    on_open() {
        this.init_all_texts()
        this.calendar.render()
        if (temp_buffer.get("user").is_partner) {
            hide_element(this.events_page_manage_events_button)
        }

        
        if (!this.events_page_user_events_cards_list.style.height) {

            this.cheight = getElementFullSize(this.page).height - getElementFullSize(this.page.querySelector(".content").querySelector(".content-header")).height

            this.events_page_user_events_cards_list.style.height = `${this.cheight}px`
        }

        // this.page.addEventListener("DOMContentLoaded", () => {console.log("Loaded")});
        events_page_options_back_user_event_button.onclick = () => {
            this.events.forEach((event) => {
                let event_item = document.getElementById(`events_list_item_buttons_${event["id"]}`)
                event_item.style.visibility = "hidden"
            })
            events_page_options_back_user_event_button.style.display = "none"
            events_page_options_user_event_button.style.display = "block"
        }
        events_page_options_user_event_button.onclick = () => {

            this.events.forEach((event) => {
                let event_item = document.getElementById(`events_list_item_buttons_${event["id"]}`)
                event_item.style.visibility = "visible"
            })
            events_page_options_user_event_button.style.display = "none"
            events_page_options_back_user_event_button.style.display = "block"

        }

        // open_bottom_menu_btn.onclick = () => {
        //     dialog_bottom_menu.showModal()
        // }
        // add_user_event_dialog_title.oninput = () => {

        //     if (add_user_event_dialog_title.value == "" || add_user_event_dialog_date.value == "") {
        //         add_user_event_dialog_button.disabled = true;
        //     } else {

        //         add_user_event_dialog_button.disabled = false;


        //     }

        // }




        this.load_events_cards_list()
    }

    load_events_cards_list() {

        removeAllChildren(this.events_page_user_events_cards_list);

        getEventedDays(getLocalDate(this.calendar.selectedDate), (data) => {

            this.events = data["events"]

            while (this.events_page_user_events_cards_list.firstChild) {
                this.events_page_user_events_cards_list.removeChild(this.events_page_user_events_cards_list.lastChild);
            }

            this.events.forEach(event => {

                const evented_day = new EventedDay(event.id, new Date(event.date))
                let event_block = document.createElement("li")

                event_block.className = "events-cards-list-card"

                event_block.id = `events_list_card_${event.id}`

                let item_icons = document.createElement("div")
                item_icons.className = "card-icons"
                event.events_types.forEach(events_type => {
                    const events_type_obj = new EventsType(events_type.id, events_type.icon_path, events_type.description)
                    let icon = events_type.icon_path
                    let icon_block = document.createElement("img")
                    icon_block.className = "icon-block"
                    icon_block.src = icon
                    item_icons.appendChild(icon_block)
                    evented_day.add_event_type(events_type_obj)

                })
                setExtentoinalButtonEvents(event_block, () => { }, () => {
                    const edit_events_dialog = new EditEventsDialog(evented_day, () => { this.load_events_cards_list() })
                    edit_events_dialog.show()
                })
                event_block.innerHTML = `
                    <div class="card-block">
                        <div class="card-top">
                            <p class="card-date">${event.date_text}</p>
                            <div id="events_cards_list_card_buttons_${event.id}" style="visibility: hidden">
                                <a href="#" data-action="edit" data-event_id=${event.id} style="margin-right: 10px">

                                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_2001_170)">
                                                <path d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
                                                    fill="#D9D9D9"/>
                                                <path d="M7.7447 13.9569L14.581 6.43657C14.8511 6.15227 15.2117 5.9956 15.5855 6.00009C15.9593 6.00459 16.3166 6.16989 16.581 6.46061C16.8453 6.75133 16.9957 7.14435 16.9999 7.55552C17.0041 7.96669 16.8618 8.36332 16.6034 8.66048L9.76593 16.1809C9.60995 16.3524 9.41129 16.4694 9.19498 16.517L7 17L7.43911 14.585C7.48237 14.347 7.5887 14.1285 7.7447 13.9569Z"
                                                    stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M13.459 8.0625L15.209 9.9375" stroke="black"/>
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_2001_170">
                                                    <rect width="24" height="24" fill="white"/>
                                                </clipPath>
                                            </defs>
                                        </svg>


                                </a>

                                <a href="#" data-action="delete" data-event_id=${event.id}>
                                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_2001_128)">
                                            <path d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
                                                fill="#D9D9D9"/>
                                            <path d="M9.8125 9.8125C9.92853 9.8125 10.0398 9.85859 10.1219 9.94064C10.2039 10.0227 10.25 10.134 10.25 10.25V15.5C10.25 15.616 10.2039 15.7273 10.1219 15.8094C10.0398 15.8914 9.92853 15.9375 9.8125 15.9375C9.69647 15.9375 9.58519 15.8914 9.50314 15.8094C9.42109 15.7273 9.375 15.616 9.375 15.5V10.25C9.375 10.134 9.42109 10.0227 9.50314 9.94064C9.58519 9.85859 9.69647 9.8125 9.8125 9.8125ZM12 9.8125C12.116 9.8125 12.2273 9.85859 12.3094 9.94064C12.3914 10.0227 12.4375 10.134 12.4375 10.25V15.5C12.4375 15.616 12.3914 15.7273 12.3094 15.8094C12.2273 15.8914 12.116 15.9375 12 15.9375C11.884 15.9375 11.7727 15.8914 11.6906 15.8094C11.6086 15.7273 11.5625 15.616 11.5625 15.5V10.25C11.5625 10.134 11.6086 10.0227 11.6906 9.94064C11.7727 9.85859 11.884 9.8125 12 9.8125ZM14.625 10.25C14.625 10.134 14.5789 10.0227 14.4969 9.94064C14.4148 9.85859 14.3035 9.8125 14.1875 9.8125C14.0715 9.8125 13.9602 9.85859 13.8781 9.94064C13.7961 10.0227 13.75 10.134 13.75 10.25V15.5C13.75 15.616 13.7961 15.7273 13.8781 15.8094C13.9602 15.8914 14.0715 15.9375 14.1875 15.9375C14.3035 15.9375 14.4148 15.8914 14.4969 15.8094C14.5789 15.7273 14.625 15.616 14.625 15.5V10.25Z"
                                                fill="black"/>
                                            <path d="M17.6875 7.625C17.6875 7.85706 17.5953 8.07962 17.4312 8.24372C17.2671 8.40781 17.0446 8.5 16.8125 8.5H16.375V16.375C16.375 16.8391 16.1906 17.2842 15.8624 17.6124C15.5342 17.9406 15.0891 18.125 14.625 18.125H9.375C8.91087 18.125 8.46575 17.9406 8.13756 17.6124C7.80937 17.2842 7.625 16.8391 7.625 16.375V8.5H7.1875C6.95544 8.5 6.73288 8.40781 6.56878 8.24372C6.40469 8.07962 6.3125 7.85706 6.3125 7.625V6.75C6.3125 6.51794 6.40469 6.29538 6.56878 6.13128C6.73288 5.96719 6.95544 5.875 7.1875 5.875H10.25C10.25 5.64294 10.3422 5.42038 10.5063 5.25628C10.6704 5.09219 10.8929 5 11.125 5H12.875C13.1071 5 13.3296 5.09219 13.4937 5.25628C13.6578 5.42038 13.75 5.64294 13.75 5.875H16.8125C17.0446 5.875 17.2671 5.96719 17.4312 6.13128C17.5953 6.29538 17.6875 6.51794 17.6875 6.75V7.625ZM8.60325 8.5L8.5 8.55163V16.375C8.5 16.6071 8.59219 16.8296 8.75628 16.9937C8.92038 17.1578 9.14294 17.25 9.375 17.25H14.625C14.8571 17.25 15.0796 17.1578 15.2437 16.9937C15.4078 16.8296 15.5 16.6071 15.5 16.375V8.55163L15.3967 8.5H8.60325ZM7.1875 7.625H16.8125V6.75H7.1875V7.625Z"
                                                fill="black"/>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_2001_128">
                                                <rect width="24" height="24" fill="white"/>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div class="card-main">
                            ${item_icons.outerHTML} 
                        <div>
                    </div>
                `
                this.events_page_user_events_cards_list.appendChild(event_block)

            })

        }, () => { })
    }

}