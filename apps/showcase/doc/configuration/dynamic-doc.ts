import { Code } from '@/domain/code';
import { Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';

@Component({
    selector: 'dynamic-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>Inject the <i>VoxxUI</i> to your application to update the initial configuration at runtime.</p>
        </app-docsectiontext>
        <app-code [code]="code" [hideToggleCode]="true"></app-code>
    `
})
export class DynamicDoc {
    code: Code = {
        typescript: `import { Component, OnInit } from '@angular/core';
import { VoxxUI } from 'voxx-ui/config';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(private primeng: VoxxUI) {}

    ngOnInit() {
        this.primeng.ripple.set(true);
    }
}`
    };
}
