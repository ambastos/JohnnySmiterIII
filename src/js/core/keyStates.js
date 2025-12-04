export class KeyStates {
    constructor() {
        this.states = {};
        document.addEventListener("keydown", this.keydown.bind(this));
        document.addEventListener("keyup", this.keyup.bind(this));
        [...document.querySelectorAll(".key")].map((el) => {
            var timer;
            el.addEventListener("touchstart", (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.states[el.dataset.key] = true;
                clearTimeout(timer);
            })
            document.addEventListener("touchend", (e) => {
                timer = setTimeout(() => {
                    this.states[el.dataset.key] = false;
                }, 100);
            })
        });
    }
    keydown(e) {
        this.states[e.keyCode] = true;
    }
    keyup(e) {
        this.states[e.keyCode] = false;
    }
}