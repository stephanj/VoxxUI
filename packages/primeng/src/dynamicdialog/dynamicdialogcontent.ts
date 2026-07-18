import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[vxDynamicDialogContent]'
})
export class DynamicDialogContent {
    constructor(public viewContainerRef: ViewContainerRef) {}
}
