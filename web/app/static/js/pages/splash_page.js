import { swich_to_page, temp_buffer } from "../utils.js"
import { greeting_page, main_page, main_group_page } from "../pages.js"
import { BasePage } from "./base_page.js"
import { getUser } from "../api.js"
import { UserData, User } from "../structures.js"

import { hideBackButton } from "..//telegram.js"
import { EventedDay } from "../structures.js"
export class SplashPage extends BasePage {
    constructor() {
        super()
        this.page = document.getElementById("splash_page");
        this.page_name = "splash_page"
        this.animate_object = this.page.getElementsByClassName("content-image")[0];
        this.create_view_callback(this)
    }
    on_open() {
        hideBackButton()
        setTimeout(() => {
            getUser((data) => {
                var data = data["user"]
                let user_data = null
                if (data["user_data"]) {
                    const ud = data["user_data"]
                    user_data = new UserData(
                        ud["id"],
                        ud["user_id"],
                        ud["last_menstruation_end_date"],
                        ud["menstruation_period_length"],
                        ud["cycle_period_length"],
                        ud["last_notify_date"],
                        ud["notify_days"],
                        ud["lang"]
                    )
                }

                let partner = null
                if (data["partner"]) {
                    let user_data = null
                    if (data["partner"]["user_data"]) {
                        const ud = data["partner"]["user_data"]
                        user_data = new UserData(
                            ud["id"],
                            ud["user_id"],
                            ud["last_menstruation_end_date"],
                            ud["menstruation_period_length"],
                            ud["cycle_period_length"],
                            ud["last_notify_date"],
                            ud["notify_days"],
                            ud["lang"]

                        )
                    }
                    partner = new User(
                        data["user_id"],
                        null,
                        null,
                        true,
                        user_data
                    )
                }
                const user = new User(
                    data["user_id"],
                    data["partner_id"],
                    partner,
                    data["is_partner"],
                    user_data

                )
                console.log(user)
                temp_buffer.add("user", user)
                swich_to_page(this, main_group_page, 0.5, 0.5)
            }, (error_type, _) => {
                if (error_type == 1 && error_type.status == 404) { // Error with status
                    swich_to_page(this, greeting_page, 0.5, 0.5)
                }
            })
            // getUserExists((data) => {
            //     if (!data["data"]) {
            //         swich_to_page(this, greeting_page, 0.5, 0.5)
            //     } else {
            //         swich_to_page(this, main_group_page, 0.5, 0.5)
            //     }

            //     // swich_to_page(this, greeting_page, 0.5, 0.5)
            // })
            //swich_to_page(this, greeting_page, 0.5, 0.5)

        }, 1300)
    }

}