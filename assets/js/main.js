(function () {
  const container = document.querySelector('#carousel');
  const slides = container.querySelectorAll('.slide');
  const indicatorsContainer = container.querySelector('#indicators-container');
  const indicatorItems = indicatorsContainer.querySelectorAll('.indicator');
  const controlsContainer = container.querySelector('#controls-container');
  const pauseBtn = controlsContainer.querySelector('#pause-btn');
  const prevBtn = controlsContainer.querySelector('#prev-btn');
  const nextBtn = controlsContainer.querySelector('#next-btn');

  const SLIDES_COUNT = slides.length;
  const CODE_ARROW_LEFT = 'ArrowLeft';
  const CODE_ARROW_RIGHT = 'ArrowRight';
  const CODE_SPACE = 'Space';
  const FA_PAUSE = '<i class="far fa-pause-circle"></i>';
  const FA_PLAY =
    '<i class="far fa-play-circle" style="font-size:70px; color:white"></i>';
  const INTERVAL = 2000;

  let currentSlide = 0;
  let timerID = null;
  let isPlaying = true;
  let startPosX = null;
  let endPosX = null;

  // start
  function gotoNth(n) {
    slides[currentSlide].classList.toggle('active');
    indicatorItems[currentSlide].classList.toggle('active');
    currentSlide = (n + SLIDES_COUNT) % SLIDES_COUNT;
    slides[currentSlide].classList.toggle('active');
    indicatorItems[currentSlide].classList.toggle('active');
  }

  // make timer
  function timer() {
    timerID = setInterval(gotoNext, INTERVAL);
  }

  function gotoPrev() {
    gotoNth(currentSlide - 1);
  }

  function gotoNext() {
    gotoNth(currentSlide + 1);
  }

  // make controls
  function pauseHandler() {
    if (!isPlaying) return;
    pauseBtn.innerHTML = FA_PLAY;
    isPlaying = !isPlaying;
    clearInterval(timerID);
  }

  function playHandler() {
    pauseBtn.innerHTML = FA_PAUSE;
    isPlaying = !isPlaying;
    timer();
  }

  function pausePlayHandler() {
    if (isPlaying) pauseHandler();
    else playHandler();
  }

  function prevHandler() {
    pauseHandler();
    gotoPrev();
  }

  function nextHandler() {
    pauseHandler();
    gotoNext();
  }

  // make indicators
  function indicateHandler(e) {
    const { target } = e;
    if (target && target.classList.contains('indicator')) {
      pauseHandler();
      gotoNth(+target.dataset.slideTo);
    }
  }

  // make controls
  function pressKey(e) {
    const { code } = e;
    e.preventDefault();
    if (code === CODE_ARROW_LEFT) prevHandler();
    if (code === CODE_ARROW_RIGHT) nextHandler();
    if (code === CODE_SPACE) pausePlayHandler();
  }

  // make swipe
  function swipeStart(e) {
    if (e instanceof MouseEvent) {
      startPosX = e.pageX;
      return;
    }

    if (e instanceof TouchEvent) {
      startPosX = e.changedTouches[0].pageX;
    }
    startPosX = e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX;
  }

  function swipeEnd(e) {
    if (e instanceof MouseEvent) {
      endPosX = e.pageX;
    } else if (e instanceof TouchEvent) {
      endPosX = e.changedTouches[0].pageX;
    }
    endPosX = e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX;

    if (endPosX - startPosX > 100) prevHandler();
    if (endPosX - startPosX < -100) nextHandler();
  }

  // make listeners
  function initListeners() {
    pauseBtn.addEventListener('click', pausePlayHandler);
    nextBtn.addEventListener('click', nextHandler);
    prevBtn.addEventListener('click', prevHandler);
    indicatorsContainer.addEventListener('click', indicateHandler);
    container.addEventListener('touchstart', swipeStart);
    container.addEventListener('mousedown', swipeStart);
    container.addEventListener('touchend', swipeEnd);
    container.addEventListener('mouseup', swipeEnd);
    document.addEventListener('keydown', pressKey);
  }

  // init
  function init() {
    initListeners();
    timer();
  }

  init();
})();
