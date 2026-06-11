import { swich_to_page, temp_buffer } from "../utils.js"
import { set_last_menstruation_date_page, have_code_page, main_page, events_page } from "../pages.js"
import { BasePage } from "./base_page.js"
import { showBackButton, hideBackButton, addBackButtonPressEvent } from "../telegram.js"
export class MainGroupPage extends BasePage {
    constructor() {
        super()
        this.page = document.getElementById("main_group_page");
        this.page_name = "main_group_page"
        this.animate_object = this.page.getElementsByClassName("content")[0];
        this.create_view_callback(this)
        this.current_page = null

    }
    on_open() {
        this.init_all_texts()
        this.renderPageFrame(main_page)


        const openMainPageBtn = document.getElementById("openMainPageBtn")
        const openEventsPageBtn = document.getElementById("openEvrntsPageBtn")

        openMainPageBtn.onclick = () => {
            this.renderPageFrame(main_page)

        }
        openEventsPageBtn.onclick = () => {
            this.renderPageFrame(events_page)
        }

        // hideBackButton()
        // let submite_button = document.getElementById("greeting_page_btn"); // Необязательно, но так проще
        // let have_code_button = document.getElementById("have_code_btn"); // Необязательно, но так проще

        // submite_button.onclick = () => {            
        //     swich_to_page(this, set_last_menstruation_date_page, .5, .5)
        // }
        // have_code_button.onclick = () => {
        //     swich_to_page(this, have_code_page, .5, .5)
        // }
    }
    renderPageFrame(page) {

        let offset = 0 // 10 px
        if (this.current_page == null || this.current_page.page_name != page.page_name) {
            
            
            // let checkPageHeight = () => {
            //     if (page.page.getBoundingClientRect().height > 0) {
                    
            let theight = parseInt(this.page.getBoundingClientRect().height - parseInt(document.getElementById("main_group_page_nav_bar").getBoundingClientRect().height) - offset)

            page.page.style.height = `${theight}px`

                // } else {
                //     setTimeout(() => {
                //         checkPageHeight()
                //     }, 10)// Ожидание обновления высоты элемента
                // }


            // }
            // checkPageHeight()
            swich_to_page(this.current_page, page, .3, .3)
            this.current_page = page

        }

    }


}