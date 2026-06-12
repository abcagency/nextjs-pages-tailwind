# UI Components

This project uses shadcn Base UI primitives with light wrappers in `components/modules/core` and a thin React Hook Form adapter in `components/modules/form`.

**Form API**

Use the `Form` API for repeated React Hook Form wiring: provider setup, first invalid field focus, label/description/error ids, `aria-invalid`, and inline error rendering. Prefer direct composition with `Form.Field`, `Form.Label`, `Form.Control`, `Form.Description`, and `Form.Message` when a field layout is custom.

```tsx
import { Form } from '~/components/modules/form';
import { useForm } from 'react-hook-form';

const form = useForm({ defaultValues: { policyNumber: '' } });

return (
	<Form.Root form={form} onSubmit={values => console.info(values)}>
		<Form.Input
			name="policyNumber"
			label="Policy Number"
			placeholder="284732…"
			autoComplete="off"
			required={true}
		/>
		<Form.Select
			name="policyType"
			label="Policy Type"
			placeholder="Select policy…"
			options={[
				{ value: 'auto', label: 'Auto' },
				{ value: 'home', label: 'Homeowners' }
			]}
		/>
		<Form.Date name="lossDate" label="Loss Date" placeholder="Select date…" />
		<Form.Checkbox
			name="fraudAcknowledgement"
			label="I understand that insurance fraud is a crime."
			required={true}
		/>
	</Form.Root>
);
```

Baseline wrappers are intentionally small:

- `Form.Input`, `Form.Textarea`, `Form.Select`, `Form.Checkbox`, `Form.CheckboxGroup`, `Form.RadioGroup`, and `Form.Switch` remove repeated RHF/label/error markup.
- `Form.Combobox`, `Form.Range`, `Form.Date`, `Form.DateRange`, `Form.DateTime`, `Form.Time`, `Form.Phone`, and `Form.Currency` are project add-ons. Use them when their masking, formatting, picker, or filtering behavior is needed.
- Use the underlying Base UI/shadcn components directly inside `Form.Field` when a layout does not match a wrapper.

**Error Modes**

Errors default to `errorMode="inline"`, which renders the message next to the label: `Location Address* is required`. Use `errorMode="block"` when the field needs a longer message below the control. Use `errorMode="auto"` to render messages inline when they are 15 characters or shorter and below the control when they are longer.

```tsx
<Form.Input name="city" label="City" required={true} />

<Form.Textarea
	name="incidentSummary"
	label="Incident Summary"
	errorMode="block"
/>

<Form.Input name="postalCode" label="Postal Code" errorMode="auto" />
```

**Custom Composition**

Use `Form.Field` and `Form.Control` for custom layouts like input groups. `Form.Control` binds simple input-like controls to RHF while preserving custom `onChange`, `onBlur`, refs, and ARIA.

```tsx
import { Form } from '~/components/modules/form';
import {
	InputGroup,
	InputGroupText
} from '~/components/modules/core/input-group';
import Input from '~/components/modules/form/input';

<Form.Field name="policyNumber">
	<Form.Label required={true}>Policy Number</Form.Label>
	<InputGroup>
		<InputGroupText>INS</InputGroupText>
		<Form.Control>
			<Input placeholder="284732…" />
		</Form.Control>
	</InputGroup>
	<Form.Message />
</Form.Field>;
```

For controls that do not behave like native inputs, bind the control explicitly from the field render prop.

```tsx
import { Switch, SwitchThumb } from '~/components/modules/core/switch';

<Form.Field name="emailNotifications">
	{({ field, fieldState }) => (
		<>
			<Form.Label>Email Notifications</Form.Label>
			<Switch
				id={field.name}
				name={field.name}
				checked={Boolean(field.value)}
				onCheckedChange={field.onChange}
				aria-invalid={fieldState.invalid}
			>
				<SwitchThumb />
			</Switch>
			<Form.Message />
		</>
	)}
</Form.Field>;
```

**Masking**

Use `mask` and `unmask` on `Input`, or the project add-on `PhoneInput` and `CurrencyInput` wrappers.

```tsx
import Input from '~/components/modules/form/input';
import PhoneInput from '~/components/modules/form/phone';
import CurrencyInput from '~/components/modules/form/currency';

<Input mask="000-00-0000" unmask={true} />;
<PhoneInput placeholder="(415) 555-0198…" />;
<CurrencyInput placeholder="$4,200…" />;
```

**Date Inputs**

`DateInput` supports `mode="auto" | "native" | "calendar"` and `variant="default" | "input" | "dob"`. Range uses `{ start, end }` in `YYYY-MM-DD`.

```tsx
import { DateInput, DateRangeInput } from '~/components/modules/form/date';

<DateInput mode="auto" variant="dob" />;
<DateRangeInput value={{ start: '2025-12-07', end: '2025-12-08' }} />;
```

**Core UI**

Available in `components/modules/core`:

- `dialog`, `drawer`, `sheet`
- `tabs`, `item`
- `skeleton`, `spinner`
- `input-group`
- `sonner` (toast)

Example dialog:

```tsx
import Dialog from '~/components/modules/dialog';

<Dialog
	title="Confirm"
	button={{ text: 'Open Dialog', variant: 'outline' }}
	body="Ready to proceed?"
/>;
```

Remember to keep the global providers in `components/util/providers.tsx` when using components that require a provider (e.g., `sonner`).
