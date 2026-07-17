import { Code } from '@/domain/code';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { AppCode } from '@/components/doc/app.code';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'download-doc',
    standalone: true,
    imports: [AppDocSectionText, AppCode],
    template: `
        <app-docsectiontext>
            <p>VoxxUI is available for download on the <a href="https://www.npmjs.com/package/primeng">npm registry</a>.</p>
        </app-docsectiontext>
        <app-code [code]="code" [hideToggleCode]="true"></app-code>
    `
})
export class DownloadDoc {
    code: Code = {
        command: `# Using npm
npm install voxx-ui @primeuix/themes

# Using yarn
yarn add primeng @primeuix/themes

# Using pnpm
pnpm add voxx-ui @primeuix/themes`
    };
}
