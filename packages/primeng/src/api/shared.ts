import { CommonModule } from '@angular/common';
import { Component, Directive, Input, NgModule, TemplateRef } from '@angular/core';

@Component({
    selector: 'vx-header',
    template: '<ng-content></ng-content>',
    standalone: false
})
export class Header {}

@Component({
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
