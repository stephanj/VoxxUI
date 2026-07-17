import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ButtonModule } from 'voxx-ui/button';
import { DialogService, DynamicDialog, DynamicDialogRef } from 'voxx-ui/dynamicdialog';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: true,
    imports: [ButtonModule],
    template: `
        <div>
            <p>
                There are <strong>{{ totalProducts }}</strong> products in total in this list.
            </p>
            <div class="flex justify-end">
                <vx-button type="button" label="Close" (click)="close()"></vx-button>
            </div>
        </div>
    `
})
export class InfoDemo implements OnInit {
    totalProducts: number = 0;

    instance: DynamicDialog | undefined;

    constructor(
        public ref: DynamicDialogRef,
        private dialogService: DialogService
    ) {
        this.instance = this.dialogService.getInstance(this.ref);
    }

    ngOnInit() {
        if (this.instance && this.instance.data) {
            this.totalProducts = this.instance.data['totalProducts'];
        }
    }

    close() {
        this.ref.close();
    }

    ngOnDestroy() {
        if (this.ref) {
            this.ref.close();
        }
    }
}
