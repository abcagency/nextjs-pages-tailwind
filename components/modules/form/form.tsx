'use client';

import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import React from 'react';
import type {
	FieldErrors,
	FieldValues,
	Path,
	SubmitErrorHandler,
	SubmitHandler,
	UseFormReturn
} from 'react-hook-form';
import { FormProvider, useController, useFormContext } from 'react-hook-form';

import type { FormFieldProps } from '~/components/modules/form/field';
import {
	FormDescription,
	FormField,
	FormLabel,
	FormMessage,
	useFormField
} from '~/components/modules/form/field';
import type { CheckboxDisplay } from '~/components/modules/form/checkbox';
import Checkbox from '~/components/modules/form/checkbox';
import type { CheckboxOption } from '~/components/modules/form/checkbox-group';
import CheckboxGroup from '~/components/modules/form/checkbox-group';
import type { ComboboxOption } from '~/components/modules/form/combobox';
import ComboboxField from '~/components/modules/form/combobox';
import CurrencyInput from '~/components/modules/form/currency';
import type { DateRangeValue } from '~/components/modules/form/date';
import {
	DateInput,
	DateRangeInput,
	DateTimeInput
} from '~/components/modules/form/date';
import Input from '~/components/modules/form/input';
import PhoneInput from '~/components/modules/form/phone';
import type { RadioOption } from '~/components/modules/form/radio-group';
import RadioGroup from '~/components/modules/form/radio-group';
import RangeSlider from '~/components/modules/form/range-slider';
import SelectField from '~/components/modules/form/select';
import Textarea from '~/components/modules/form/textarea';
import TimeInput from '~/components/modules/form/time';
import { cn } from '~/lib/utils';

type FormRootProps<TFieldValues extends FieldValues> = Omit<
	ComponentPropsWithoutRef<'form'>,
	'onSubmit'
> & {
	form: UseFormReturn<TFieldValues>;
	onSubmit: SubmitHandler<TFieldValues>;
	onInvalid?: SubmitErrorHandler<TFieldValues>;
};

const findFirstErrorPath = (
	errors: FieldErrors,
	parentPath = ''
): string | undefined => {
	for (const [key, value] of Object.entries(errors)) {
		if (!value) {
			continue;
		}

		const currentPath = parentPath ? `${parentPath}.${key}` : key;
		const message = (value as { message?: string }).message;
		if (message) {
			return currentPath;
		}

		if (typeof value === 'object') {
			const nestedPath = findFirstErrorPath(value as FieldErrors, currentPath);
			if (nestedPath) {
				return nestedPath;
			}
		}
	}

	return undefined;
};

function FormRoot<TFieldValues extends FieldValues>({
	form,
	onSubmit,
	onInvalid,
	className,
	children,
	...props
}: FormRootProps<TFieldValues>) {
	const handleInvalid: SubmitErrorHandler<TFieldValues> = errors => {
		onInvalid?.(errors);
		const firstError = findFirstErrorPath(errors);
		if (firstError) {
			form.setFocus(firstError as Path<TFieldValues>);
		}
	};

	return (
		<FormProvider {...form}>
			<form
				{...props}
				onSubmit={form.handleSubmit(onSubmit, handleInvalid)}
				className={cn('space-y-6', className)}
			>
				{children}
			</form>
		</FormProvider>
	);
}

type FormControlProps = {
	children: ReactElement<Record<string, unknown>>;
};

const mergeRefs =
	<T,>(...refs: Array<React.Ref<T> | undefined>) =>
	(node: T | null) => {
		refs.forEach(ref => {
			if (!ref) {
				return;
			}
			if (typeof ref === 'function') {
				ref(node);
				return;
			}
			(ref as React.MutableRefObject<T | null>).current = node;
		});
	};

