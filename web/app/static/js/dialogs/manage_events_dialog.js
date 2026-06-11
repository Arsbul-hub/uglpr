import { BaseDialog } from "./index.js"
import { swich_to_page, temp_buffer, removeAllChildren, getLocalDate, getElementFullSize, calculateFontSizeByWords } from "../utils.js"
import { showBackButton, hideBackButton, addBackButtonPressEvent } from "../telegram.js"
import { manageEvents, getAllEventsTypes, getEventedDayByDate } from "../api.js"
export class ManageEventsDialog extends BaseDialog {
    constructor(on_save = () => {}) {
        super()

        this.dialog = document.getElementById("manage_events_dialog")
        this.dialog_name = "Manage Events Dialog"
        this.manage_events_dialog_save_button = this.dialog.querySelector(".button-save")
        this.manage_events_dialog_cancel_button = this.dialog.querySelector(".button-cancel")
        this.manage_events_dialog_date = document.getElementById("manage_events_dialog_form_date_input")
        this.added_events_types_list = document.getElementById("manage_events_dialog_added_events_types_list")
        this.events_types_list = document.getElementById("manage_events_dialog_events_types_list")
        this.manage_events_dialog_button = this.dialog.querySelector(".button-save")
        this.added_events_types = new Map()
        this.all_events_types = new Map()
        this.element_width = 0
        this.element_font_size = 0
        this.dialog_events_cards_count = 6
        this.on_save = on_save
        
        this.manage_events_dialog_date.oninput = () => {
            if (this.manage_events_dialog_date.value == "") {
                this.manage_events_dialog_button.disabled = true;
            } else {
                this.manage_events_dialog_button.disabled = false;
            }
            let selectedDialogDate = new Date(this.manage_events_dialog_date.value)
            this.load_events_on_day(selectedDialogDate)
        }
        this.manage_events_dialog_cancel_button.onclick = () => {
            this.hide()
        }
        this.manage_events_dialog_save_button.onclick = () => {
            let selectedDialogDate = new Date(this.manage_events_dialog_date.value)
            
            manageEvents(getLocalDate(selectedDialogDate), this.added_events_types.keys().toArray(), () => {
                this.hide()
                this.on_save()
               
            }, () => {
                
            })

        }
    }
    on_open() {
        



        getAllEventsTypes(data => {
            this.all_events_types.clear()
            let row = document.createElement("li")
            row.className = "events-type-row"
            //const this.dialog_events_cards_count = 10
            //let this.element_width = parseInt(getElementFullSize(add_user_event_dialog_types_list).width / this.dialog_events_cards_count)


            this.element_width = parseInt(getElementFullSize(this.events_types_list).width / this.dialog_events_cards_count)

            let max_word = ""

            for (let i = 0; i < data.events_types.length; i++) {
                let text = data.events_types[i].description

                text = text.split(" ")

                text.sort()

                text = text[text.length - 1]

                if (text.length > max_word.length) {
                    max_word = text
                }
            }

            this.element_font_size = calculateFontSizeByWords(this.element_width, max_word)

            for (let i = 0; i < data.events_types.length; i++) {
                // if (i % this.dialog_events_cards_count == 0 && i != 0) {
                //     add_user_event_dialog_types_list.appendChild(row)
                //     row = document.createElement("li")
                //     row.className = "events-type-row"

                // }


                let events_type = data.events_types[i]
                this.all_events_types.set(events_type.id, events_type)
                let element = document.createElement("li")
                element.dataset.id = events_type.id
                element.onclick = (e) => {
                    e.preventDefault()
                    let el = e.target.closest(".events-type-item")
                    if (el) {
                        if (this.added_events_types.get(parseInt(el.dataset.id)) != null) {
                            this.added_events_types.delete(parseInt(el.dataset.id))
                            el.classList.remove("selected")
                            let added_events_type = this.added_events_types_list.querySelector(`li[data-id="${events_type.id}"]`)
                            added_events_type.remove()
                        } else {
                            this.added_events_types.set(parseInt(el.dataset.id), this.all_events_types.get(parseInt(el.dataset.id)))
                            el.classList.add("selected")
                            this.add_event_type(this.all_events_types.get(parseInt(el.dataset.id)))
                        }
                        
                    }
                }
                // element.className = "events-type-item"
                // element.style.width = `${this.element_width}px`
                // element.innerHTML = `
                // <img src="${events_type.icon_path}">
                // <p style="font-size: ${element_font_size}px">${events_type.description}</p>
                // `
                //row.appendChild(element)
                element.className = "events-type-item"
                // element.style.width = `${this.element_width}px`

                element.innerHTML = `
                <img src="${events_type.icon_path}" >
                <p style="font-size: ${this.element_font_size}px">${events_type.description}</p>
                `
                this.events_types_list.appendChild(element)
            }
            let style = getComputedStyle(this.added_events_types_list)
            let padding_delta = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
            let theight = (getElementFullSize(this.dialog.querySelector(".dialog-content")).height - getElementFullSize(this.dialog.querySelector(".content-header")).height - getElementFullSize(this.dialog.querySelector(".content-footer")).height) - padding_delta
           
            this.added_events_types_list.style.height = `${theight}px`


        })
    }
    on_close() {
        this.clear_events_types_data(true)
    }
    load_events_on_day(selectedDialogDate) {
        this.clear_events_types_data(false)
            
        
        getEventedDayByDate(getLocalDate(selectedDialogDate), data => {

            // let row = document.createElement("li")
            // row.className = "events-type-row"


            if (data.event != null) {

                for (let i = 0; i < data.event.events_types.length; i++) {
                    // if (i % this.dialog_events_cards_count == 0 && i != 0) {

                    //     this.added_events_types_list.appendChild(row)
                    //     row = document.createElement("li")
                    //     row.className = "events-type-row"

                    // }


                    let events_type = data.event.events_types[i]
                    let events_type_element = events_types_list.querySelector(`li[data-id="${events_type.id}"]`)
                    events_type_element.classList.add("selected")

                    this.add_event_type(events_type)
                    this.added_events_types.set(events_type.id, events_type)

                }
                // add_user_event_dialog_types_list.appendChild(row)
            }

        })
    }
    add_event_type(event_type) {

        let element = document.createElement("li")
        element.className = "events-type-item"
        element.dataset.id = event_type.id
        element.style.width = `${this.element_width}px`
        element.innerHTML = `
            <img src="${event_type.icon_path}">
            <p style="font-size: ${this.element_font_size}px">${event_type.description}</p>
        `
        //row.appendChild(element)
        // element.className = "events-type-item"
        // element.style.width = `${this.element_width}px`

        // element.innerHTML = `
        // <img src="${events_type.icon_path}" >

        // ` //<p style="font-size: ${element_font_size}px">${events_type.description}</p>
        this.added_events_types_list.appendChild(element)
    }
    clear_events_types_data(clear_all_events_types) {
        
        while (this.added_events_types_list.firstChild) {
            this.added_events_types_list.removeChild(this.added_events_types_list.lastChild);
        }
        const child_list = this.events_types_list.children
            for (let i = 0; i < child_list.length; i++) {
                let element = child_list[i]
                if (element.classList.contains("selected")) {
                    element.classList.remove("selected")
                }
        }
        this.added_events_types.clear()
        if (clear_all_events_types) {
            this.manage_events_dialog_date.value = ""
            this.added_events_types_list.style.height = null
            
            while (this.events_types_list.firstChild) {
                this.events_types_list.removeChild(this.events_types_list.lastChild);
            }
            this.all_events_types.clear()
        }

        
    }

}