/** Known in-app paths used by `SettingsRowLink` and similar (keeps `resolve()` type-safe). */
export const ROUTES = {
	systemPrivacy: '/system/privacy',
	systemSettings: '/system/settings',
	systemDiagnostics: '/system/diagnostics',
	systemGrocery: '/system/grocery',
	systemPrep: '/system/prep',
	systemSupplements: '/system/supplements'
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
