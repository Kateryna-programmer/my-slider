class Carousel {
  constructor(p) {
    const settings = {
      ...{
        containerID: '#carousel',
        interval: 5000,
        slideID: '.slide',
        isPlaying: true,
      },
      ...p,
    };
    this.container = document.querySelector(settings.containerID);
    this.slideItems = this.container.querySelectorAll(settings.slideID);

    this.interval = settings.interval;
    this.isPlaying = settings.isPlaying;
  }

  _initProps() {
    this.SLIDES_COUNT = this.slideItems.length;
    this.CODE_ARROW_LEFT = 'ArrowLeft';
    this.CODE_ARROW_RIGHT = 'ArrowRight';
    this.CODE_SPACE = 'Space';
    this.FA_PAUSE =
      '<i class="far fa-pause-circle" style="font-size:70px; color:white"></i>';
    this.FA_PLAY =
      '<i class="far fa-play-circle" style="font-size:70px; color:white"></i>';
    this.FA_PREV =
      '<i class="fa-solid fa-chevron-left"style="font-size:70px; color:white"></i>';
    this.FA_NEXT =
      '<i class="fa-solid fa-chevron-right" style="font-size:70px; color:white"></i>';
    this.currentSlide = 0;
  }
  _initControls() {
    let controls = document.createElement('div');
    const PREV = `<span id="prev-btn" class="control-prev">${this.FA_PREV}</span>`;
    const NEXT = `<span id="next-btn" class="control-next">${this.FA_NEXT}</span>`;
    controls.setAttribute('class', 'controls');
    controls.innerHTML = PREV + NEXT;
    this.container.append(controls);
    this.nextBtn = this.container.querySelector('#next-btn');
    this.prevBtn = this.container.querySelector('#prev-btn');
  }
  _initPauseAndPlay() {
    let pausePlay = document.createElement('div');
    const PAUSE = `<span id="pause-btn" class="control-pause">${
      this.isPlaying ? this.FA_PAUSE : this.FA_PLAY
    }</span>`;
    pausePlay.setAttribute('class', 'pause-play');
    pausePlay.innerHTML = PAUSE;
    this.container.insertAdjacentElement('afterEnd', pausePlay);
    this.pauseBtn = pausePlay.querySelector('#pause-btn');
  }

  _initIndicators() {
    const indicators = document.createElement('div');

    indicators.setAttribute('id', 'indicators-container');
    indicators.setAttribute('class', 'indicators');

    for (let i = 0; i < this.SLIDES_COUNT; i++) {
      const indicator = document.createElement('div');

      indicator.setAttribute(
        'class',
        i === 0 ? 'indicator active' : 'indicator'
      );
      indicator.dataset.slideTo = `${i}`;
      indicators.append(indicator);
    }

    this.container.append(indicators);

    this.indicatorsContainer = this.container.querySelector('.indicators');
    this.indicatorItems = this.container.querySelectorAll('.indicator');
  }

  _timer() {
    if (!this.isPlaying) return;
    if (this.timerID) return;
    this.timerID = setInterval(this._gotoNext.bind(this), this.interval);
  }

  _gotoNth(n) {
    this.slideItems[this.currentSlide].classList.toggle('active');
    this.indicatorItems[this.currentSlide].classList.toggle('active');
    this.currentSlide = (n + this.SLIDES_COUNT) % this.SLIDES_COUNT;
    this.slideItems[this.currentSlide].classList.toggle('active');
    this.indicatorItems[this.currentSlide].classList.toggle('active');
  }

  _gotoPrev() {
    this._gotoNth(this.currentSlide - 1);
  }

  _gotoNext() {
    this._gotoNth(this.currentSlide + 1);
  }

  pause() {
    if (!this.isPlaying) return;
    clearInterval(this.timerID);
    this.pauseBtn.innerHTML = this.FA_PLAY;
    this.isPlaying = false;
    this.timerID = null;
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.pauseBtn.innerHTML = this.FA_PAUSE;
    this._timer();
  }

  pausePlay() {
    this.isPlaying ? this.pause() : this.play();
  }

  prev() {
    this.pause();
    this._gotoPrev();
  }

  next() {
    this.pause();
    this._gotoNext();
  }

  _indicateHandler(e) {
    const { target } = e;
    if (target && target.classList.contains('indicator')) {
      this.pause();
      this._gotoNth(+target.dataset.slideTo);
    }
  }

  _pressKey(e) {
    const { code } = e;
    e.preventDefault();
    if (code === this.CODE_ARROW_LEFT) this.prev();
    if (code === this.CODE_ARROW_RIGHT) this.next();
    if (code === this.CODE_SPACE) this.pausePlay();
  }

  _initListeners() {
    this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
    this.nextBtn.addEventListener('click', this.next.bind(this));
    this.prevBtn.addEventListener('click', this.prev.bind(this));
    this.indicatorsContainer.addEventListener(
      'click',
      this._indicateHandler.bind(this)
    );
    this.container.addEventListener('mouseenter', this.pause.bind(this));
    this.container.addEventListener('mouseleave', this.play.bind(this));
    document.addEventListener('keydown', this._pressKey.bind(this));
  }

  init() {
    this._initProps();
    this._initControls();
    this._initPauseAndPlay();
    this._initIndicators();
    this._initListeners();
    this._timer();
  }
}

export default Carousel;
