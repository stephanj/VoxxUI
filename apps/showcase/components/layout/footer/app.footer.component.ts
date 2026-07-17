import { ChangeDetectionStrategy, Component } from '@angular/core';
import packageJson from '../../../package.json';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
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
    version = packageJson.version;
}
