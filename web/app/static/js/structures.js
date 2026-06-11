export class EventsType {
    constructor(id, icon_path, description) {
        this.id = id
        this.icon_path = icon_path
        this.description = description
    }
}

export class EventedDay {
    constructor(id, date, events_icons=[]) {
        this.id = id
        this.date = date
        this.events_types = events_icons
    }
    add_event_type(events_type_object) {
        this.events_types.push(events_type_object)
    }
}

export class UserData {
    constructor(
        id,
        user_id,
        last_menstruation_end_date,
        menstruation_period_length,
        cycle_period_length,
        last_notify_date,
        notify_days,
        lang,          
    ) {
        this.id = id;
        this.user_id = user_id;
        this.last_menstruation_end_date = last_menstruation_end_date; // Date or string
        this.menstruation_period_length = menstruation_period_length;
        this.cycle_period_length = cycle_period_length;
        this.last_notify_date = last_notify_date;
        this.notify_days = notify_days;
        this.lang = lang;
    }
}

export class User {
    constructor(
        user_id,
        partner_id = null,
        partner = null,           // User instance
        is_partner = false,
        user_data = null          // UserData instance
    ) {
        this.user_id = user_id;
        this.partner_id = partner_id;
        this.partner = partner;
        this.is_partner = is_partner;
        this.user_data = user_data;
    }
}