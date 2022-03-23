/* Conseil de tenir l'appareil verticalement */
function onResizeEvent() {
    if (window.innerHeight + 100 < window.innerWidth) {
        alert("Il est conseillé de tenir l'appareil à la verticale.");
    }
}

if (window.addEventListener) {  // all browsers except IE before version 9
    window.addEventListener("resize", onResizeEvent, true);
} else {
    if (window.attachEvent) {   // IE before version 9
        window.attachEvent("onresize", onResizeEvent);
    }
}