function FormControl({ children }: FormControlProps) {
	const { field, descriptionId, messageId, showError, id } = useFormField();
	const childProps = children.props as Record<string, unknown>;
	const ariaDescribedBy =
		[descriptionId, messageId].filter(Boolean).join(' ') || undefined;

	const handleChange = (event: unknown) => {
		field.onChange(event);
		(childProps.onChange as ((event: unknown) => void) | undefined)?.(event);
	};

	const handleBlur = (event: unknown) => {
		field.onBlur();
		(childProps.onBlur as ((event: unknown) => void) | undefined)?.(event);
	};

	return React.cloneElement(children, {
		...childProps,
		id,
		name: field.name,
		value: childProps.value ?? field.value ?? '',
		onChange: handleChange,
		onBlur: handleBlur,
		'aria-describedby': ariaDescribedBy,
		'aria-invalid': showError || undefined,
		ref: mergeRefs(
			field.ref,
			(childProps.ref as React.Ref<unknown>) ?? undefined
		),
		showError: childProps.showError ?? showError
	});
}

type FormInputProps = Omit<FormFieldProps, 'children'> &
	ComponentPropsWithoutRef<typeof Input> & {
		label?: string;
		description?: string;
		required?: boolean;
	};

function FormInput({
	name,
	label,
	description,
	required,
	...props
}: FormInputProps) {
	return (
		<FormField name={name}>
			<>
				{label && <FormLabel required={required}>{label}</FormLabel>}
				<FormControl>
					<Input {...props} required={required} />
				</FormControl>
				{description && <FormDescription>{description}</FormDescription>}
				<FormMessage />
			</>
		</FormField>
	);
}

type FormTextareaProps = Omit<FormFieldProps, 'children'> &
	ComponentPropsWithoutRef<typeof Textarea> & {
		label?: string;
		description?: string;
		required?: boolean;
	};

function FormTextarea({
	name,
	label,
	description,
	required,
	...props
}: FormTextareaProps) {
	return (
		<FormField name={name}>
			<>
				{label && <FormLabel required={required}>{label}</FormLabel>}
				<FormControl>
					<Textarea {...props} required={required} />
				</FormControl>
				{description && <FormDescription>{description}</FormDescription>}
				<FormMessage />
			</>
		</FormField>
	);
}

type FormSelectProps = Omit<FormFieldProps, 'children'> &
	ComponentPropsWithoutRef<typeof SelectField> & {
		label?: string;
		description?: string;
		required?: boolean;
	};

function FormSelectControl(
	props: ComponentPropsWithoutRef<typeof SelectField>
) {
	const { field, descriptionId, messageId, showError, id } = useFormField();
	const ariaDescribedBy =
		[descriptionId, messageId].filter(Boolean).join(' ') || undefined;

	return (
		<SelectField
			{...props}
			ref={field.ref}
			id={id}
			name={field.name}
			value={field.value ?? ''}
			onChange={field.onChange}
			showError={showError}
			aria-describedby={ariaDescribedBy}
			aria-invalid={showError || undefined}
		/>
	);
}

function FormSelect({
	name,
	label,
	description,
	required,
	...props
}: FormSelectProps) {
	return (
		<FormField name={name}>
			<>
				{label && <FormLabel required={required}>{label}</FormLabel>}
				<FormSelectControl {...props} required={required} />
				{description && <FormDescription>{description}</FormDescription>}
				<FormMessage />
			</>
		</FormField>
	);
}

type FormComboboxProps = Omit<FormFieldProps, 'children'> &
	ComponentPropsWithoutRef<typeof ComboboxField> & {
		label?: string;
		description?: string;
		required?: boolean;
		options: ComboboxOption[];
	};

function FormComboboxControl(
	props: ComponentPropsWithoutRef<typeof ComboboxField>
) {
	const { field, descriptionId, messageId, showError, id } = useFormField();
	const ariaDescribedBy =
		[descriptionId, messageId].filter(Boolean).join(' ') || undefined;

	return (
		<ComboboxField
			{...props}
			ref={field.ref}
			id={id}
			name={field.name}
			value={field.value ?? ''}
			onChange={field.onChange}
			showError={showError}
			aria-describedby={ariaDescribedBy}
			aria-invalid={showError || undefined}
		/>
	);
}

function FormCombobox({
	name,
	label,
	description,
	required,
	...props
}: FormComboboxProps) {
	return (
		<FormField name={name}>
			<>
				{label && <FormLabel required={required}>{label}</FormLabel>}
				<FormComboboxControl {...props} required={required} />
				{description && <FormDescription>{description}</FormDescription>}
				<FormMessage />
			</>
		</FormField>
	);
}

