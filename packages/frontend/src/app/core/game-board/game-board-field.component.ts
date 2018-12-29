import { Component, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import * as $ from 'jquery';

/**
 * Component for single game board field.
 */
@Component({
  selector: 'game-board-field',
  templateUrl: './game-board-field.component.html',
  styleUrls: ['game-board-field.component.scss']
})
export class GameBoardFieldComponent {
  /**
   * Scale factor of text size relative to containing
   * container.
   */
  static FONT_SCALE_FACTOR = 0.45;

  /**
   * CSS attribute name for font-size.
   */
  static CSS_ATTRIBUTE_FONT_SIZE = 'font-size';

  /**
   * Reference on container element.
   */
  @ViewChild('container')
  private _containerElRef: ElementRef;

  /**
   * Reference on text element.
   */
  @ViewChild('text')
  private _textElRef: ElementRef;

  /**
   * Source of click events.
   */
  private _clickSource = new Subject();

  /**
   * Click events observable.
   */
  private _click$ = this._clickSource.asObservable();

  /**
   * After view init.
   */
  public ngAfterViewInit() {
    this.adjustFontWidth();
  }

  /**
   * Adjust font size of player icons on field.
   */
  // TODO: Find way to do this without jQuery.
  private adjustFontWidth() {
    const $container = $(this._containerElRef.nativeElement);
    const $text = $(this._textElRef.nativeElement);
    const fontScaleFactor = GameBoardFieldComponent.FONT_SCALE_FACTOR;
    const fontSize = $container.outerWidth() * fontScaleFactor;
    $text.css(GameBoardFieldComponent.CSS_ATTRIBUTE_FONT_SIZE, fontSize);
  }

  /**
   * Handle click events on field.
   * */
  public onClick() {
    this._clickSource.next({ field: this.field });
  }

  /**
   * Field data.
   */
  @Input() public field;

  /**
   * Click events observable.
   */
  @Output()
  public get click$() {
    return this._click$;
  }
}
