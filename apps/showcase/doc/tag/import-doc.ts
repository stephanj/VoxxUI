import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Code } from '@/domain/code';
import { AppCode } from '@/components/doc/app.code';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'import-doc',
    standalone: true,
    imports: [AppCode],
    template: ` <app-code [code]="code" [hideToggleCode]="true"></app-code> `
})
export class ImportDoc {
    code: Code = {
        typescript: `import { TagModule } from 'voxx-ui/tag';`
    };
}
