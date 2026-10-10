export type I18n = typeof import('../locale/lang/zh-hans').default;

export function loadI18n(locale: string): Promise<I18n> {
    const langs = {
        'zh-Hans_CN': () => import('./lang/zh-hans'),
        'zh-Hant_HK': () => import('./lang/zh-hant'),
        en: () => import('./lang/en'),
        ja: () => import('./lang/ja'),
    };
    return (langs[locale as keyof typeof langs] || langs['zh-Hans_CN'])().then(res => res.default);
}
