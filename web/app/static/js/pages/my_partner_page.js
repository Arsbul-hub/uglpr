import { swich_to_page, temp_buffer } from "../utils.js"
import { main_group_page, have_code_page, main_page } from "../pages.js"
import { BasePage } from "./base_page.js"
import {showBackButton, hideBackButton, addBackButtonPressEvent} from "../telegram.js"
export class MyPartnerPage extends BasePage {
    constructor() {
        super()
        this.page = document.getElementById("my_partner_page");
        this.page_name = "my_partner_page"
        this.animate_object = this.page.getElementsByClassName("content")[0];
        

        
    }
    on_open () {
        this.init_all_texts()
        showBackButton()
        addBackButtonPressEvent(() => {
            main_page.buttom_menu_dialog.show()
            swich_to_page(this, main_group_page)
        })

    }

}