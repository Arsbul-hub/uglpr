import { TempBuffer } from "./temp_buffer.js"

export let temp_buffer = new TempBuffer()
// export function getTodayLocalDate(now = new Date()) {

//   const year = now.getFullYear();
//   const month = String(now.getMonth() + 1).padStart(2, '0');
//   const day = String(now.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`
// }

export function getLocalDate(date = new Date()) {

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`
}
export function getTodayDate() {

  var now = new Date();

  return now.toISOString()
}

export function swich_to_page(current_page = null, next_page, open_animation_duration, close_animation_duration = null, open_animation_name = "open_page", close_animation_name = "close_page") {

  if (current_page != null) {
    current_page.hide(close_animation_duration, close_animation_name)
    setTimeout(() => {
      
      
      next_page.show(open_animation_duration, open_animation_name)
    }, close_animation_duration * 1000)
  } else {

    next_page.show(open_animation_duration, open_animation_name)

  }
}
export function get_random_int(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function get_cookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
export const clip = (value, min, max) => Math.min(Math.max(value, min), max);

export function calculate_menstruation_column_color(probability, gradient, gradient_length) {
  let i
  const max = 0.9
  const min = 0.7

  if (probability >= max) {
    i = parseInt((probability * 100)) - 1

  } else if (probability >= min && probability < max) {
    i = parseInt(((probability - min) / (max - min)) * 100) // 100 - is no tin list

  } else {
    i = 0
  }


  return gradient[i]
  // const k = -7;
  // const b = 730;
  // let color = Math.round(k * probability * 100 + b);

  // if (probability <= 0.7) {
  //   const clippedColor = clip(color, 70, 200);
  //   return [clippedColor, clippedColor, clippedColor];
  // }

  // return [255, clip(color, 0, 171), clip(color, 0, 212)];
}

export function create_gradient(color1, color2, steps) {
  const gradient = [];
  for (let i = 0; i < steps; i++) {
    const ratio = i / (steps - 1); // От 0 до 1
    const r = Math.round(color1[0] + ratio * (color2[0] - color1[0]));
    const g = Math.round(color1[1] + ratio * (color2[1] - color1[1]));
    const b = Math.round(color1[2] + ratio * (color2[2] - color1[2]));
    gradient.push([r, g, b]);
  }
  return gradient;
}


export function setExtentoinalButtonEvents(button, onclick, onlongpress) {
  let pressTimer
  let isPressed = false
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints;
  const start_press = () => {


    isPressed = true
    pressTimer = window.setTimeout(function () {
      onlongpress();
      isPressed = false
    }, 300);
  }
  const end_press = () => {

    clearTimeout(pressTimer);
    if (isPressed) {
      onclick();
    }
  }
  if (isTouchDevice) {
    button.addEventListener("touchstart", (ev) => {
      if (ev.which == 0) {
        start_press()
      }
    })
    button.addEventListener("touchend", (ev) => {
      if (ev.which == 0) {
        end_press()
      }
    })
  } else {
    button.addEventListener("mousedown", (ev) => {
      if (ev.which == 1) {
        start_press()
      }
    })
    button.addEventListener("mouseup", (ev) => {
      if (ev.which == 1) {
        end_press()
      }
    })
  }

}
Number.prototype.clamp = function (min, max) {
  return Math.min(Math.max(this, min), max);
};


export function removeAllChildren(blok) {
  while (blok.firstChild) {
    blok.removeChild(blok.firstChild);
  }
}
export function getElementFullSize(element) {
  const rect = element.getBoundingClientRect();
  const styles = window.getComputedStyle(element);

  const marginX = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
  const marginY = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);

  const totalWidth = parseFloat(rect.width + marginX);
  const totalHeight = parseFloat(rect.height + marginY);
  return { width: totalWidth, height: totalHeight }
}

export function getElementMarginsSize(element) {
  const styles = window.getComputedStyle(element);

  const marginX = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
  const marginY = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
  return { x: marginX, y: marginY }
}


export function calculateFontSizeByWord(targetWidth, text, maxFontSize = 30) {
  // const avgCharWidth = 1;
  const charCount = text.length;

  // Расчет: ширина = количество_символов * средняя_ширина * размер_шрифта
  let fontSize = targetWidth / charCount;

  // Ограничение максимальным размером
  fontSize = Math.min(fontSize, maxFontSize);

  // Ограничение минимальным размером
  fontSize = Math.max(fontSize, 8);

  return Math.floor(fontSize);
}

export function calculateFontSizeByWords(targetWidth, text, maxFontSize = 30) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  const testSize = 100;
  context.font = `${testSize}px main_font_regular`;

  const textWidth = context.measureText(text).width;
  canvas.remove()
  return (targetWidth / textWidth) * testSize;
  // return maxSize;
}
export function show_element(e, display_value = "block") {
  e.style.display = display_value
}
export function hide_element(e) {
  e.style.display = "none"
}
// if (current_page_id != null) {
//   current_animate_object.style.animationName = close_animation_name;
//   current_animate_object.style.animationDuration = `${close_animation_duration}s`;
//   setTimeout(() => {
//     current_page.style.display = "none";
//     next_animate_object.style.animationName = open_animation_name;
//     next_animate_object.style.animationDuration = `${open_animation_duration}s`;
//     next_page.style.display = "block";
//   }, close_animation_duration * 1000)

// } else {

//   next_animate_object.style.animationName = open_animation_name;
//   next_animate_object.style.animationDuration = `${open_animation_duration}s`;
//   next_page.style.display = "block";

// }





// Фигня: (Без учёта сдвига по временной зоне)
// function getLocalDate() {
//     var today = new Date();
//     var dd = String(today.getDate()).padStart(2, '0');
//     var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
//     var yyyy = today.getFullYear();

//     today = yyyy + '-' + mm + '-' + dd;
//     return today;
// }