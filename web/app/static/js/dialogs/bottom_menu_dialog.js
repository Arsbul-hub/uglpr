import { BaseDialog } from "./index.js"
import { swich_to_page, temp_buffer, hide_element, removeAllChildren, getElementFullSize, calculateFontSizeByWords } from "../utils.js"
import { showBackButton, hideBackButton, addBackButtonPressEvent } from "../telegram.js"
import { manageEvents, getAllEventsTypes, getEventedDayByDate } from "../api.js"
import { send_partner_code_page, main_group_page, my_partner_page } from "../pages.js"

export class BottmMenuDialog extends BaseDialog {
    constructor() {
        super()
        this.dialog = document.getElementById("dialog_bottom_menu")
        this.dialog_name = "Bottom Menu Dialog"
        const close_button = this.dialog.querySelector(".button-close")
        close_button.onclick = () => {
            this.hide()
        }
        this.my_partner_btn = document.getElementById("main_page_bottom_menu_my_partner_button")
        this.my_partner_btn.onclick = () => {
            this.hide()
            swich_to_page(main_group_page, my_partner_page, .5, .5)
        }
    }
    on_open() {

    }
    on_close() {
        
        
    }


}