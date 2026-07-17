import type { ElementRef, TemplateRef } from '@angular/core';
import type { OverlayOptions, PassThroughOptions, Translation } from 'voxx-ui/api';
import type { AccordionPassThrough } from 'voxx-ui/types/accordion';
import type { AutoCompletePassThrough } from 'voxx-ui/types/autocomplete';
import type { AvatarPassThrough } from 'voxx-ui/types/avatar';
import type { AvatarGroupPassThrough } from 'voxx-ui/types/avatargroup';
import type { BadgePassThrough } from 'voxx-ui/types/badge';
import type { BlockUIPassThrough } from 'voxx-ui/types/blockui';
import type { BreadcrumbPassThrough } from 'voxx-ui/types/breadcrumb';
import type { ButtonPassThrough } from 'voxx-ui/types/button';
import type { CardPassThrough } from 'voxx-ui/types/card';
import type { CarouselPassThrough } from 'voxx-ui/types/carousel';
import type { CascadeSelectPassThrough } from 'voxx-ui/types/cascadeselect';
import type { CheckboxPassThrough } from 'voxx-ui/types/checkbox';
import type { ChipPassThrough } from 'voxx-ui/types/chip';
import type { ColorPickerPassThrough } from 'voxx-ui/types/colorpicker';
import type { ConfirmDialogPassThrough } from 'voxx-ui/types/confirmdialog';
import type { ConfirmPopupPassThrough } from 'voxx-ui/types/confirmpopup';
import type { DialogPassThrough } from 'voxx-ui/types/dialog';
import type { DividerPassThrough } from 'voxx-ui/types/divider';
import type { DockPassThrough } from 'voxx-ui/types/dock';
import type { DrawerPassThrough } from 'voxx-ui/types/drawer';
import type { EditorPassThrough } from 'voxx-ui/types/editor';
import type { FieldsetPassThrough } from 'voxx-ui/types/fieldset';
import type { FileUploadPassThrough } from 'voxx-ui/types/fileupload';
import type { FloatLabelPassThrough } from 'voxx-ui/types/floatlabel';
import type { FluidPassThrough } from 'voxx-ui/types/fluid';
import type { GalleriaPassThrough } from 'voxx-ui/types/galleria';
import type { IconFieldPassThrough } from 'voxx-ui/types/iconfield';
import type { IftaLabelPassThrough } from 'voxx-ui/types/iftalabel';
import type { ImagePassThrough } from 'voxx-ui/types/image';
import type { ImageComparePassThrough } from 'voxx-ui/types/imagecompare';
import type { InplacePassThrough } from 'voxx-ui/types/inplace';
import type { InputGroupPassThrough } from 'voxx-ui/types/inputgroup';
import type { InputGroupAddonPassThrough } from 'voxx-ui/types/inputgroupaddon';
import type { InputIconPassThrough } from 'voxx-ui/types/inputicon';
import type { InputMaskPassThrough } from 'voxx-ui/types/inputmask';
import type { InputNumberPassThrough } from 'voxx-ui/types/inputnumber';
import type { InputOtpPassThrough } from 'voxx-ui/types/inputotp';
import type { InputTextPassThrough } from 'voxx-ui/types/inputtext';
import type { KnobPassThrough } from 'voxx-ui/types/knob';
import type { MegaMenuPassThrough } from 'voxx-ui/types/megamenu';
import type { MenuPassThrough } from 'voxx-ui/types/menu';
import type { MenubarPassThrough } from 'voxx-ui/types/menubar';
import type { MessagePassThrough } from 'voxx-ui/types/message';
import type { MeterGroupPassThrough } from 'voxx-ui/types/metergroup';
import type { OrderListPassThrough } from 'voxx-ui/types/orderlist';
import type { OrganizationChartPassThrough } from 'voxx-ui/types/organizationchart';
import type { OverlayBadgePassThrough } from 'voxx-ui/types/overlaybadge';
import type { PanelPassThrough } from 'voxx-ui/types/panel';
import type { PanelMenuPassThrough } from 'voxx-ui/types/panelmenu';
import type { PopoverPassThrough } from 'voxx-ui/types/popover';
import type { ProgressBarPassThrough } from 'voxx-ui/types/progressbar';
import type { ProgressSpinnerPassThrough } from 'voxx-ui/types/progressspinner';
import type { RadioButtonPassThrough } from 'voxx-ui/types/radiobutton';
import type { RatingPassThrough } from 'voxx-ui/types/rating';
import type { VirtualScrollerPassThrough } from 'voxx-ui/types/scroller';
import type { ScrollPanelPassThrough } from 'voxx-ui/types/scrollpanel';
import type { ScrollTopPassThrough } from 'voxx-ui/types/scrolltop';
import type { SelectPassThrough } from 'voxx-ui/types/select';
import type { SelectButtonPassThrough } from 'voxx-ui/types/selectbutton';
import type { SkeletonPassThrough } from 'voxx-ui/types/skeleton';
import type { SliderPassThrough } from 'voxx-ui/types/slider';
import type { SpeedDialPassThrough } from 'voxx-ui/types/speeddial';
import type { SplitButtonPassThrough } from 'voxx-ui/types/splitbutton';
import type { SplitterPassThrough } from 'voxx-ui/types/splitter';
import type { StepperPassThrough } from 'voxx-ui/types/stepper';
import type { ColumnFilterPassThrough, TablePassThrough } from 'voxx-ui/types/table';
import type { TabListPassThrough, TabPanelPassThrough, TabPanelsPassThrough, TabPassThrough, TabsPassThrough } from 'voxx-ui/types/tabs';
import type { TagPassThrough } from 'voxx-ui/types/tag';
import type { TerminalPassThrough } from 'voxx-ui/types/terminal';
import type { TieredMenuPassThrough } from 'voxx-ui/types/tieredmenu';
import type { TimelinePassThrough } from 'voxx-ui/types/timeline';
import type { ToastPassThrough } from 'voxx-ui/types/toast';
import type { ToggleButtonPassThrough } from 'voxx-ui/types/togglebutton';
import type { ToggleSwitchPassThrough } from 'voxx-ui/types/toggleswitch';
import type { ToolbarPassThrough } from 'voxx-ui/types/toolbar';
import type { TreePassThrough } from 'voxx-ui/types/tree';
import type { TreeSelectPassThrough } from 'voxx-ui/types/treeselect';
import type { TreeTablePassThrough } from 'voxx-ui/types/treetable';

