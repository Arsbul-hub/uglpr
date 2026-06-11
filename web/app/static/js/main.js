import { splash_page } from "./pages.js"
import { swich_to_page } from "./utils.js"

let splash_image = splash_page.page.getElementsByClassName("content-image")[0];
swich_to_page(null, splash_page, .5)
