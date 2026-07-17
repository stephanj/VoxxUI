import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AppDocSectionText } from '@/components/doc/app.docsectiontext';

@Component({
    changeDetection: ChangeDetectionStrategy.Eager,
    selector: 'helpneeded-doc',
    standalone: true,
    imports: [AppDocSectionText],
    template: `
        <app-docsectiontext>
            <p>VoxxUI is a community-driven project backed by the expertise and sponsorship of PrimeTek, and we appreciate any help you can provide. Here are some areas where you can contribute:</p>
            <h3>Issue Triage</h3>
            <p>Help us manage issues by;</p>
            <ul class="list-disc list-inside line-height-3 px-10 m-0">
                <li>Reproducing reported bugs</li>
                <li>Clarifying issue descriptions</li>
                <li>Tagging issues with appropriate labels</li>
            </ul>

            <h3>Sending Pull Requests</h3>
            <p>We encourage you to send pull requests, especially for issues tagged with the <i>help-needed</i> label.</p>

            <h3>Community Support</h3>
            <p>
                Assist other users by participating in the issue tracker, <a href="https://github.com/orgs/primefaces/discussions/categories/primeng" target="_blank" rel="noopener noreferrer">GitHub discussions</a>, and the
                <a href="https://discord.com/invite/gzKFYnpmCY" target="_blank" rel="noopener noreferrer">PrimeLand Discord</a> server. Your expertise can help others solve problems and improve their experience with VoxxUI.
            </p>
        </app-docsectiontext>
    `
})
export class HelpNeededDoc {}