/** ZIndex configuration */
export type ZIndex = {
    modal: number;
    overlay: number;
    menu: number;
    tooltip: number;
};

/** Theme configuration */
export type ThemeType = { preset?: any; options?: any } | 'none' | boolean | undefined;

export type ThemeConfigType = {
    theme?: ThemeType;
    csp?: {
        nonce: string | undefined;
    };
};

export interface GlobalPassThrough {
    accordion?: AccordionPassThrough;
    autoComplete?: AutoCompletePassThrough;
    avatar?: AvatarPassThrough;
    avatarGroup?: AvatarGroupPassThrough;
    blockUI?: BlockUIPassThrough;
    breadcrumb?: BreadcrumbPassThrough;
    card?: CardPassThrough;
    carousel?: CarouselPassThrough;
    cascadeSelect?: CascadeSelectPassThrough;
    checkbox?: CheckboxPassThrough;
    chip?: ChipPassThrough;
    colorPicker?: ColorPickerPassThrough;
    columnFilter?: ColumnFilterPassThrough;
    confirmDialog?: ConfirmDialogPassThrough;
    confirmPopup?: ConfirmPopupPassThrough;
    dialog?: DialogPassThrough;
    divider?: DividerPassThrough;
    dock?: DockPassThrough;
    megaMenu?: MegaMenuPassThrough;
    drawer?: DrawerPassThrough;
    editor?: EditorPassThrough;
    fileUpload?: FileUploadPassThrough;
    floatLabel?: FloatLabelPassThrough;
    menu?: MenuPassThrough;
    menubar?: MenubarPassThrough;
    fluid?: FluidPassThrough;
    galleria?: GalleriaPassThrough;
    iconField?: IconFieldPassThrough;
    iftaLabel?: IftaLabelPassThrough;
    inputIcon?: InputIconPassThrough;
    image?: ImagePassThrough;
    imageCompare?: ImageComparePassThrough;
    inplace?: InplacePassThrough;
    inputText?: InputTextPassThrough;
    inputGroup?: InputGroupPassThrough;
    inputGroupAddon?: InputGroupAddonPassThrough;
    inputMask?: InputMaskPassThrough;
    inputNumber?: InputNumberPassThrough;
    inputOtp?: InputOtpPassThrough;
    knob?: KnobPassThrough;
    popover?: PopoverPassThrough;
    message?: MessagePassThrough;
    meterGroup?: MeterGroupPassThrough;
    orderList?: OrderListPassThrough;
    organizationChart?: OrganizationChartPassThrough;
    overlayBadge?: OverlayBadgePassThrough;
    progressBar?: ProgressBarPassThrough;
    progressSpinner?: ProgressSpinnerPassThrough;
    radioButton?: RadioButtonPassThrough;
    rating?: RatingPassThrough;
    virtualScroller?: VirtualScrollerPassThrough;
    scrollPanel?: ScrollPanelPassThrough;
    scrollTop?: ScrollTopPassThrough;
    select?: SelectPassThrough;
    selectButton?: SelectButtonPassThrough;
    skeleton?: SkeletonPassThrough;
    slider?: SliderPassThrough;
    speedDial?: SpeedDialPassThrough;
    splitButton?: SplitButtonPassThrough;
    splitter?: SplitterPassThrough;
    stepper?: StepperPassThrough;
    tabs?: TabsPassThrough;
    tab?: TabPassThrough;
    tabList?: TabListPassThrough;
    tabPanel?: TabPanelPassThrough;
    tabPanels?: TabPanelsPassThrough;
    table?: TablePassThrough;
    tieredMenu?: TieredMenuPassThrough;
    timeline?: TimelinePassThrough;
    tag?: TagPassThrough;
    terminal?: TerminalPassThrough;
    toast?: ToastPassThrough;
    toggleButton?: ToggleButtonPassThrough;
    toggleSwitch?: ToggleSwitchPassThrough;
    toolbar?: ToolbarPassThrough;
    tree?: TreePassThrough;
    treeSelect?: TreeSelectPassThrough;
    treeTable?: TreeTablePassThrough;
    panel?: PanelPassThrough;
    panelMenu?: PanelMenuPassThrough;
    button?: ButtonPassThrough;
    badge?: BadgePassThrough;
    fieldset?: FieldsetPassThrough;
    global?: {
        css?: string;
    };
    [key: string]: any;
}

export type VoxxUIConfigType = {
    ripple?: boolean;
    overlayAppendTo?: HTMLElement | ElementRef | TemplateRef<any> | string | null | undefined | any;
    /**
     * @deprecated Since v20. Use `inputVariant` instead.
     */
    inputStyle?: 'outlined' | 'filled';
    inputVariant?: 'outlined' | 'filled';
    overlayOptions?: OverlayOptions;
    translation?: Translation;
    /**
     * @experimental
     * This property is not yet implemented. It will be available in a future release.
     */
    unstyled?: boolean;
    zIndex?: ZIndex | null | undefined;
    pt?: GlobalPassThrough | null | undefined;
    ptOptions?: PassThroughOptions | null | undefined;
    filterMatchModeOptions?: any;
} & ThemeConfigType;
