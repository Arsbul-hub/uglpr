import { getTodayDate, getLocalDate } from './utils.js';
// Все API-вызовы в одном месте


export function fetchAPI(endpoint, method = 'GET', body = null, params = null, on_response, on_error) {
  // const tg = window.Telegram.WebApp;
  // const hash = window.location.hash.slice(1);
  // const params = new URLSearchParams(hash);
  // const initDataRaw = params.get("tgWebAppData");
  let url = `${server_url}/${endpoint}`

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const paramsStr = new URLSearchParams((params)? params: {});
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `tma ${window.Telegram.WebApp.initData}`,
      "timeZone": timeZone
    }
  }

  if (body) options.body = JSON.stringify(body)

  if (paramsStr.size > 0) {
    url = `${server_url}/${endpoint}?${paramsStr}`
  } 
  
  fetch(url, options).then(response => {

    if (!response.ok) {
      throw response
    } else {

      return response.json()
    }

  }).then(data => {



    on_response(data)




  }).catch(error => {
    if (error instanceof TypeError) {
      on_error(0, error)
    } else {
      on_error(1, error)
    }
  })



}

// Специфичные API методы
export const addUserData = (menstruation_period_length, cycle_period_length, last_menstruation_end_date, user_lang, on_response, on_error = (_) => { }) => fetchAPI('add_user_data', 'POST', {
  "menstruation_period_length": menstruation_period_length,
  "cycle_period_length": cycle_period_length,
  "last_menstruation_end_date": last_menstruation_end_date,
  "lang": user_lang,
}, null, on_response, on_error);
export const getUser = (on_response, on_error = (t, _) => { }) => fetchAPI('get_user', "GET", null, null, on_response, on_error)

export const getUserExists = (on_response, on_error = (t, _) => { }) => fetchAPI('is_user_exist', "GET", null, null, on_response, on_error)
export const getMenstruationDays = (on_response, on_error = (t, _) => { }) => fetchAPI(`get_menstruation_days`, "GET", null, {"today": getLocalDate()}, on_response, on_error)
export const getCurrentDay = (on_response, on_error = (t, _) => { }) => fetchAPI(`get_current_day`, "GET", null, {"today": getLocalDate()}, on_response, on_error)
export const menstruationDelay = (on_response, on_error = (t, _) => { }) => fetchAPI('menstruation_delay', 'POST', { "today": getLocalDate() }, null, on_response, on_error)
export const menstruationStarted = (date, on_response, on_error = (t, _) => { }) => fetchAPI('menstruation_started', 'POST', { "last_date": date }, null, on_response, on_error)
export const getPartnerCode = (on_response, on_error = (t, _) => { }) => fetchAPI('get_partner_code', 'GET', null, null, on_response, on_error)
export const connectPartner = (code, lang, on_response, on_error = (t, _) => { }) => fetchAPI('connect_partner', 'POST', { "code": code, "lang": lang }, null, on_response, on_error)
export const getUserType = (on_response, on_error = (t, _) => { }) => fetchAPI('get_user_type', 'GET', null, null, on_response, on_error)
export const getEventedDays = (selected_weekday, on_response, on_error = (t, _) => { }) => fetchAPI('get_evented_days', 'GET', null, {"today": getLocalDate(), "selected_weekday": selected_weekday }, on_response, on_error)
export const manageEvents = (date, events_types, on_response, on_error = (t, _) => { }) => fetchAPI('manage_events', 'POST', { "date": date, "events_types": events_types }, null, on_response, on_error)
//export const editUserEvent = (event_id, date, on_response, on_error = (t, _) => null) => fetchAPI('add_user_event', 'POST', {"event_id": event_id, "date": date}, null, on_response, on_error);
//export const deleteUserEvent = (event_id, on_response, on_error = (t, _) => null) => fetchAPI('add_user_event', 'POST', null, null, on_response, on_error);
export const getMonthEventedDays = (selected_month_date, on_response, on_error = (t, _) => { }) => fetchAPI('get_month_evented_days', 'GET', null, { "selected_month_date": selected_month_date }, on_response, on_error)
export const getAllEventsTypes = (on_response, on_error = (t, _) => { }) => fetchAPI('get_events_types', 'GET', null, null, on_response, on_error)
export const getEventedDayByDate = (date, on_response, on_error = (t, _) => { }) => fetchAPI('get_evented_day_by_date', 'GET', null, {"today": getLocalDate(),  "date": date }, on_response, on_error)








