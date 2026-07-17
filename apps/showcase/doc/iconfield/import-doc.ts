import { Code } from '@/domain/code';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppCodeModule } from '@/components/doc/app.code';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'import-doc',
    standalone: true,
    imports: [AppCodeModule],
    template: `<app-code [code]="code" [hideToggleCode]="true"></app-code> `
})
export class ImportDoc {
    code: Code = {
        typescript: `import { IconFieldModule } from 'voxx-ui/iconfield';
import { InputIconModule } from 'voxx-ui/inputicon';`
    };
}
