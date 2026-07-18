import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseIcon } from 'voxx-ui/icons/baseicon';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: '[data-p-icon="blank"]',
    template: ` <svg:rect width="1" height="1" fill="currentColor" fill-opacity="0" /> `
})
export class BlankIcon extends BaseIcon {}
