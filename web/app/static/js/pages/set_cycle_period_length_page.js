import { swich_to_page, temp_buffer } from "../utils.js"
import { set_menstruation_period_length_page, set_last_menstruation_date_page } from "../pages.js"
import { showBackButton, hideBackButton, addBackButtonPressEvent } from "..//telegram.js"
import { BasePage } from "./base_page.js"
export class SetCyclePeriodLengthPage extends BasePage {
    constructor() {
        super()
        this.page = document.getElementById("set_cycle_period_length_page");
        this.page_name = "set_cycle_period_length_page"
        this.animate_object = this.page.getElementsByClassName("content")[0];
        this.create_view_callback(this)
    }
    on_open() {
        this.init_all_texts()
        showBackButton()
        addBackButtonPressEvent(() => {
            swich_to_page(this, set_last_menstruation_date_page, .5, .5)

        })
        let input = document.getElementById("set_cycle_period_length_page_input")
        let submit_button = document.getElementById("set_cycle_period_length_page_submit_button");
        input.oninput = () => {
            

            if (input.value == "" || (Number(input.value) > 100 || Number(input.value) < 5)) {
                submit_button.disabled = true;
            } else {

                submit_button.disabled = false;


            }

        }

        submit_button.onclick = () => {
            temp_buffer.add("cycle_period_length", input.value)
            swich_to_page(this, set_menstruation_period_length_page, .5, .5)
        }
        // let nav_button = this.page.getElementsByClassName("top_nav-button")[0]; 
        // nav_button.onclick = () => {
        //     swich_to_page(this, set_last_menstruation_date_page, .5, .5)
        // }

    }

}