type FormCheckboxProps = Omit<FormFieldProps, 'children'> &
	ComponentPropsWithoutRef<typeof Checkbox> & {
		label?: string;
		description?: string;
		required?: boolean;
		display?: CheckboxDisplay;
	};

type FormCheckboxControlProps = ComponentPropsWithoutRef<typeof Checkbox> & {
	label?: string;
	description?: string;
	required?: boolean;
	display?: CheckboxDisplay;
};

function FormCheckboxControl({
	label,
	description,
	required,
	display,
	...props
}: FormCheckboxControlProps) {
	const { field, showError, id } = useFormField();

	return (
		<Checkbox
			{...props}
			ref={field.ref}
			id={id}
			name={field.name}
			checked={Boolean(field.value)}
			onCheckedChange={checked => field.onChange(checked)}
			label={label}
			description={description}
			required={required}
			display={display}
			showError={showError}
		/>
	);
}

function FormCheckbox({
	name,
	label,
	description,
	required,
	display,
	...props
}: FormCheckboxProps) {
	return (
		<FormField name={name}>
			<>
				<FormCheckboxControl
					{...props}
					label={label}
					description={description}
					required={required}
					display={display}
				/>
				<FormMessage />
			</>
		</FormField>
	);
}

type FormCheckboxGroupProps = Omit<FormFieldProps, 'children'> & {
	label?: string;
	description?: string;
	required?: boolean;
	options: CheckboxOption[];
	layout?: 'vertical' | 'horizontal';
};

type FormCheckboxGroupControlProps = {
	options: CheckboxOption[];
	layout?: 'vertical' | 'horizontal';
	required?: boolean;
};

function FormCheckboxGroupControl({
	options,
	layout,
	required
}: FormCheckboxGroupControlProps) {
	const { field, showError, descriptionId, messageId } = useFormField();
	const ariaDescribedBy =
		[descriptionId, messageId].filter(Boolean).join(' ') || undefined;

	return (
		<CheckboxGroup
			ref={field.ref as React.Ref<HTMLDivElement>}
			name={field.name}
			value={field.value ?? []}
			onChange={field.onChange}
			options={options}
			layout={layout}
			required={required}
			showError={showError}
			aria-describedby={ariaDescribedBy}
			aria-invalid={showError || undefined}
		/>
	);
}

function FormCheckboxGroup({
	name,
	label,
	description,
	required,
	options,
	layout,
	...props
}: FormCheckboxGroupProps) {
	return (
		<FormField name={name} {...props}>
			<>
				{label && <FormLabel required={required}>{label}</FormLabel>}
				<FormCheckboxGroupControl
					options={options}
					layout={layout}
					required={required}
				/>
				{description && <FormDescription>{description}</FormDescription>}
				<FormMessage />
			</>
		</FormField>
	);
}

type FormRadioGroupProps = Omit<FormFieldProps, 'children'> & {
	label?: string;
	description?: string;
	required?: boolean;
	options: RadioOption[];
	layout?: 'vertical' | 'horizontal';
};

type FormRadioGroupControlProps = {
	options: RadioOption[];
	layout?: 'vertical' | 'horizontal';
	required?: boolean;
};

function FormRadioGroupControl({
	options,
	layout,
	required
}: FormRadioGroupControlProps) {
	const { field, showError, descriptionId, messageId } = useFormField();
	const ariaDescribedBy =
		[descriptionId, messageId].filter(Boolean).join(' ') || undefined;

	return (
		<RadioGroup
			ref={field.ref as React.Ref<HTMLDivElement>}
			name={field.name}
			value={field.value ?? ''}
			onChange={field.onChange}
			options={options}
			layout={layout}
			required={required}
			showError={showError}
			aria-describedby={ariaDescribedBy}
			aria-invalid={showError || undefined}
		/>
	);
}

function FormRadioGroup({
	name,
	label,
	description,
	required,
	options,
	layout,
	...props
}: FormRadioGroupProps) {
	return (
		<FormField name={name} {...props}>
			<>
				{label && <FormLabel required={required}>{label}</FormLabel>}
				<FormRadioGroupControl
					options={options}
					layout={layout}
					required={required}
				/>
				{description && <FormDescription>{description}</FormDescription>}
				<FormMessage />
			</>
		</FormField>
	);
}

