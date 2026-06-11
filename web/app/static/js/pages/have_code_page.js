import { swich_to_page, temp_buffer } from "../utils.js"
import { greeting_page, main_group_page, main_page } from "../pages.js"
import { BasePage } from "./base_page.js"
import { showBackButton, hideBackButton, addBackButtonPressEvent } from "../telegram.js"
import { connectPartner } from "../api.js"
export class HaveCodePage extends BasePage {
    constructor() {
        super()
        this.page = document.getElementById("have_code_page");
        this.page_name = "have_code_page"
        this.animate_object = this.page.getElementsByClassName("content")[0];

        let submit_button = document.getElementById("have_code_page_btn")
        const inputs_container = this.page.querySelector(".content-inputs")
        this.inputs_list = this.page.querySelectorAll(".input-code")

        let current_input = 0

        // submit_button.onclick = () => {
        //     connectPartner(input.value, user_lang, (data) => {
        //         swich_to_page(this, main_page, .5, .5)
        //     }, () => {

        //     })
        // }

        inputs_container.addEventListener("input", (e) => {
            const target = e.target
            const val = target.value

            if (isNaN(val)) {
                this.inputs_list[current_input].value = ""
                return
            }
            if (val != "") {
                this.inputs_list[current_input].classList.add("input-code-inputed")
                this.inputs_list[current_input].value = val
                if (current_input == this.inputs_list.length - 1) {
                    this.check_code()
                }
                if (current_input < this.inputs_list.length - 1) {
                    current_input++
                    this.inputs_list[current_input].focus()
                    //const next = target.nextElementSibling
                    // if (next) {
                    //     next.focus()
                    // }

                }
            }


        })

        inputs_container.addEventListener("keydown", (e) => {
            
            const key = e.key.toLowerCase()

            if (key == "backspace" || key == "delete") {
                e.preventDefault();
                if (this.get_text_code().length == MAX_CODE_LENGTH) {
                    this.on_retry()
                }
                if (current_input > 0 && this.inputs_list[current_input].value == "") {
                    current_input--
      
                }
                this.inputs_list[current_input].value = ""
                this.inputs_list[current_input].focus()
                return
            }
        });
        inputs_container.addEventListener("paste", (e) => {

            const pastedData = e.clipboardData.getData('text').trim();
            console.log(pastedData == "", !isNaN(pastedData), pastedData.length > MAX_CODE_LENGTH)
            if (pastedData == "" || isNaN(pastedData) || pastedData.length > MAX_CODE_LENGTH) {
                return
            }
            current_input = this.inputs_list.length - 1
            this.inputs_list[current_input].focus()
            for (let i = 0; i < pastedData.length; i++) {
                this.inputs_list[i].value = pastedData[i]
            }
        });

    }
    get_text_code() {
        let code_text = ""
        this.inputs_list.forEach((e) => {
            code_text += e.value
        })
        return code_text
    }
    check_code() {
        let code_text = this.get_text_code()
        this.inputs_list.forEach((e) => {
            e.disabled = true
        })
        connectPartner(code_text, user_lang, (data) => {
            this.on_success()
            setTimeout(() => {
                swich_to_page(this, main_group_page, .5, .5)
            }, 1500)
            
        }, (error) => {
           
            if (error.status == 401) {
                this.on_error(1)
            } else {
                this.on_error(3)
            }
        }, () => {
            this.on_error(2)
        })

    }
    on_error(error_type) {

        this.inputs_list.forEach((e) => {
            e.disabled = false
            e.classList.add("input-code-error")
        })
        if (error_type == 2) { // Bad code

        } else if (error_type == 0) { // Connection lost

        } else { // Something went wrong

        }

        
    } 
    on_success() {
        this.inputs_list.forEach((e) => {
            e.classList.add("input-code-success")
        })
    } 
    on_retry() {
        this.inputs_list.forEach((e) => {
            e.disabled = false
            e.classList.remove("input-code-error")
            e.classList.remove("input-code-success")
        })
    }
    on_open() {
        this.init_all_texts()
        showBackButton()
        addBackButtonPressEvent(() => {
            swich_to_page(this, greeting_page, .5, .5)
        })




    }
    on_close() {
        hideBackButton()
    }

}