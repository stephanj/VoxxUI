import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    standalone: true,
    template: `
        <div class="layout-footer">
            <div>
                <span>VoxxUI {{ version }} &mdash; MIT licensed fork of </span>
                <a href="https://github.com/primefaces/primeng">PrimeNG</a>
                <span> by PrimeTek</span>
            </div>
        </div>
    `
})
export class AppFooterComponent {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    version = require('package.json') && require('package.json').version;
}
