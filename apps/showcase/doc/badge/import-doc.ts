import { Code } from '@/domain/code';
import { ChangeDetectionStrategy, Component } from '@angular/core';
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
        typescript: `import { BadgeModule } from 'voxx-ui/badge';`
    };
}
