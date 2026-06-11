
export class BaseDialog {
    constructor() {
        this.dialog_name = null
        this.dialog = null
        this.animate_object = null
    }
    on_open() { }
    on_close() { }
    show(open_animation_duration, open_animation_name) {
        this.dialog.showModal()
        if (this.animate_object) {
            this.animate_object.style.animationName = open_animation_name;
            this.animate_object.style.animationDuration = `${open_animation_duration}s`;
        }
        this.on_open()
    }
    hide(close_animation_duration, close_animation_name) {
        setTimeout(() => {
            this.dialog.close()
        }, close_animation_duration * 1000)
        if (this.animate_object) {
            this.animate_object.style.animationName = close_animation_name;
            this.animate_object.style.animationDuration = `${close_animation_duration}s`;
        }
        this.on_close()
    }
}