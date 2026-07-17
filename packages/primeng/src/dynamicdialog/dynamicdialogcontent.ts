import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[vxDynamicDialogContent]',
    standalone: true
})
export class DynamicDialogContent {
    constructor(public viewContainerRef: ViewContainerRef) {}
}
