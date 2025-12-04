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
            var f = () => {
                clearTimeout(timer);
                document.removeEventListener('keydown', f);
                document.removeEventListener('click', f);
                document.body.removeChild(this.speech);
                r();
            }
            if (!this.nokey) document.addEventListener('keydown', f);
            if (!this.nokey) document.addEventListener('click', f);
            var timer = setTimeout(f, this.time);

        });
    }
}