type FormRangeProps = Omit<FormFieldProps, 'children'> &
	Omit<
		ComponentPropsWithoutRef<typeof RangeSlider>,
		'fieldName' | 'value' | 'onChange'
	> & {
		label?: string;
		description?: string;
		required?: boolean;
	};

function FormRangeControl(
	props: Omit<
		ComponentPropsWithoutRef<typeof RangeSlider>,
		'fieldName' | 'value' | 'onChange'
	>
) {
	const { field, showError } = useFormField();

	return (
		<RangeSlider
			{...props}
			ref={field.ref}
			fieldName={field.name}
			value={Number(field.value ?? 0)}
			onChange={field.onChange}
			showError={showError}
		/>
	);
}

function FormRange({
	name,
	label,
	description,
	required,
	...props
}: FormRangeProps) {
	return (
		<FormField name={name}>
			<>
				{label && <FormLabel required={required}>{label}</FormLabel>}
				<FormRangeControl {...props} required={required} />
				{description && <FormDescription>{description}</FormDescription>}
				<FormMessage />
			</>
		</FormField>
	);
}

type FormDateProps = Omit<FormFieldProps, 'children'> &
	ComponentPropsWithoutRef<typeof DateInput> & {
		label?: string;
		description?: string;
		required?: boolean;
	};

function FormDateControl(props: ComponentPropsWithoutRef<typeof DateInput>) {
	const { field, showError, descriptionId, messageId, id } = useFormField();
	const ariaDescribedBy =
		[descriptionId, messageId].filter(Boolean).join(' ') || undefined;

	return (
		<DateInput
			{...props}
			ref={field.ref}
			id={id}
			name={field.name}
			value={field.value ?? ''}
			onChange={field.onChange}
			showError={showError}
			aria-describedby={ariaDescribedBy}
			aria-invalid={showError || undefined}
		/>
	);
}

function FormDate({
	name,
	label,
	description,
	required,
	...props
}: FormDateProps) {
	return (
		<FormField name={name}>
			<>
				{label && <FormLabel required={required}>{label}</FormLabel>}
				<FormDateControl {...props} required={required} />
				{description && <FormDescription>{description}</FormDescription>}
				<FormMessage />
			</>
		</FormField>
	);
}

type FormDateRangeProps = Omit<FormFieldProps, 'children'> &
	ComponentPropsWithoutRef<typeof DateRangeInput> & {
		label?: string;
		description?: string;
		required?: boolean;
	};

function FormDateRangeControl(
	props: ComponentPropsWithoutRef<typeof DateRangeInput>
) {
	const { field, showError, descriptionId, messageId, id } = useFormField();
	const ariaDescribedBy =
		[descriptionId, messageId].filter(Boolean).join(' ') || undefined;

	return (
		<DateRangeInput
			{...props}
			ref={field.ref}
			id={id}
			name={field.name}
			value={field.value ?? {}}
			onChange={field.onChange}
			showError={showError}
			aria-describedby={ariaDescribedBy}
			aria-invalid={showError || undefined}
		/>
	);
}

function FormDateRange({
	name,
	label,
	description,
	required,
	...props
}: FormDateRangeProps) {
	return (
		<FormField name={name}>
			<>
				{label && <FormLabel required={required}>{label}</FormLabel>}
				<FormDateRangeControl {...props} required={required} />
				{description && <FormDescription>{description}</FormDescription>}
				<FormMessage />
			</>
		</FormField>
	);
}

type FormDateTimeProps = Omit<FormFieldProps, 'children'> & {
	label?: string;
	description?: string;
	required?: boolean;
	timeName: string;
	timePlaceholder?: string;
};

type FormDateTimeControlProps = ComponentPropsWithoutRef<
	typeof DateTimeInput
> & {
	timeName: string;
	timePlaceholder?: string;
};

