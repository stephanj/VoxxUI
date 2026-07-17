import { AppMainComponent } from '@/components/layout/app.main.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'installation', pathMatch: 'full' },
    {
        path: '',
        component: AppMainComponent,
        children: [
            { path: 'accessibility', redirectTo: 'guides/accessibility', pathMatch: 'full' },
            { path: 'theming', redirectTo: 'theming/styled', pathMatch: 'full' },
            { path: 'uikit/guide', redirectTo: 'uikit/guide/v3', pathMatch: 'full' },
            { path: 'autocomplete', loadChildren: () => import('@/pages/autocomplete/routes') },
            {
                path: 'installation',
                loadChildren: () => import('@/pages/installation/routes')
            },
            {
                path: 'configuration',
                loadChildren: () => import('@/pages/configuration/routes')
            },
            { path: 'playground', loadChildren: () => import('@/pages/playground/routes') },
            { path: 'roadmap', loadChildren: () => import('@/pages/roadmap/routes') },
            { path: 'team', loadChildren: () => import('@/pages/team/routes') },
            {
                path: 'theming',
                loadChildren: () => import('@/pages/theming/routes')
            },
            { path: 'icons', loadChildren: () => import('@/pages/icons/routes') },
            {
                path: 'customicons',
                loadChildren: () => import('@/pages/customicons/routes')
            },
            { path: 'passthrough', loadChildren: () => import('@/pages/passthrough/routes') },
            { path: 'accordion', loadChildren: () => import('@/pages/accordion/routes') },
            { path: 'avatar', loadChildren: () => import('@/pages/avatar/routes') },
            { path: 'badge', loadChildren: () => import('@/pages/badge/routes') },
            { path: 'button', loadChildren: () => import('@/pages/button/routes') },
            {
                path: 'datepicker',
                loadChildren: () => import('@/pages/datepicker/routes')
            },
            { path: 'card', loadChildren: () => import('@/pages/card/routes') },
            { path: 'chart', loadChildren: () => import('@/pages/chart/routes') },
            { path: 'checkbox', loadChildren: () => import('@/pages/checkbox/routes') },
            { path: 'chip', loadChildren: () => import('@/pages/chip/routes') },
            {
                path: 'colorpicker',
                loadChildren: () => import('@/pages/colorpicker/routes')
            },
            {
                path: 'confirmdialog',
                loadChildren: () => import('@/pages/confirmdialog/routes')
            },
            { path: 'contribution', loadChildren: () => import('@/pages/contribution/routes') },
            {
                path: 'dataview',
                loadChildren: () => import('@/pages/dataview/routes')
            },
            { path: 'dialog', loadChildren: () => import('@/pages/dialog/routes') },
            {
                path: 'dynamicdialog',
                loadChildren: () => import('@/pages/dynamicdialog/routes')
            },
            { path: 'select', loadChildren: () => import('@/pages/select/routes') },
            {
                path: 'iconfield',
                loadChildren: () => import('@/pages/iconfield/routes')
            },
            { path: 'editor', loadChildren: () => import('@/pages/editor/routes') },
            {
                path: 'floatlabel',
                loadChildren: () => import('@/pages/floatlabel/routes')
            },
            {
                path: 'fileupload',
                loadChildren: () => import('@/pages/fileupload/routes')
            },
            {
                path: 'filterservice',
                loadChildren: () => import('@/pages/filterservice/routes')
            },
            {
                path: 'focustrap',
                loadChildren: () => import('@/pages/focustrap/routes')
            },
            { path: 'fluid', loadChildren: () => import('@/pages/fluid/routes') },
            {
                path: 'metergroup',
                loadChildren: () => import('@/pages/metergroup/routes')
            },
            {
                path: 'inputmask',
                loadChildren: () => import('@/pages/inputmask/routes')
            },
            {
                path: 'inputnumber',
                loadChildren: () => import('@/pages/inputnumber/routes')
            },
            {
                path: 'toggleswitch',
                loadChildren: () => import('@/pages/toggleswitch/routes')
            },
            {
                path: 'inputtext',
                loadChildren: () => import('@/pages/inputtext/routes')
            },
            {
                path: 'inputgroup',
                loadChildren: () => import('@/pages/inputgroup/routes')
            },
            { path: 'listbox', loadChildren: () => import('@/pages/listbox/routes') },
            { path: 'lts', loadChildren: () => import('@/pages/lts/routes') },
            { path: 'menu', loadChildren: () => import('@/pages/menu/routes') },
            { path: 'message', loadChildren: () => import('@/pages/message/routes') },
            {
                path: 'multiselect',
                loadChildren: () => import('@/pages/multiselect/routes')
            },
            {
                path: 'orderlist',
                loadChildren: () => import('@/pages/orderlist/routes')
            },
            { path: 'popover', loadChildren: () => import('@/pages/popover/routes') },
            {
                path: 'paginator',
                loadChildren: () => import('@/pages/paginator/routes')
            },
            { path: 'panel', loadChildren: () => import('@/pages/panel/routes') },
            {
                path: 'password',
                loadChildren: () => import('@/pages/password/routes')
            },
            {
                path: 'progressbar',
                loadChildren: () => import('@/pages/progressbar/routes')
            },
            {
                path: 'progressspinner',
                loadChildren: () => import('@/pages/progressspinner/routes')
            },
            {
                path: 'radiobutton',
                loadChildren: () => import('@/pages/radiobutton/routes')
            },
            { path: 'rating', loadChildren: () => import('@/pages/rating/routes') },
            { path: 'ripple', loadChildren: () => import('@/pages/ripple/routes') },
            {
                path: 'scrollpanel',
                loadChildren: () => import('@/pages/scrollpanel/routes')
            },
            {
                path: 'selectbutton',
                loadChildren: () => import('@/pages/selectbutton/routes')
            },
            { path: 'drawer', loadChildren: () => import('@/pages/drawer/routes') },
            { path: 'slider', loadChildren: () => import('@/pages/slider/routes') },
            {
                path: 'splitbutton',
                loadChildren: () => import('@/pages/splitbutton/routes')
            },
            {
                path: 'splitter',
                loadChildren: () => import('@/pages/splitter/routes')
            },
            { path: 'support', loadChildren: () => import('@/pages/support/routes') },
            {
                path: 'styleclass',
                loadChildren: () => import('@/pages/styleclass/routes')
            },
            { path: 'tag', loadChildren: () => import('@/pages/tag/routes') },
            { path: 'table', loadChildren: () => import('@/pages/table/routes') },
            { path: 'tabs', loadChildren: () => import('@/pages/tabs/routes') },
            {
                path: 'tailwind',
                loadChildren: () => import('@/pages/tailwind/routes')
            },
            {
                path: 'tieredmenu',
                loadChildren: () => import('@/pages/tieredmenu/routes')
            },
            { path: 'toast', loadChildren: () => import('@/pages/toast/routes') },
            {
                path: 'togglebutton',
                loadChildren: () => import('@/pages/togglebutton/routes')
            },
            { path: 'tooltip', loadChildren: () => import('@/pages/tooltip/routes') },
            {
                path: 'virtualscroller',
                loadChildren: () => import('@/pages/scroller/routes')
            },
            { path: 'uikit', loadChildren: () => import('@/pages/uikit/routes') },
            { path: 'autofocus', loadChildren: () => import('@/pages/autofocus/routes') },
            { path: 'overlay', loadChildren: () => import('@/pages/overlay/routes') },
            {
                path: 'classnames',
                loadChildren: () => import('@/pages/classnames/routes')
            },
            {
                path: 'bind',
                loadChildren: () => import('@/pages/bind/routes')
            },
            { path: 'guides', loadChildren: () => import('@/pages/guides/routes') },
            { path: 'llms', loadChildren: () => import('@/pages/llms/routes') },
            { path: 'mcp', loadChildren: () => import('@/pages/mcp/routes') },
            {
                path: 'migration',
                loadChildren: () => import('@/pages/migration/routes')
            }
        ]
    },
    { path: 'notfound', loadChildren: () => import('@/pages/notfound/routes') },
    { path: '**', redirectTo: '/notfound' }
];
