<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { browser } from '$app/environment';
	import RedActionButton from '$lib/components/nothing/RedActionButton.svelte';
	import ProgressHeader from '$lib/components/spec/ProgressHeader.svelte';
	import ScreenHeaderBlock from '$lib/components/spec/ScreenHeaderBlock.svelte';
	import StatusStrip from '$lib/components/spec/StatusStrip.svelte';
	import StepCard from '$lib/components/spec/StepCard.svelte';
	import TextLinkButton from '$lib/components/spec/TextLinkButton.svelte';
	import type { OnboardingState, PrimaryGoalKey, UrgencyKey } from '$lib/types/planV2';
	import { onboarding, persistOnboarding, plan } from '$lib/stores/healthApp';

	const stepMeta = [
		{ label: 'STEP 1 OF 6', progress: 1 / 6, title: 'About you', sub: 'Basics & measurements' },
		{ label: 'STEP 2 OF 6', progress: 2 / 6, title: 'Your goal', sub: 'Timeline & pace' },
		{ label: 'STEP 3 OF 6', progress: 3 / 6, title: 'Training', sub: 'Gym context & limits' },
		{
			label: 'STEP 4 OF 6',
			progress: 4 / 6,
			title: 'Food & kitchen',
			sub: 'Diet, allergies, cooking'
		},
		{ label: 'STEP 5 OF 6', progress: 5 / 6, title: 'Supplements', sub: 'What you have & budget' },
		{ label: 'STEP 6 OF 6', progress: 1, title: 'Life & place', sub: 'Country, rhythm, stress' }
	] as const;

	const stepRail = [
		{ id: 1 as const, title: 'About you', sub: 'Basics & measurements' },
		{ id: 2 as const, title: 'Your goal', sub: 'Timeline & pace' },
		{ id: 3 as const, title: 'Training', sub: 'Gym context & limits' },
		{ id: 4 as const, title: 'Food & kitchen', sub: 'Diet, allergies, cooking' },
		{ id: 5 as const, title: 'Supplements', sub: 'What you have & budget' },
		{ id: 6 as const, title: 'Life & place', sub: 'Country, rhythm, stress' }
	];

	function st(n: 1 | 2 | 3 | 4 | 5 | 6): 'complete' | 'current' | 'locked' {
		const s = $onboarding.step;
		if (n < s) return 'complete';
		if (n === s) return 'current';
		return 'locked';
	}

	function patch(p: Partial<OnboardingState>) {
		persistOnboarding({ ...$onboarding, ...p });
	}

	function patchProfile(p: Partial<OnboardingState['profile']>) {
		persistOnboarding({ ...$onboarding, profile: { ...$onboarding.profile, ...p } });
	}

	function patchGoal(p: Partial<OnboardingState['goal']>) {
		persistOnboarding({ ...$onboarding, goal: { ...$onboarding.goal, ...p } });
	}

	function patchTraining(p: Partial<OnboardingState['training']>) {
		persistOnboarding({ ...$onboarding, training: { ...$onboarding.training, ...p } });
	}

	function patchDiet(p: Partial<OnboardingState['diet']>) {
		persistOnboarding({ ...$onboarding, diet: { ...$onboarding.diet, ...p } });
	}

	function patchSupplements(p: Partial<OnboardingState['supplements']>) {
		persistOnboarding({ ...$onboarding, supplements: { ...$onboarding.supplements, ...p } });
	}

	function patchLifestyle(p: Partial<OnboardingState['lifestyle']>) {
		persistOnboarding({ ...$onboarding, lifestyle: { ...$onboarding.lifestyle, ...p } });
	}

	function goImport() {
		goto(resolve('/import'));
	}

	function next() {
		const s = $onboarding.step;
		if (s < 6) {
			patch({ step: (s + 1) as 1 | 2 | 3 | 4 | 5 | 6 });
		} else {
			patch({ confirmed: true });
			goto(resolve('/import'));
		}
	}

	let redirected = false;
	$effect(() => {
		if (!browser || redirected) return;
		if ($plan) {
			redirected = true;
			goto(resolve('/today'));
		}
	});

	const goals: { id: PrimaryGoalKey; label: string; hint: string }[] = [
		{ id: 'fat_loss', label: 'Fat loss', hint: 'Trim fat, keep muscle' },
		{ id: 'muscle_gain', label: 'Muscle gain', hint: 'Build size & strength' },
		{ id: 'recomp', label: 'Recomp', hint: 'Slow fat loss + muscle' },
		{ id: 'maintenance', label: 'Maintenance', hint: 'Stay steady' }
	];

	const urgencies: { id: UrgencyKey; label: string }[] = [
		{ id: 'sustainable', label: 'Slow' },
		{ id: 'balanced', label: 'Balanced' },
		{ id: 'aggressive', label: 'Aggressive' }
	];
