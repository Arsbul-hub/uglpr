let backButtoncallback = null
function clearBackButtonEvent() {
    if (backButtoncallback != null) {
        window.Telegram.WebApp.BackButton.offClick(backButtoncallback)
    }
}
export function showBackButton() {
    window.Telegram.WebApp.BackButton.show()
    // clearBackButtonEvent()

}

export function hideBackButton() {
    window.Telegram.WebApp.BackButton.hide()
    // clearBackButtonEvent()
}

// export function removeBackButtonPressEvent() {

// }

export function addBackButtonPressEvent(event) {
    if (backButtoncallback != null) {
        window.Telegram.WebApp.BackButton.offClick(backButtoncallback)
    }
    window.Telegram.WebApp.BackButton.onClick(event)
    backButtoncallback = event
}