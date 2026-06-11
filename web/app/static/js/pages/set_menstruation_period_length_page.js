import { swich_to_page, temp_buffer } from "../utils.js"
import { loading_page, main_page, set_cycle_period_length_page } from "../pages.js"
import { showBackButton, hideBackButton, addBackButtonPressEvent } from "..//telegram.js"
import { BasePage } from "./base_page.js"
import { addUserData } from "../api.js"
export class SetMenstruationPeriodLengthPage extends BasePage {
    constructor() {
        super()
        this.page = document.getElementById("set_menstruation_period_length_page");
        this.page_name = "set_menstruation_period_length_page"
        this.animate_object = this.page.getElementsByClassName("content")[0];
        this.create_view_callback(this)
    }
    on_open() {
        this.init_all_texts()
        showBackButton()

        addBackButtonPressEvent(() => {
            
            swich_to_page(this, set_cycle_period_length_page, .5, .5)
        })
        let input =  document.getElementById("set_menstruation_period_length_page_input")
        let submit_button = document.getElementById("set_menstruation_period_length_page_submit_button")
        input.oninput = () => {
            
            console.log(this.value)
            if (input.value == "" || (Number(input.value) > 50 || Number(input.value) < 1)) {
                submit_button.disabled = true;
            } else {

                submit_button.disabled = false;


            }

        }
        
        submit_button.onclick = () => {
            temp_buffer.add("menstruation_period_length", input.value)
            this.upload_user_data()
        }
        // let nav_button = this.page.getElementsByClassName("top_nav-button")[0];
        // nav_button.onclick = () => {
        //     swich_to_page(this, set_cycle_period_length_page, .5, .5)
        // }
    }
    upload_user_data() {
        let last_menstruation_date = temp_buffer.get("last_menstruation_date")
        let parsedDate = new Date(last_menstruation_date)



        let cycle_period_length = temp_buffer.get("cycle_period_length")
        let menstruation_period_length = temp_buffer.get("menstruation_period_length")

        addUserData(menstruation_period_length, cycle_period_length, parsedDate.toISOString(), user_lang, (data) => {
            
            swich_to_page(this, loading_page, .5, .5)
            hideBackButton()
        }, (error) => {})


    }

}