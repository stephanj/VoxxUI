import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'locale-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>
                Locale for different languages and formats is defined globally, refer to the
                <a href="/configuration/#locale">VoxxUI Locale</a> configuration for more information.
            </p>
        </app-docsectiontext>
    `
})
export class LocaleDoc {}
