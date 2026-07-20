import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, input, NgModule, TemplateRef } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'vx-header',
    template: '<ng-content></ng-content>'
})
export class Header {}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'vx-footer',
    template: '<ng-content></ng-content>'
})
export class Footer {}

@Directive({
    selector: '[vxTemplate]'
})
export class PrimeTemplate {
    type = input<string | undefined>();

    name = input<string | undefined>(undefined, { alias: 'vxTemplate' });

    constructor(public template: TemplateRef<any>) {}

    getType(): string {
        return this.name()!;
    }
}

@NgModule({
    imports: [CommonModule, PrimeTemplate, Header, Footer],
    exports: [Header, Footer, PrimeTemplate]
})
export class SharedModule {}