</script>

<main class="screen px-screen pt-safe stack">
	<StatusStrip />
	<ProgressHeader
		label={stepMeta[$onboarding.step - 1].label}
		progress={stepMeta[$onboarding.step - 1].progress}
	/>

	<ScreenHeaderBlock
		title={stepMeta[$onboarding.step - 1].title}
		subtitle={stepMeta[$onboarding.step - 1].sub}
	/>

	{#each stepRail as r (r.id)}
		<StepCard index={r.id} title={r.title} subtitle={r.sub} status={st(r.id)} />
	{/each}

	{#if $onboarding.step === 1}
		<div class="form nothing-surface">
			<label class="field">
				<span class="mono-caps lab">Name</span>
				<input
					class="inp"
					type="text"
					autocomplete="name"
					value={$onboarding.profile.name}
					oninput={(e) => patchProfile({ name: (e.target as HTMLInputElement).value })}
				/>
			</label>
			<label class="field">
				<span class="mono-caps lab">Age</span>
				<input
					class="inp"
					type="number"
					min="16"
					max="80"
					value={$onboarding.profile.age}
					oninput={(e) => patchProfile({ age: (e.target as HTMLInputElement).value })}
				/>
			</label>
			<label class="field">
				<span class="mono-caps lab">Sex</span>
				<select
					class="inp"
					value={$onboarding.profile.sex}
					onchange={(e) => patchProfile({ sex: (e.target as HTMLSelectElement).value })}
				>
					<option value="">Select</option>
					<option value="female">Female</option>
					<option value="male">Male</option>
					<option value="other">Other</option>
				</select>
			</label>
			<div class="field">
				<span class="mono-caps lab">Height</span>
				<div class="seg" role="group" aria-label="Height unit">
					<button
						type="button"
						class="seg-btn"
						data-on={$onboarding.profile.height_unit === 'cm'}
						onclick={() => patchProfile({ height_unit: 'cm' })}>cm</button
					>
					<button
						type="button"
						class="seg-btn"
						data-on={$onboarding.profile.height_unit === 'ftin'}
						onclick={() => patchProfile({ height_unit: 'ftin' })}>ft / in</button
					>
				</div>
				{#if $onboarding.profile.height_unit === 'cm'}
					<input
						class="inp mt"
						type="number"
						min="120"
						max="250"
						placeholder="e.g. 175"
						value={$onboarding.profile.height_cm}
						oninput={(e) => patchProfile({ height_cm: (e.target as HTMLInputElement).value })}
					/>
				{:else}
					<div class="row2 mt">
						<input
							class="inp"
							type="number"
							min="3"
							max="8"
							placeholder="ft"
							aria-label="Feet"
							value={$onboarding.profile.height_ft}
							oninput={(e) => patchProfile({ height_ft: (e.target as HTMLInputElement).value })}
						/>
						<input
							class="inp"
							type="number"
							min="0"
							max="11"
							placeholder="in"
							aria-label="Inches"
							value={$onboarding.profile.height_in}
							oninput={(e) => patchProfile({ height_in: (e.target as HTMLInputElement).value })}
						/>
					</div>
				{/if}
			</div>
			<div class="field">
				<span class="mono-caps lab">Weight</span>
				<div class="seg" role="group" aria-label="Weight unit">
					<button
						type="button"
						class="seg-btn"
						data-on={$onboarding.profile.weight_unit === 'kg'}
						onclick={() => patchProfile({ weight_unit: 'kg' })}>kg</button
					>
					<button
						type="button"
						class="seg-btn"
						data-on={$onboarding.profile.weight_unit === 'lbs'}
						onclick={() => patchProfile({ weight_unit: 'lbs' })}>lbs</button
					>
				</div>
				{#if $onboarding.profile.weight_unit === 'kg'}
					<input
						class="inp mt"
						type="number"
						min="1"
						step="0.1"
						value={$onboarding.profile.weight_kg}
						oninput={(e) => patchProfile({ weight_kg: (e.target as HTMLInputElement).value })}
					/>
				{:else}
					<input
						class="inp mt"
						type="number"
						min="1"
						step="0.1"
						value={$onboarding.profile.weight_lbs}
						oninput={(e) => patchProfile({ weight_lbs: (e.target as HTMLInputElement).value })}
					/>
				{/if}
			</div>
			<label class="field">
				<span class="mono-caps lab">Body fat % <span class="opt">optional</span></span>
				<input
					class="inp"
					type="number"
					min="0"
					max="60"
					step="0.1"
					placeholder="Skip if unsure"
					value={$onboarding.profile.body_fat_pct}
					oninput={(e) => patchProfile({ body_fat_pct: (e.target as HTMLInputElement).value })}
				/>
			</label>
		</div>
	{:else if $onboarding.step === 2}
		<div class="form nothing-surface">
			<p class="mono-caps lab">Primary goal</p>
			<div class="pick-grid">
				{#each goals as g (g.id)}
					<button
						type="button"
						class="pick"
						data-on={$onboarding.goal.primary_goal === g.id}
						onclick={() => patchGoal({ primary_goal: g.id })}
					>
						<span class="pt">{g.label}</span>
						<span class="ps">{g.hint}</span>
					</button>
				{/each}
			</div>
			<p class="mono-caps lab mt2">Program length</p>
			<div class="seg">
				{#each ['8', '12', '16', '20'] as w (w)}
					<button
						type="button"
						class="seg-btn"
						data-on={$onboarding.goal.timeline_weeks === w}
						onclick={() =>
							patchGoal({ timeline_weeks: w as OnboardingState['goal']['timeline_weeks'] })}
						>{w} wks</button
					>
				{/each}
			</div>
			<label class="field">
				<span class="mono-caps lab">Target weight <span class="opt">optional</span></span>
				<input
					class="inp"
					type="number"
					min="1"
					step="0.1"
					placeholder={`In ${$onboarding.profile.weight_unit}`}
					value={$onboarding.goal.target_weight}
					oninput={(e) => patchGoal({ target_weight: (e.target as HTMLInputElement).value })}
				/>
			</label>
			<p class="mono-caps lab">Pace</p>
			<div class="seg">
				{#each urgencies as u (u.id)}
					<button
						type="button"
						class="seg-btn"
						data-on={$onboarding.goal.urgency === u.id}
						onclick={() => patchGoal({ urgency: u.id })}>{u.label}</button
					>
				{/each}
			</div>
			<label class="field">
				<span class="mono-caps lab">Extra context <span class="opt">optional</span></span>
				<textarea
					class="inp ta"
					rows="3"
					placeholder="Anything else about your goal"
					value={$onboarding.goal.notes}
					oninput={(e) => patchGoal({ notes: (e.target as HTMLTextAreaElement).value })}
				></textarea>
			</label>
		</div>
	{:else if $onboarding.step === 3}
		<div class="form nothing-surface">
			<label class="field">
				<span class="mono-caps lab">Training days per week</span>
				<input
					class="inp"
					type="number"
					min="1"
					max="7"
					value={$onboarding.training.days_per_week}
					oninput={(e) => patchTraining({ days_per_week: (e.target as HTMLInputElement).value })}
				/>
			</label>
			<label class="field">
				<span class="mono-caps lab">Where you train</span>
				<select
					class="inp"
					value={$onboarding.training.location}
					onchange={(e) => patchTraining({ location: (e.target as HTMLSelectElement).value })}
				>
					<option value="">Select</option>
					<option value="full_gym">Full gym</option>
					<option value="home_equipment">Home + equipment</option>
					<option value="home_bodyweight">Home bodyweight only</option>
				</select>
			</label>
			<label class="field">
				<span class="mono-caps lab">Fitness level</span>
				<select
					class="inp"
					value={$onboarding.training.fitness_level}
					onchange={(e) => patchTraining({ fitness_level: (e.target as HTMLSelectElement).value })}
				>
					<option value="">Select</option>
					<option value="beginner">Beginner</option>
					<option value="intermediate">Intermediate</option>
					<option value="advanced">Advanced</option>
				</select>
			</label>
			<label class="field">
				<span class="mono-caps lab">Injuries or limitations</span>
				<textarea
					class="inp ta"
					rows="3"
					placeholder="Or leave blank"
					value={$onboarding.training.injuries}
					oninput={(e) => patchTraining({ injuries: (e.target as HTMLTextAreaElement).value })}
				></textarea>
			</label>
		</div>
	{:else if $onboarding.step === 4}
		<div class="form nothing-surface">
			<label class="field">
				<span class="mono-caps lab">Dietary preference</span>
				<select
					class="inp"
					value={$onboarding.diet.preference}
					onchange={(e) => patchDiet({ preference: (e.target as HTMLSelectElement).value })}
				>
					<option value="">Select</option>
					<option value="omnivore">Omnivore</option>
					<option value="vegetarian">Vegetarian</option>
					<option value="vegan">Vegan</option>
					<option value="halal">Halal</option>
					<option value="pescatarian">Pescatarian</option>
				</select>
			</label>
			<label class="field">
				<span class="mono-caps lab">Foods you dislike or avoid</span>
				<textarea
					class="inp ta"
					rows="2"
					placeholder="Optional"
					value={$onboarding.diet.food_dislikes}
					oninput={(e) => patchDiet({ food_dislikes: (e.target as HTMLTextAreaElement).value })}
				></textarea>
			</label>
			<label class="field">
				<span class="mono-caps lab">Allergies & intolerances</span>
				<textarea
					class="inp ta"
					rows="2"
					placeholder="Or none"
					value={$onboarding.diet.allergies}
					oninput={(e) => patchDiet({ allergies: (e.target as HTMLTextAreaElement).value })}
				></textarea>
			</label>
			<label class="field row-inline">
				<input
					type="checkbox"
					checked={$onboarding.diet.medication_warning}
					onchange={(e) =>
						patchDiet({ medication_warning: (e.target as HTMLInputElement).checked })}
				/>
				<span class="lab-inline"
					>I take prescription medication or have a condition to review before supplements.</span
				>
			</label>
			<label class="field">
				<span class="mono-caps lab">Meals per day</span>
				<select
					class="inp"
					value={$onboarding.diet.meals_per_day}
					onchange={(e) => patchDiet({ meals_per_day: (e.target as HTMLSelectElement).value })}
				>
					<option value="">Select</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
					<option value="6">6</option>
				</select>
			</label>
			<label class="field">
				<span class="mono-caps lab">Typical cooking time</span>
				<select
					class="inp"
					value={$onboarding.diet.cooking_time}
					onchange={(e) => patchDiet({ cooking_time: (e.target as HTMLSelectElement).value })}
				>
					<option value="">Select</option>
					<option value="under_20">Under 20 min</option>
					<option value="30_45">30–45 min</option>
					<option value="enjoy">Enjoy longer cooking</option>
				</select>
			</label>
			<label class="field">
				<span class="mono-caps lab">Meal prep</span>
				<select
					class="inp"
					value={$onboarding.diet.meal_prep}
					onchange={(e) => patchDiet({ meal_prep: (e.target as HTMLSelectElement).value })}
				>
					<option value="">Select</option>
					<option value="yes">Yes</option>
					<option value="no">No</option>
				</select>
			</label>
			<label class="field">
				<span class="mono-caps lab">Cooking equipment</span>
				<textarea
					class="inp ta"
					rows="2"
					placeholder="e.g. Instant Pot, air fryer, rice cooker"
					value={$onboarding.diet.equipment}
					oninput={(e) => patchDiet({ equipment: (e.target as HTMLTextAreaElement).value })}
				></textarea>
			</label>
		</div>
	{:else if $onboarding.step === 5}
		<div class="form nothing-surface">
			<label class="field">
				<span class="mono-caps lab">Supplements you already have</span>
				<textarea
					class="inp ta"
					rows="3"
					placeholder="List what you take or own"
					value={$onboarding.supplements.owned}
					oninput={(e) => patchSupplements({ owned: (e.target as HTMLTextAreaElement).value })}
				></textarea>
			</label>
			<p class="mono-caps lab">Supplement budget</p>
			<div class="pick-grid tight">
				<button
					type="button"
					class="pick"
					data-on={$onboarding.supplements.budget === 'have'}
					onclick={() => patchSupplements({ budget: 'have' })}
				>
					<span class="pt">Have what I need</span>
				</button>
				<button
					type="button"
					class="pick"
					data-on={$onboarding.supplements.budget === 'budget_2040'}
					onclick={() => patchSupplements({ budget: 'budget_2040' })}
				>
					<span class="pt">Budget</span>
					<span class="ps">~$20–40/mo</span>
				</button>
				<button
					type="button"
					class="pick"
					data-on={$onboarding.supplements.budget === 'mid_4080'}
					onclick={() => patchSupplements({ budget: 'mid_4080' })}
				>
					<span class="pt">Mid-range</span>
					<span class="ps">~$40–80/mo</span>
				</button>
				<button
					type="button"
					class="pick"
					data-on={$onboarding.supplements.budget === 'no_limit'}
					onclick={() => patchSupplements({ budget: 'no_limit' })}
				>
					<span class="pt">No limit</span>
				</button>
			</div>
			<label class="field">
				<span class="mono-caps lab">Other supplements <span class="opt">optional</span></span>
				<textarea
					class="inp ta"
					rows="2"
					value={$onboarding.supplements.other}
					oninput={(e) => patchSupplements({ other: (e.target as HTMLTextAreaElement).value })}
				></textarea>
			</label>
		</div>
	{:else}
		<div class="form nothing-surface">
			<label class="field">
				<span class="mono-caps lab">Country</span>
				<input
					class="inp"
					type="text"
					list="country-list"
					autocomplete="country-name"
					placeholder="e.g. Canada"
					value={$onboarding.lifestyle.country}
					oninput={(e) => patchLifestyle({ country: (e.target as HTMLInputElement).value })}
				/>
				<datalist id="country-list">
					<option value="Canada"></option>
					<option value="United States"></option>
					<option value="United Kingdom"></option>
					<option value="Australia"></option>
					<option value="India"></option>
					<option value="Germany"></option>
					<option value="France"></option>
					<option value="Other"></option>
				</datalist>
			</label>
			<label class="field">
				<span class="mono-caps lab">City / region <span class="opt">optional</span></span>
				<input
					class="inp"
					type="text"
					value={$onboarding.lifestyle.city}
					oninput={(e) => patchLifestyle({ city: (e.target as HTMLInputElement).value })}
				/>
			</label>
			<label class="field">
				<span class="mono-caps lab">Wake time</span>
				<input
					class="inp"
					type="time"
					value={$onboarding.lifestyle.wake_time}
					oninput={(e) => patchLifestyle({ wake_time: (e.target as HTMLInputElement).value })}
				/>
			</label>
			<label class="field">
				<span class="mono-caps lab">Sleep time</span>
				<input
					class="inp"
					type="time"
					value={$onboarding.lifestyle.sleep_time}
					oninput={(e) => patchLifestyle({ sleep_time: (e.target as HTMLInputElement).value })}
				/>
			</label>
			<label class="field">
				<span class="mono-caps lab">Training time</span>
				<input
					class="inp"
					type="time"
					value={$onboarding.lifestyle.training_time}
					oninput={(e) => patchLifestyle({ training_time: (e.target as HTMLInputElement).value })}
				/>
			</label>
			<label class="field">
				<span class="mono-caps lab">Daily activity outside the gym</span>
				<select
					class="inp"
					value={$onboarding.lifestyle.activity_outside_gym}
					onchange={(e) =>
						patchLifestyle({ activity_outside_gym: (e.target as HTMLSelectElement).value })}
				>
					<option value="">Select</option>
					<option value="sedentary">Mostly sedentary</option>
					<option value="light">Light movement</option>
					<option value="active_job">Active job</option>
					<option value="very_active_job">Very active day</option>
				</select>
			</label>
			<label class="field">
				<span class="mono-caps lab">Sleep hours / night</span>
				<input
					class="inp"
					type="number"
					min="4"
					max="12"
					step="0.5"
					value={$onboarding.lifestyle.sleep_hours}
					oninput={(e) => patchLifestyle({ sleep_hours: (e.target as HTMLInputElement).value })}
				/>
			</label>
			<label class="field">
				<span class="mono-caps lab">Stress level</span>
				<select
					class="inp"
					value={$onboarding.lifestyle.stress_level}
					onchange={(e) => patchLifestyle({ stress_level: (e.target as HTMLSelectElement).value })}
				>
					<option value="">Select</option>
					<option value="low">Low</option>
					<option value="moderate">Moderate</option>
					<option value="high">High</option>
					<option value="very_high">Very high</option>
				</select>
			</label>
			<label class="field">
				<span class="mono-caps lab">Biggest challenges</span>
				<textarea
					class="inp ta"
					rows="3"
					placeholder="e.g. night shifts, travel, cravings"
					value={$onboarding.lifestyle.biggest_challenges}
					oninput={(e) =>
						patchLifestyle({ biggest_challenges: (e.target as HTMLTextAreaElement).value })}
				></textarea>
			</label>
		</div>
		<section class="legal nothing-surface">
			<h2 class="mono-caps h">Privacy</h2>
			<p class="p">
				This app does not send your plan to a server. Data lives in your browser storage only.
			</p>
			<h2 class="mono-caps h">Local storage</h2>
			<p class="p">Clearing site data removes your plan unless you exported a backup JSON.</p>
		</section>
	{/if}

	<RedActionButton label={$onboarding.step < 6 ? 'Continue' : 'Start import'} onclick={next} />
	<TextLinkButton text="Skip for now" onclick={goImport} />
</main>

<style>
	.screen {
		flex: 1;
		padding-bottom: var(--space-8);
	}

	.form {
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.row-inline {
		flex-direction: row;
		align-items: flex-start;
		gap: 10px;
	}

	.lab-inline {
		font-size: 14px;
		line-height: 1.4;
		color: var(--text-2);
	}

	.lab {
		color: var(--text-3);
		font-size: 9px;
	}

	.opt {
		font-weight: 400;
		opacity: 0.85;
	}

	.inp {
		border: 1px solid var(--line-1);
		border-radius: var(--radius-xs);
		padding: 10px 12px;
		background: rgba(0, 0, 0, 0.35);
		color: var(--text-1);
		font-size: 16px;
	}

	.ta {
		min-height: 72px;
		resize: vertical;
		font-size: 15px;
	}

	.mt {
		margin-top: 6px;
	}

	.mt2 {
		margin-top: var(--space-3);
	}

	.row2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-2);
	}

	.seg {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.seg-btn {
		flex: 1;
		min-width: 72px;
		min-height: 40px;
		padding: 0 10px;
		border-radius: var(--radius-xs);
		border: 1px solid var(--line-1);
		background: rgba(0, 0, 0, 0.25);
		color: var(--text-2);
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
	}

	.seg-btn[data-on='true'] {
		border-color: var(--red);
		color: var(--text-1);
		box-shadow: inset 0 0 0 1px var(--red);
	}

	.pick-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-2);
	}

	.pick-grid.tight {
		grid-template-columns: 1fr 1fr;
	}

	.pick {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 4px;
		padding: var(--space-3);
		border-radius: var(--radius-xs);
		border: 1px solid var(--line-1);
		background: rgba(0, 0, 0, 0.28);
		color: var(--text-1);
		text-align: left;
		cursor: pointer;
		min-height: 64px;
	}

	.pick[data-on='true'] {
		border-color: var(--red);
		box-shadow: inset 0 0 0 1px var(--red);
	}

	.pt {
		font-size: 15px;
		font-weight: 650;
	}

	.ps {
		font-size: 12px;
		color: var(--text-2);
		line-height: 1.3;
	}

	.legal {
		padding: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.h {
		margin: var(--space-3) 0 var(--space-2);
		font-size: 10px;
		color: var(--text-3);
	}

	.h:first-child {
		margin-top: 0;
	}

	.p {
		margin: 0;
		font-size: 14px;
		color: var(--text-2);
		line-height: 1.5;
	}
</style>
