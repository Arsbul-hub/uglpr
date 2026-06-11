import { swich_to_page, temp_buffer, getLocalDate } from "../utils.js"
import { set_cycle_period_length_page, greeting_page } from "../pages.js"
import {showBackButton, hideBackButton, addBackButtonPressEvent} from "..//telegram.js"
import { BasePage } from "./base_page.js"
export class SetLastMenstruationDatePage extends BasePage {
    constructor() {
        super()
        this.page = document.getElementById("set_last_menstruation_date_page");
        this.page_name = "set_last_menstruation_date_page"
        this.animate_object = this.page.getElementsByClassName("content")[0];
        this.create_view_callback(this)
    }
    on_open() {
        this.init_all_texts()
        showBackButton()

        addBackButtonPressEvent(() => { swich_to_page(this, greeting_page, .5, .5) })
        let input = document.getElementById("set_last_menstruation_date_page_input")
        let submit_button = document.getElementById("set_last_menstruation_date_page_submit_button");

        let min_date = new Date();
        min_date.setDate(min_date.getDate() - 50)
        input.min = getLocalDate(min_date)
        input.max = getLocalDate()
        input.oninput = () => {


            if (input.value == "" || input.value > input.max) {
                submit_button.disabled = true;
            } else {

                submit_button.disabled = false;


            }

        }

        submit_button.onclick = () => {
            temp_buffer.add("last_menstruation_date", input.value)

            swich_to_page(this, set_cycle_period_length_page, .5, .5)
        }
        // let nav_button = this.page.getElementsByClassName("top_nav-button")[0];
        // nav_button.onclick = () => {
        //     swich_to_page(this, greeting_page, .5, .5)
        // }

    }

}