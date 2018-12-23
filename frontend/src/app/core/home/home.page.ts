import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Home page.
 */
@Component({
  templateUrl: './home.page.html'
})
export class HomePage implements OnInit {
  constructor(private _router: Router) {}

  /**
   * Page init.
   */
  public ngOnInit() {
    // Automatically navigate to start page.
    // TODO: Navigate to proper page based on contract state.
    this._router.navigate(['/start']);
  }
}
