import {SplashPage} from "./pages/splash_page.js"
import {GreetingPage} from "./pages/greeting_page.js"
import {HaveCodePage} from "./pages/have_code_page.js"
import {SetLastMenstruationDatePage} from "./pages/set_last_menstruation_date_page.js"
import {SetCyclePeriodLengthPage} from "./pages/set_cycle_period_length_page.js"
import {SetMenstruationPeriodLengthPage} from "./pages/set_menstruation_period_length_page.js"
import {LoadingPage} from "./pages/loading_wait_page.js"
import {SendPartnerCodePage} from "./pages/send_partner_code_page.js"
import {MainPage} from "./pages/main_page.js"
import {EventsPage} from "./pages/events_page.js"
import {MainGroupPage} from "./pages/main_group_page.js"
import {MyPartnerPage} from "./pages/my_partner_page.js"

export const splash_page = new SplashPage()
export const greeting_page = new GreetingPage()
export const have_code_page = new HaveCodePage()
export const set_last_menstruation_date_page = new SetLastMenstruationDatePage()
export const set_cycle_period_length_page = new SetCyclePeriodLengthPage()
export const set_menstruation_period_length_page = new SetMenstruationPeriodLengthPage()
export const loading_page = new LoadingPage()
export const send_partner_code_page = new SendPartnerCodePage()
export const main_group_page = new MainGroupPage()
export const events_page = new EventsPage()
export const main_page = new MainPage()
export const my_partner_page = new MyPartnerPage()
// let is_user_exist = false;


// let splash_page = document.getElementById("splash_page");
// let splash_image = splash_page.getElementsByClassName("content-image")[0];
// let loading_page = document.getElementById("loading_page");
// let content_bar = loading_page.getElementsByClassName("content-bar")[0];
// // swich_to_page(null, "splash_page", null, "open_splash", null, splash_image, 0.5, null)
// setTimeout(() => {
//     swich_to_page("splash_page", "loading_page", "close_splash", "open_page", splash_image, content_bar, 0.4, 0.5)
//     // var xhr = new XMLHttpRequest();
//     // let url = new URL(`${server_url}:${server_port}/is_user_exist`);
//     fetch(`${server_url}/is_user_exist`, {
//         method: 'GET',
//         headers: {
//           Authorization: `tma ${initDataRaw}`
//         },
//       }).then(response => {
//           if (!response.ok) {
//             throw new Error('Сетевая ошибка');
//           }
      
//           return response.json();
//         })
//         .then(data => {
//             console.log(data);
//             if (data["data"] == true) {
//                 is_user_exist = true
//                 update_days_data();
                
//                 swich_to_page("loading_page", "main_page", "close_splash", "open_page", content_bar, null, 0.4, 0.5)
                
//             } else {
    
//                 swich_to_page("loading_page", "greeting_page", "close_splash", "open_page", content_bar, null, 0.4, 0.5)
//             }
//         })
//         .catch(error => console.error('Ошибка:', error));
//     // url.searchParams.set("token", token);
//     // url.searchParams.set("user_id", user_id)
//     // xhr.open('get', url);
//     // xhr.send();
//     // //console.log(xhr.entities);
//     // xhr.onload = function (e) {
//     //     let data = JSON.parse(xhr.response);
//     //     console.log(data);
//     //     if (data["data"] == true) {
//     //         is_user_exist = true
//     //         swich_to_page("loading_page", "main_page", "close_splash", "open_page", content_bar, null, 0.4, 0.5)

//     //     } else {

//     //         swich_to_page("loading_page", "greeting_page", "close_splash", "open_page", content_bar, null, 0.4, 0.5)
//     //     }
//     // };



// }, 1300)