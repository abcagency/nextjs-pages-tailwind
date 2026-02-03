# UI Components

This project uses shadcn Base UI primitives with light wrappers in `components/modules/core` and a compound form API in `components/modules/form`.

**Form API**

Use the compound `Form` API to build forms with minimal markup. The default contact page now renders the insurance claim intake example.

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
		<Form.DateRange
			name="lossWindow"
			label="Loss Window"
			placeholder="Select range…"
		/>
		<Form.Time name="lossTime" label="Loss Time" placeholder="09:15…" />
		<Form.Checkbox
			name="fraudAcknowledgement"
			label="I understand that insurance fraud is a crime."
			required={true}
		/>
	</Form.Root>
);
```

**Custom Composition**

Use `Form.Field` and `Form.Control` for custom layouts like input groups.

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

**Masking**

Use `mask` and `unmask` on `Input`, or the thin `PhoneInput` and `CurrencyInput` wrappers.

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
