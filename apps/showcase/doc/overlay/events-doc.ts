import { AppCode } from '@/components/doc/app.code';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'events-doc',
    standalone: true,
    imports: [AppCode],
    template: ` <section class="py-6">
        <app-code [hideToggleCode]="true"></app-code>
    </section>`
})
export class EventsDoc {}
