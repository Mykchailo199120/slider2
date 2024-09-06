class Slider {
    constructor(selector, config = {}) {
        this.sliderList = document.querySelector(selector);
        this.slides = this.sliderList.querySelectorAll(".slider");
        this.currentIndex = 0;
        this.config = Object.assign(
            {
                interval: 5000,
                showIndicators: true,
                showControls: true,
            },
            config
        );
        this.autoSlide = null;
        this.paused = false;


        this.init();
    }


    updateIndicators() {
        if (!this.indicators) return;
        this.indicators.forEach((indicator) => indicator.classList.remove("active"));
        this.indicators[this.currentIndex].classList.add("active");
    }


    moveSlider(index) {
        const slideWidth = this.slides[0].clientWidth;
        this.sliderList.style.transform = `translateX(-${index * slideWidth}px)`;
        this.currentIndex = index;
        this.updateIndicators();
    }


    startSlide() {
        if (this.autoSlide) clearInterval(this.autoSlide);
        this.autoSlide = setInterval(() => {
            this.currentIndex =
                this.currentIndex < this.slides.length - 1
                    ? this.currentIndex + 1
                    : 0;
            this.moveSlider(this.currentIndex);
        }, this.config.interval);
    }


    stopSlide() {
        clearInterval(this.autoSlide);
        this.autoSlide = null;
    }


    handleKeyboard(event) {
        switch (event.key) {
            case "ArrowLeft":
                this.prevSlide();
                break;
            case "ArrowRight":
                this.nextSlide();
                break;
            default:
                break;
        }
    }


    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.moveSlider(this.currentIndex);
        }
        this.stopSlide();
        if (!this.paused) this.startSlide();
    }


    nextSlide() {
        if (this.currentIndex < this.slides.length - 1) {
            this.currentIndex++;
            this.moveSlider(this.currentIndex);
        }
        this.stopSlide();
        if (!this.paused) this.startSlide();
    }


    init() {
        document.addEventListener("keydown", this.handleKeyboard.bind(this));
        if (this.config.showControls) this.createControls();
        if (this.config.showIndicators) this.createIndicators();
        this.addHoverListeners(); // Додавання автоматичної паузи при наведенні миші
        this.startSlide();
    }


    createControls() {
        const controlsContainer = document.createElement("div");
        controlsContainer.className = "controls";

        this.prevButton = document.createElement("button");
        this.prevButton.className = "prev";
        this.prevButton.textContent = "Previous";
        controlsContainer.appendChild(this.prevButton);

        this.nextButton = document.createElement("button");
        this.nextButton.className = "next";
        this.nextButton.textContent = "Next";
        controlsContainer.appendChild(this.nextButton);

        this.pauseButton = document.createElement("button");
        this.pauseButton.className = "pause";
        this.pauseButton.textContent = "Pause";
        controlsContainer.appendChild(this.pauseButton);

        document.body.appendChild(controlsContainer);

        this.bindControlEvents();
    }


    bindControlEvents() {
        this.prevButton.addEventListener("click", () => this.prevSlide());
        this.nextButton.addEventListener("click", () => this.nextSlide());

        this.pauseButton.addEventListener("click", () => {
            if (this.paused) {
                this.startSlide();
                this.pauseButton.textContent = "Pause";
            } else {
                this.stopSlide();
                this.pauseButton.textContent = "Play";
            }
            this.paused = !this.paused;
        });
    }


    createIndicators() {
        const indicatorContainer = document.createElement("div");
        indicatorContainer.className = "slider-indicator";

        this.indicators = [];
        this.slides.forEach((_, index) => {
            const indicator = document.createElement("button");
            indicator.className = "indicator";
            indicator.textContent = index + 1;
            indicator.setAttribute("data-index", index);
            indicatorContainer.appendChild(indicator);
            this.indicators.push(indicator);
        });

        document.body.appendChild(indicatorContainer);
        this.bindIndicatorEvents();
    }


    bindIndicatorEvents() {
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener("click", () => {
                this.stopSlide();
                this.moveSlider(index);
                if (!this.paused) this.startSlide();
            });
        });
    }


    addHoverListeners() {
        this.sliderList.addEventListener("mouseenter", () => this.stopSlide());
        this.sliderList.addEventListener("mouseleave", () => {
            if (!this.paused) this.startSlide();
        });
    }
}


const slider = new Slider(".slider-list", {
    interval: 3000,
    showIndicators: true,
    showControls: true,
});

