import { Routes } from '@angular/router';
import { AccessibilityDemoComponent } from './accessibility/accessibilitydemo';
import { RTLDemoComponent } from './rtl/rtldemo';
import { AnimationsDemoComponent } from './animations/animationsdemo';

export default [
    { path: '', redirectTo: 'accessibility', pathMatch: 'full' },
    { path: 'accessibility', component: AccessibilityDemoComponent },
    { path: 'animations', component: AnimationsDemoComponent },
    { path: 'rtl', component: RTLDemoComponent }
] satisfies Routes;
