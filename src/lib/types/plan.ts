/** Minimal plan shape — expanded in Phase 2 validation. */
export interface PlanMeta {
	title?: string;
	created?: string;
}

export interface Plan {
	schema_version?: string;
	meta?: PlanMeta;
	phases?: unknown[];
}
