import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, Input, NgModule, TemplateRef } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'vx-header',
    template: '<ng-content></ng-content>',
    standalone: false
})
export class Header {}

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'vx-footer',
    template: '<ng-content></ng-content>',
    standalone: false
})
export class Footer {}

@Directive({
    selector: '[vxTemplate]',
    standalone: true
})
export class PrimeTemplate {
    @Input() type: string | undefined;

    @Input('vxTemplate') name: string | undefined;

    constructor(public template: TemplateRef<any>) {}

    getType(): string {
        return this.name!;
    }
}

@NgModule({
    imports: [CommonModule, PrimeTemplate],
    exports: [Header, Footer, PrimeTemplate],
    declarations: [Header, Footer]
})
export class SharedModule {}
