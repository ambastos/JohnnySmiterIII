
//class responsible to draw the messages(bubbles messages)
export class MessageBubble {
    constructor(text, x, y, time, nokey) {
        this.nokey = nokey;
        this.time = time;
        var speech = document.createElement("div");
        speech.className = "bubble";
        speech.style.left = x * SCALE / SCALE2 + "px";
        speech.style.top = y * SCALE / SCALE2 + "px";
        speech.innerHTML = text;
        this.speech = speech;
    }
    show() {
        document.body.appendChild(this.speech);
        return new Promise((r) => {
            var callback = () => {
                clearTimeout(timer);
                document.removeEventListener('keydown', callback);
                document.removeEventListener('click', callback);
                document.body.removeChild(this.speech);
                r();
            }
            if (!this.nokey) document.addEventListener('keydown', callback);
            if (!this.nokey) document.addEventListener('click', callback);
            var timer = setTimeout(callback, this.time);

        });
    }
}