import { AppDocSectionText } from '@/components/doc/app.docsectiontext';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TagModule } from 'voxx-ui/tag';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'v21-deprecations-doc',
    standalone: true,
    imports: [TagModule, AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>The following items are marked as deprecated.</p>
            <div class="doc-tablewrapper">
                <table class="doc-table">
                    <thead>
                        <tr>
                            <th>API</th>
                            <th class="whitespace-nowrap">Deprecated Since</th>
                            <th>Replacement</th>
                            <th>Removal</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>showTransitionOptions</td>
                            <td>v21</td>
                            <td>Native CSS animatons</td>
                            <td>v22</td>
                            <td><vx-tag value="deprecated" severity="warn" /></td>
                        </tr>
                        <tr>
                            <td>hideTransitionOptions</td>
                            <td>v21</td>
                            <td>Native CSS animatons</td>
                            <td>v22</td>
                            <td><vx-tag value="deprecated" severity="warn" /></td>
                        </tr>
                        <tr>
                            <td>Directive PT attribute names e.g. ptInputText</td>
                            <td>v21</td>
                            <td>PT suffix at the end e.g. vxInputTextPT</td>
                            <td>v22</td>
                            <td><vx-tag value="deprecated" severity="warn" /></td>
                        </tr>
                        <tr>
                            <td>contextMenuSelectionMode</td>
                            <td>v21</td>
                            <td>"joint" mode will be removed in favor of the "separate". Applies to Tree, TreeTable and Table.</td>
                            <td>v22</td>
                            <td><vx-tag value="deprecated" severity="warn" /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </app-docsectiontext>
    `
})
export class DeprecationsDoc {}
