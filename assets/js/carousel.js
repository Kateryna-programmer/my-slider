function Carousel(containerID = '#carousel', slideID = '.slide') {
  this.container = document.querySelector(containerID);
  this.slides = this.container.querySelectorAll(slideID);
}
Carousel.prototype = {
  _initProps() {
    this.SLIDES_COUNT = this.slides.length;
    this.CODE_ARROW_LEFT = 'ArrowLeft';
    this.CODE_ARROW_RIGHT = 'ArrowRight';
    this.CODE_SPACE = 'Space';
    this.FA_PAUSE = '<i class="far fa-pause-circle"></i>';
    this.FA_PLAY =
      '<i class="far fa-play-circle" style="font-size:70px; color:white"></i>';
    this.FA_PREV =
      '<i class="fa-solid fa-chevron-left"style="font-size:70px; color:white"></i>';
    this.FA_NEXT =
      '<i class="fa-solid fa-chevron-right" style="font-size:70px; color:white"></i>';

    this.INTERVAL = 2000;
    this.currentSlide = 0;
    this.timerID = null;
    this.isPlaying = true;
    this.startPosX = null;
    this.endPosX = null;
  },

  _initControls: function () {
    const controls = document.createElement('div');
    controls.setAttribute('id', 'controls-container');
    controls.setAttribute('class', 'controls');
    const PAUSE = `<span id="pause-btn" class="control-pause">${this.FA_PAUSE}</span>`;
    const PREV = `<span id="prev-btn" class="control-prev">${this.FA_PREV}</span>`;
    const NEXT = `<span id="next-btn" class="control-next">${this.FA_NEXT}</span>`;
    controls.innerHTML = PAUSE + PREV + NEXT;
    this.container.append(controls);

    this.pauseBtn = this.container.querySelector('#pause-btn');
    this.prevBtn = this.container.querySelector('#prev-btn');
    this.nextBtn = this.container.querySelector('#next-btn');
  },
  _initIndicators: function () {
    const indicators = document.createElement('div');

    indicators.setAttribute('id', 'indicators-container');
    indicators.setAttribute('class', 'indicators');

    for (let i = 0; i < this.SLIDES_COUNT; i++) {
      const indicator = document.createElement('div');

      indicator.setAttribute('class', i ? 'indicator' : 'indicator active');
      indicator.dataset.slideTo = `${i}`;
      indicators.append(indicator);
    }

    this.container.append(indicators);

    this.indicatorsContainer = this.container.querySelector('.indicators');
    this.indicatorItems = this.container.querySelectorAll('.indicator');
  },

  // start
  _gotoNth: function (n) {
    this.slides[this.currentSlide].classList.toggle('active');
    this.indicatorItems[this.currentSlide].classList.toggle('active');
    this.currentSlide = (n + this.SLIDES_COUNT) % this.SLIDES_COUNT;
    this.slides[this.currentSlide].classList.toggle('active');
    this.indicatorItems[this.currentSlide].classList.toggle('active');
  },

  // make timer
  _timer: function () {
    this.timerID = setInterval(this._gotoNext.bind(this), this.INTERVAL);
  },

  _gotoPrev: function () {
    this._gotoNth(this.currentSlide - 1);
  },

  _gotoNext: function () {
    this._gotoNth(this.currentSlide + 1);
  },

  // make controls
  pause: function () {
    if (!this.isPlaying) return;
    this.pauseBtn.innerHTML = this.FA_PLAY;
    this.isPlaying = !this.isPlaying;
    clearInterval(this.timerID);
  },

  play: function () {
    this.pauseBtn.innerHTML = this.FA_PAUSE;
    this.isPlaying = !this.isPlaying;
    this._timer();
  },

  pausePlay: function () {
    if (this.isPlaying) this.pause();
    else this.play();
  },

  prev: function () {
    this.pause();
    this._gotoPrev();
  },

  next: function () {
    this.pause();
    this._gotoNext();
  },

  // make indicators
  _indicateHandler: function (e) {
    const { target } = e;
    if (target && target.classList.contains('indicator')) {
      this.pause();
      this._gotoNth(+target.dataset.slideTo);
    }
  },

  // make controls
  _pressKey: function (e) {
    const { code } = e;
    e.preventDefault();
    if (code === this.CODE_ARROW_LEFT) this.prev();
    if (code === this.CODE_ARROW_RIGHT) this.next();
    if (code === this.CODE_SPACE) this.pausePlay();
  },

  // make listeners
  _initListeners: function () {
    this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
    this.nextBtn.addEventListener('click', this.next.bind(this));
    this.prevBtn.addEventListener('click', this.prev.bind(this));
    this.indicatorsContainer.addEventListener(
      'click',
      this._indicateHandler.bind(this)
    );
    document.addEventListener('keydown', this._pressKey.bind(this));
  },

  // init
  init: function () {
    this._initProps();
    this._initControls();
    this._initIndicators();
    this._initListeners();
    this._timer();
  },
};
Carousel.prototype.constructor = Carousel;
