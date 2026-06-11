import { swich_to_page, get_random_int } from "../utils.js"
import { have_code_page, main_group_page } from "../pages.js"
import { BasePage } from "./base_page.js"
export class LoadingPage extends BasePage {
    constructor() {
        super()
        this.page = document.getElementById("loading_wait_page");
        this.page_name = "loading_wait_page"
        this.animate_object = this.page.getElementsByClassName("content")[0];
        this.create_view_callback(this)
    }
    on_open() {
        // Не надо меня за это осуждать. Я просто хотел сделать красивую анимацию перехода и всё.
        let random_time = get_random_int(2, 4)
        // let description = this.page.getElementsByClassName("bar-description")[0];
        // setTimeout(() => {
        //     description.styl
        // }, Number((random_time / 2)) * 1000)
        setTimeout(() => {
            swich_to_page(this, main_group_page, 0.5, 0.5)

        }, random_time * 1000)
    }
}