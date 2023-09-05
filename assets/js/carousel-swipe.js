import Carousel from './carousel.js';
class SwipeCarousel extends Carousel {
  constructor(...args) {
    super(...args);
    this.slidesContainer = this.slideItems[0].parentElement;
  }
  _initListeners() {
    super._initListeners();
    this.container.addEventListener('touchstart', this._swipeStart.bind(this));
    this.slidesContainer.addEventListener(
      'mousedown',
      this._swipeStart.bind(this)
    );
    this.container.addEventListener('touchend', this._swipeEnd.bind(this));
    this.slidesContainer.addEventListener('mouseup', this._swipeEnd.bind(this));
  }
  _swipeStart(e) {
    if (e instanceof MouseEvent) {
      this.startPosX = e.pageX;
      return;
    }

    if (e instanceof TouchEvent) {
      this.startPosX = e.changedTouches[0].pageX;
    }
    this.startPosX =
      e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX;
  }
  _swipeEnd(e) {
    if (e instanceof MouseEvent) {
      this.endPosX = e.pageX;
    } else if (e instanceof TouchEvent) {
      this.endPosX = e.changedTouches[0].pageX;
    }
    this.endPosX =
      e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX;

    if (this.endPosX - this.startPosX > 100) this.prev();
    if (this.endPosX - this.startPosX < -100) this.next();
  }
}
export default SwipeCarousel;
