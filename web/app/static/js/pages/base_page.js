
export class BasePage {
    constructor() {
        this.page_name = null
        this.page = null
        this.view_callback_observer = null
        this.animate_object = null

    

    }
    on_open() { }
    on_close() { }
    create_view_callback(classref) { }
    init_all_texts() {
        const all_page_texts = TEXTS["pages"][this.page_name]

        for (var element_id in all_page_texts["base_content"]) {
            let element_content = all_page_texts["base_content"][element_id]

            if (typeof element_content == "object") {
                for (var subelement_id in element_content) {
                    let subelement_content = element_content[subelement_id]
                    let subelement_attribute = null
                    if (subelement_id.includes("$")) {
                        subelement_attribute = subelement_id.split("$")[1]
                        subelement_id = subelement_id.split("$")[0]
                    }
                    
                    let subelement = this.page.querySelector(`#${this.page_name}_${element_id}_${subelement_id}`)
                    if (subelement != null) {
                        if (subelement_attribute) {
                            subelement.setAttribute(subelement_attribute, subelement_content)
                        } else {
                            subelement.innerHTML = subelement_content
                        }
                    } else {
                        console.log(`Не найден элемент #${this.page_name}_${element_id}_${subelement_id}`)
                    }
                    
                }
            } else {
                let element_attribute = null
                if (element_id.includes("$")) {
                    element_attribute = element_id.split("$")[1]
                    element_id = element_id.split("$")[0]
                    
                }
                let element = this.page.querySelector(`#${this.page_name}_${element_id}`)
                if (element != null) {

                    if (element_attribute) {
                        element.setAttribute(element_attribute, element_content)
                    } else {
                        element.innerHTML = element_content
                    }

                } else {
                    console.log(`Не найден элемент #${this.page_name}_${element_id}`)
                }

                

            }
        }
        Array.prototype.forEach.call(this.page.getElementsByClassName("button-submit"), (el) => {
            el.innerHTML = TEXTS["common"]["submit"]
        })
        Array.prototype.forEach.call(this.page.getElementsByClassName("button-save"), (el) => {
            el.innerHTML = TEXTS["common"]["save"]
        })
        Array.prototype.forEach.call(this.page.getElementsByClassName("button-cancel"), (el) => {
            el.innerHTML = TEXTS["common"]["cancel"]
        })

    }


    show(open_animation_duration, open_animation_name) {

        this.page.style.display = "block";

        if (this.animate_object) {
            this.animate_object.style.animationName = open_animation_name;
            this.animate_object.style.animationDuration = `${open_animation_duration}s`;
        }
        this.on_open()




    }
    hide(close_animation_duration, close_animation_name) {
        setTimeout(() => {
            this.page.style.display = "none";
        }, close_animation_duration * 1000)
        if (this.animate_object) {
            this.animate_object.style.animationName = close_animation_name;
            this.animate_object.style.animationDuration = `${close_animation_duration}s`;
        }
        this.on_close()

    }

}