function FormDateTimeControl({
	timeName,
	timePlaceholder,
	...props
}: FormDateTimeControlProps) {
	const { field, showError, descriptionId, messageId, id } = useFormField();
	const { control } = useFormContext();
	const { field: timeField } = useController({ name: timeName, control });
	const ariaDescribedBy =
		[descriptionId, messageId].filter(Boolean).join(' ') || undefined;

	return (
		<DateTimeInput
			{...props}
			ref={field.ref}
			id={id}
			name={field.name}
			value={field.value ?? ''}
			onChange={field.onChange}
			showError={showError}
			aria-describedby={ariaDescribedBy}
			aria-invalid={showError || undefined}
			timeName={timeName}
			timeValue={timeField.value ?? ''}
			onTimeChange={timeField.onChange}
			timePlaceholder={timePlaceholder}
			timeRef={timeField.ref}
		/>
	);
}

function FormDateTime({
	name,
	label,
	description,
	required,
	timeName,
	timePlaceholder,
	...props
}: FormDateTimeProps) {
	return (
		<FormField name={name}>
			<>
				{label && <FormLabel required={required}>{label}</FormLabel>}
				<FormDateTimeControl
					{...props}
					timeName={timeName}
					timePlaceholder={timePlaceholder}
					required={required}
				/>
				{description && <FormDescription>{description}</FormDescription>}
				<FormMessage />
			</>
		</FormField>
	);
}

type FormTimeProps = Omit<FormFieldProps, 'children'> &
	ComponentPropsWithoutRef<typeof TimeInput> & {
		label?: string;
		description?: string;
		required?: boolean;
	};

function FormTime({
	name,
	label,
	description,
	required,
	...props
}: FormTimeProps) {
	return (
		<FormField name={name}>
			<>
				{label && <FormLabel required={required}>{label}</FormLabel>}
				<FormControl>
					<TimeInput {...props} required={required} />
				</FormControl>
				{description && <FormDescription>{description}</FormDescription>}
				<FormMessage />
			</>
		</FormField>
	);
}

type FormPhoneProps = Omit<FormFieldProps, 'children'> &
	ComponentPropsWithoutRef<typeof PhoneInput> & {
		label?: string;
		description?: string;
		required?: boolean;
	};

function FormPhone({
	name,
	label,
	description,
	required,
	...props
}: FormPhoneProps) {
	return (
		<FormField name={name}>
			<>
				{label && <FormLabel required={required}>{label}</FormLabel>}
				<FormControl>
					<PhoneInput {...props} required={required} />
				</FormControl>
				{description && <FormDescription>{description}</FormDescription>}
				<FormMessage />
			</>
		</FormField>
	);
}

type FormCurrencyProps = Omit<FormFieldProps, 'children'> &
	ComponentPropsWithoutRef<typeof CurrencyInput> & {
		label?: string;
		description?: string;
		required?: boolean;
	};

function FormCurrency({
	name,
	label,
	description,
	required,
	...props
}: FormCurrencyProps) {
	return (
		<FormField name={name}>
			<>
				{label && <FormLabel required={required}>{label}</FormLabel>}
				<FormControl>
					<CurrencyInput {...props} required={required} />
				</FormControl>
				{description && <FormDescription>{description}</FormDescription>}
				<FormMessage />
			</>
		</FormField>
	);
}

const Form = {
	Root: FormRoot,
	Field: FormField,
	Label: FormLabel,
	Control: FormControl,
	Description: FormDescription,
	Message: FormMessage,
	Input: FormInput,
	Textarea: FormTextarea,
	Select: FormSelect,
	Combobox: FormCombobox,
	Checkbox: FormCheckbox,
	CheckboxGroup: FormCheckboxGroup,
	RadioGroup: FormRadioGroup,
	Range: FormRange,
	Date: FormDate,
	DateRange: FormDateRange,
	DateTime: FormDateTime,
	Time: FormTime,
	Phone: FormPhone,
	Currency: FormCurrency
};

export {
	Form,
	FormRoot,
	FormControl,
	FormInput,
	FormTextarea,
	FormSelect,
	FormCombobox,
	FormCheckbox,
	FormCheckboxGroup,
	FormRadioGroup,
	FormRange,
	FormDate,
	FormDateRange,
	FormDateTime,
	FormTime,
	FormPhone,
	FormCurrency,
	useFormField
};
