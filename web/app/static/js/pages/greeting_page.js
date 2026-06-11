import { swich_to_page, temp_buffer } from "../utils.js"
import { set_last_menstruation_date_page, have_code_page } from "../pages.js"
import { BasePage } from "./base_page.js"
import {showBackButton, hideBackButton, addBackButtonPressEvent} from "../telegram.js"
export class GreetingPage extends BasePage {
    constructor() {
        super()
        this.page = document.getElementById("greeting_page");
        this.page_name = "greeting_page"
        this.animate_object = this.page.getElementsByClassName("content")[0];
        this.create_view_callback(this)
    }
    on_open () {
        this.init_all_texts()
        hideBackButton()
        let submit_button = document.getElementById("greeting_page_submit_button"); // Необязательно, но так проще
        let have_code_button = document.getElementById("greeting_page_have_code_button"); // Необязательно, но так проще

        submit_button.onclick = () => {            
            swich_to_page(this, set_last_menstruation_date_page, .5, .5)
        }
        have_code_button.onclick = () => {
            swich_to_page(this, have_code_page, .5, .5)
        }
    }

}