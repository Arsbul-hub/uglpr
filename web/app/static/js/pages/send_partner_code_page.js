import { swich_to_page, temp_buffer, show_element, hide_element } from "../utils.js"
import { getPartnerCode } from "../api.js"
import { showBackButton, hideBackButton, addBackButtonPressEvent } from "..//telegram.js"
import { main_group_page, main_page, set_last_menstruation_date_page } from "../pages.js"
import { BasePage } from "./base_page.js"
export class SendPartnerCodePage extends BasePage {
    constructor() {
        super()
        this.page = document.getElementById("send_partner_code_page");
        this.page_name = "send_partner_code_page"
        this.animate_object = this.page.getElementsByClassName("content")[0];
        
        this.code = null
        this.copy_code_button = document.getElementById("send_partner_code_page_copy_code_button")
        this.code_text_block = this.page.querySelector(".content-code_block p")
        this.code_expiring_time_block = this.page.querySelector(".code-expiring_time")
        this.code_interval = null
        this.copy_code_button.onclick = () => {
            navigator.clipboard.writeText(this.code).then(() => {
                console.log("Copied!");
            }).catch(err => {
                console.error("Не удалось скопировать", err);
            })
        }
        
        
        this.copy_code_button.addEventListener('touchstart', function(event) {
            const btn = document.getElementById("send_partner_code_page_copy_code_button")
             
            btn.classList.add('button_regular-touched');
            
        });
        this.copy_code_button.addEventListener('touchend', function(event) {
            const btn = document.getElementById("send_partner_code_page_copy_code_button")
            btn.classList.remove('button_regular-touched');
            
        });

    }
    on_open() {
        this.init_all_texts()
        // let input = this.page.getElementsByClassName("input-days")[0];
        
        this.get_code()
        addBackButtonPressEvent(() => {

            swich_to_page(this, main_group_page, .5, .5)
   
            
        })
        showBackButton()
        

    }
    on_close() {
        hideBackButton()
        this.code_text_block.innerText = ""
        this.code_expiring_time_block.innerText = ""
        clearInterval(this.code_interval)
        main_page.buttom_menu_dialog.show()
        
        
    }
    get_code() {
        const spinner = this.page.querySelector(".spinner")
        hide_element(this.code_text_block)
        show_element(spinner)
        this.copy_code_button.disabled = true
        
        getPartnerCode((data) => {

            this.code = data["code"]
            this.code_text_block.innerText = this.code
            this.copy_code_button.disabled = false
            hide_element(spinner)
            show_element(this.code_text_block)
            this.run_code_expire_interval(data["expiring_delta"])
            
        }, (_, e) => {
            
        })
    }
    run_code_expire_interval(start_seconds) {
        let delta_seconds = start_seconds
        let minutes = parseInt(delta_seconds / 60)
        let seconds = parseInt(delta_seconds - minutes * 60 )
        this.code_expiring_time_block.innerText = `${minutes}:${seconds}`
        delta_seconds--
        this.code_interval = setInterval(() => {
            if (delta_seconds <= 0) {
                this.get_code()
                clearInterval(this.code_interval)
            }
            
            minutes = parseInt(delta_seconds / 60)
            seconds = parseInt(delta_seconds - minutes * 60 )
            this.code_expiring_time_block.innerText = `${minutes}:${seconds}`

            delta_seconds--
            
        }, 1000) 

    }

}