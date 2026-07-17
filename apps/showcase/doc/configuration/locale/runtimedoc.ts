import { Code } from '@/domain/code';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'ngx-translate-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>The translations can be changed dynamically at runtime, here is an example with ngx-translate.</p>
        </app-docsectiontext>
        <app-code [code]="code" [hideToggleCode]="true"></app-code>
    `
})
export class RuntimeDoc {
    code: Code = {
        typescript: `
import { Component, OnInit } from '@angular/core';
import { VoxxUI } from 'voxx-ui/config';
import { TranslateService } from '@ngx-translate/core';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(private config: VoxxUI, private translateService: TranslateService) {}

    ngOnInit() {
        this.translateService.setDefaultLang('en');
    }

    translate(lang: string) {
        this.translateService.use(lang);
        this.translateService.get('primeng').subscribe(res => this.primeng.setTranslation(res));
    }
}`
    };
}
