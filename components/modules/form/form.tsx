'use client';

import type {
	ComponentPropsWithoutRef,
	ReactElement,
	ReactNode,
	Ref
} from 'react';
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
import { Switch, SwitchThumb } from '~/components/modules/core/switch';
import { cn } from '~/lib/utils';

type FormRootProps<TFieldValues extends FieldValues> = Omit<
	ComponentPropsWithoutRef<'form'>,
	'onSubmit'
> & {
	form: UseFormReturn<TFieldValues>;
	onSubmit: SubmitHandler<TFieldValues>;
	onInvalid?: SubmitErrorHandler<TFieldValues>;
	focusFirstError?: boolean;
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
	focusFirstError = true,
	className,
	children,
	noValidate = true,
	...props
}: FormRootProps<TFieldValues>) {
	const handleInvalid: SubmitErrorHandler<TFieldValues> = errors => {
		onInvalid?.(errors);

		if (!focusFirstError) {
			return;
		}

		const firstError = findFirstErrorPath(errors);

		if (firstError) {
			form.setFocus(firstError as Path<TFieldValues>);
		}
	};

	return (
		<FormProvider {...form}>
			<form
				{...props}
				noValidate={noValidate}
				onSubmit={form.handleSubmit(onSubmit, handleInvalid)}
				className={cn('space-y-6', className)}
			>
				{children}
			</form>
		</FormProvider>
	);
}

type ControlledFieldProps = Omit<FormFieldProps, 'children' | 'className'> & {
	label?: ReactNode;
	description?: ReactNode;
	required?: boolean;
	fieldClassName?: string;
};

type FieldShellProps = ControlledFieldProps & {
	children: ReactNode;
};

function FieldShell({
	label,
	description,
	required,
	fieldClassName,
	children,
	...fieldProps
}: FieldShellProps) {
	return (
		<FormField {...fieldProps} className={fieldClassName}>
			<>
				{label && <FormLabel required={required}>{label}</FormLabel>}
				{children}
				{description && <FormDescription>{description}</FormDescription>}
				<FormMessage />
			</>
		</FormField>
	);
}

type FormControlProps = {
	children: ReactElement<Record<string, unknown>>;
	valueProp?: string;
	changeProp?: string;
	blurProp?: string;
	emptyValue?: unknown;
};

const mergeRefs =
	<T,>(...refs: Array<Ref<T> | undefined>) =>
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

const joinIds = (...ids: Array<unknown>) =>
	ids
		.flatMap(id => (typeof id === 'string' ? id.split(' ') : []))
		.filter(Boolean)
		.join(' ') || undefined;

function FormControl({
	children,
	valueProp = 'value',
	changeProp = 'onChange',
	blurProp = 'onBlur',
	emptyValue = ''
}: FormControlProps) {
	const { ariaDescribedBy, field, id, showError } = useFormField();
	const childProps = children.props as Record<string, unknown>;

	const handleChange = (event: unknown) => {
		field.onChange(event);
		(childProps[changeProp] as ((event: unknown) => void) | undefined)?.(event);
	};

	const handleBlur = (event: unknown) => {
		field.onBlur();
		(childProps[blurProp] as ((event: unknown) => void) | undefined)?.(event);
	};

	return React.cloneElement(children, {
		...childProps,
		id: childProps.id ?? id,
		name: childProps.name ?? field.name,
		[valueProp]: childProps[valueProp] ?? field.value ?? emptyValue,
		[changeProp]: handleChange,
		[blurProp]: handleBlur,
		'aria-describedby': joinIds(
			childProps['aria-describedby'],
			ariaDescribedBy
		),
		'aria-invalid': childProps['aria-invalid'] ?? (showError || undefined),
		ref: mergeRefs(
			field.ref,
			(childProps.ref as Ref<unknown> | undefined) ?? undefined
		),
		showError: childProps.showError ?? showError
	});
}

type FormInputProps = ControlledFieldProps &
	Omit<
		ComponentPropsWithoutRef<typeof Input>,
		keyof ControlledFieldProps | 'fieldName' | 'showError' | 'value'
	>;

function FormInput({
	label,
	description,
	required,
	fieldClassName,
	...props
}: FormInputProps) {
	const {
		name,
		rules,
		shouldUnregister,
		defaultValue,
		disabled,
		...inputProps
	} = props;

	return (
		<FieldShell
			name={name}
			rules={rules}
			shouldUnregister={shouldUnregister}
			defaultValue={defaultValue}
			disabled={disabled}
			label={label}
			description={description}
			required={required}
			fieldClassName={fieldClassName}
		>
			<FormControl>
				<Input {...inputProps} disabled={disabled} required={required} />
			</FormControl>
		</FieldShell>
	);
}

type FormTextareaProps = ControlledFieldProps &
	Omit<
		ComponentPropsWithoutRef<typeof Textarea>,
		keyof ControlledFieldProps | 'fieldName' | 'showError' | 'value'
	>;

function FormTextarea({
	label,
	description,
	required,
	fieldClassName,
	...props
}: FormTextareaProps) {
	const {
		name,
		rules,
		shouldUnregister,
		defaultValue,
		disabled,
		...textareaProps
	} = props;

	return (
		<FieldShell
			name={name}
			rules={rules}
			shouldUnregister={shouldUnregister}
			defaultValue={defaultValue}
			disabled={disabled}
			label={label}
			description={description}
			required={required}
			fieldClassName={fieldClassName}
		>
			<FormControl>
				<Textarea {...textareaProps} disabled={disabled} required={required} />
			</FormControl>
		</FieldShell>
	);
}

type FormSelectProps = ControlledFieldProps &
	Omit<
		ComponentPropsWithoutRef<typeof SelectField>,
		| keyof ControlledFieldProps
		| 'fieldName'
		| 'showError'
		| 'value'
		| 'onChange'
	>;

function FormSelectControl(
	props: Omit<
		ComponentPropsWithoutRef<typeof SelectField>,
		'fieldName' | 'showError' | 'value' | 'onChange'
	>
) {
	const { ariaDescribedBy, field, id, showError } = useFormField();

	return (
		<SelectField
			{...props}
			ref={field.ref}
			id={id}
			name={field.name}
			value={field.value ?? ''}
			onChange={field.onChange}
			showError={showError}
			aria-describedby={joinIds(props['aria-describedby'], ariaDescribedBy)}
			aria-invalid={props['aria-invalid'] ?? (showError || undefined)}
		/>
	);
}

function FormSelect({
	label,
	description,
	required,
	fieldClassName,
	...props
}: FormSelectProps) {
	const {
		name,
		rules,
		shouldUnregister,
		defaultValue,
		disabled,
		...selectProps
	} = props;

	return (
		<FieldShell
			name={name}
			rules={rules}
			shouldUnregister={shouldUnregister}
			defaultValue={defaultValue}
			disabled={disabled}
			label={label}
			description={description}
			required={required}
			fieldClassName={fieldClassName}
		>
			<FormSelectControl
				{...selectProps}
				disabled={disabled}
				required={required}
			/>
		</FieldShell>
	);
}

type FormCheckboxProps = ControlledFieldProps &
	Omit<
		ComponentPropsWithoutRef<typeof Checkbox>,
		| keyof ControlledFieldProps
		| 'fieldName'
		| 'showError'
		| 'checked'
		| 'onCheckedChange'
	> & {
		display?: CheckboxDisplay;
	};

type FormCheckboxControlProps = Omit<
	ComponentPropsWithoutRef<typeof Checkbox>,
	| 'checked'
	| 'description'
	| 'fieldName'
	| 'label'
	| 'onCheckedChange'
	| 'required'
	| 'showError'
> & {
	label?: ReactNode;
	description?: ReactNode;
	required?: boolean;
};

function FormCheckboxControl({
	label,
	description,
	required,
	...props
}: FormCheckboxControlProps) {
	const { ariaDescribedBy, descriptionId, field, id, showError } =
		useFormField();
	const describedBy = joinIds(
		description ? descriptionId : undefined,
		ariaDescribedBy
	);

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
			showError={showError}
			aria-describedby={describedBy}
			aria-invalid={showError || undefined}
		/>
	);
}

function FormCheckbox({
	label,
	description,
	required,
	fieldClassName,
	...props
}: FormCheckboxProps) {
	const {
		name,
		rules,
		shouldUnregister,
		defaultValue,
		disabled,
		...checkboxProps
	} = props;

	return (
		<FormField
			name={name}
			rules={rules}
			shouldUnregister={shouldUnregister}
			defaultValue={defaultValue}
			disabled={disabled}
			className={fieldClassName}
		>
			<>
				<FormCheckboxControl
					{...checkboxProps}
					disabled={disabled}
					label={label}
					description={description}
					required={required}
				/>
				<FormMessage />
			</>
		</FormField>
	);
}

type FormSwitchProps = ControlledFieldProps &
	Omit<
		ComponentPropsWithoutRef<typeof Switch>,
		keyof ControlledFieldProps | 'checked' | 'onCheckedChange'
	>;

type FormSwitchControlProps = Omit<
	ComponentPropsWithoutRef<typeof Switch>,
	'checked' | 'onCheckedChange'
>;

function FormSwitchControl({ className, ...props }: FormSwitchControlProps) {
	const { ariaDescribedBy, field, id, showError } = useFormField();

	return (
		<Switch
			{...props}
			ref={field.ref}
			id={id}
			name={field.name}
			checked={Boolean(field.value)}
			onCheckedChange={checked => field.onChange(checked)}
			aria-describedby={joinIds(props['aria-describedby'], ariaDescribedBy)}
			aria-invalid={props['aria-invalid'] ?? (showError || undefined)}
			className={cn(showError && 'ring-destructive/30 ring-2', className)}
		>
			<SwitchThumb />
		</Switch>
	);
}

function FormSwitch({
	label,
	description,
	required,
	fieldClassName,
	...props
}: FormSwitchProps) {
	const {
		name,
		rules,
		shouldUnregister,
		defaultValue,
		disabled,
		...switchProps
	} = props;

	return (
		<FieldShell
			name={name}
			rules={rules}
			shouldUnregister={shouldUnregister}
			defaultValue={defaultValue}
			disabled={disabled}
			label={label}
			description={description}
			required={required}
			fieldClassName={fieldClassName}
		>
			<FormSwitchControl
				{...switchProps}
				disabled={disabled}
				required={required}
			/>
		</FieldShell>
	);
}

type FormCheckboxGroupProps = ControlledFieldProps & {
	options: CheckboxOption[];
	layout?: 'vertical' | 'horizontal';
};

function FormCheckboxGroupControl({
	options,
	layout,
	required
}: Pick<FormCheckboxGroupProps, 'options' | 'layout' | 'required'>) {
	const { ariaDescribedBy, field, showError } = useFormField();

	return (
		<CheckboxGroup
			ref={field.ref as Ref<HTMLDivElement>}
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
	label,
	description,
	required,
	fieldClassName,
	options,
	layout,
	...fieldProps
}: FormCheckboxGroupProps) {
	return (
		<FieldShell
			{...fieldProps}
			label={label}
			description={description}
			required={required}
			fieldClassName={fieldClassName}
		>
			<FormCheckboxGroupControl
				options={options}
				layout={layout}
				required={required}
			/>
		</FieldShell>
	);
}

type FormRadioGroupProps = ControlledFieldProps & {
	options: RadioOption[];
	layout?: 'vertical' | 'horizontal';
};

function FormRadioGroupControl({
	options,
	layout,
	required
}: Pick<FormRadioGroupProps, 'options' | 'layout' | 'required'>) {
	const { ariaDescribedBy, field, showError } = useFormField();

	return (
		<RadioGroup
			ref={field.ref as Ref<HTMLDivElement>}
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
	label,
	description,
	required,
	fieldClassName,
	options,
	layout,
	...fieldProps
}: FormRadioGroupProps) {
	return (
		<FieldShell
			{...fieldProps}
			label={label}
			description={description}
			required={required}
			fieldClassName={fieldClassName}
		>
			<FormRadioGroupControl
				options={options}
				layout={layout}
				required={required}
			/>
		</FieldShell>
	);
}

type FormComboboxProps = ControlledFieldProps &
	Omit<
		ComponentPropsWithoutRef<typeof ComboboxField>,
		| keyof ControlledFieldProps
		| 'fieldName'
		| 'showError'
		| 'value'
		| 'onChange'
	> & {
		options: ComboboxOption[];
	};

function FormComboboxControl(
	props: Omit<
		ComponentPropsWithoutRef<typeof ComboboxField>,
		'fieldName' | 'showError' | 'value' | 'onChange'
	>
) {
	const { ariaDescribedBy, field, id, showError } = useFormField();

	return (
		<ComboboxField
			{...props}
			ref={field.ref}
			id={id}
			name={field.name}
			value={field.value ?? ''}
			onChange={field.onChange}
			showError={showError}
			aria-describedby={joinIds(props['aria-describedby'], ariaDescribedBy)}
			aria-invalid={props['aria-invalid'] ?? (showError || undefined)}
		/>
	);
}

function FormCombobox({
	label,
	description,
	required,
	fieldClassName,
	...props
}: FormComboboxProps) {
	const {
		name,
		rules,
		shouldUnregister,
		defaultValue,
		disabled,
		...comboboxProps
	} = props;

	return (
		<FieldShell
			name={name}
			rules={rules}
			shouldUnregister={shouldUnregister}
			defaultValue={defaultValue}
			disabled={disabled}
			label={label}
			description={description}
			required={required}
			fieldClassName={fieldClassName}
		>
			<FormComboboxControl
				{...comboboxProps}
				disabled={disabled}
				required={required}
			/>
		</FieldShell>
	);
}

type FormRangeProps = ControlledFieldProps &
	Omit<
		ComponentPropsWithoutRef<typeof RangeSlider>,
		| keyof ControlledFieldProps
		| 'fieldName'
		| 'value'
		| 'onChange'
		| 'showError'
	>;

function FormRangeControl(
	props: Omit<
		ComponentPropsWithoutRef<typeof RangeSlider>,
		'fieldName' | 'value' | 'onChange' | 'showError'
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
	label,
	description,
	required,
	fieldClassName,
	...props
}: FormRangeProps) {
	const {
		name,
		rules,
		shouldUnregister,
		defaultValue,
		disabled,
		...rangeProps
	} = props;

	return (
		<FieldShell
			name={name}
			rules={rules}
			shouldUnregister={shouldUnregister}
			defaultValue={defaultValue}
			disabled={disabled}
			label={label}
			description={description}
			required={required}
			fieldClassName={fieldClassName}
		>
			<FormRangeControl
				{...rangeProps}
				disabled={disabled}
				required={required}
			/>
		</FieldShell>
	);
}

type FormDateProps = ControlledFieldProps &
	Omit<
		ComponentPropsWithoutRef<typeof DateInput>,
		| keyof ControlledFieldProps
		| 'fieldName'
		| 'showError'
		| 'value'
		| 'onChange'
	>;

function FormDateControl(
	props: Omit<
		ComponentPropsWithoutRef<typeof DateInput>,
		'fieldName' | 'showError' | 'value' | 'onChange'
	>
) {
	const { ariaDescribedBy, field, id, showError } = useFormField();

	return (
		<DateInput
			{...props}
			ref={field.ref}
			id={id}
			name={field.name}
			value={field.value ?? ''}
			onChange={field.onChange}
			showError={showError}
			aria-describedby={joinIds(props['aria-describedby'], ariaDescribedBy)}
			aria-invalid={props['aria-invalid'] ?? (showError || undefined)}
		/>
	);
}

function FormDate({
	label,
	description,
	required,
	fieldClassName,
	...props
}: FormDateProps) {
	const {
		name,
		rules,
		shouldUnregister,
		defaultValue,
		disabled,
		...dateProps
	} = props;

	return (
		<FieldShell
			name={name}
			rules={rules}
			shouldUnregister={shouldUnregister}
			defaultValue={defaultValue}
			disabled={disabled}
			label={label}
			description={description}
			required={required}
			fieldClassName={fieldClassName}
		>
			<FormDateControl {...dateProps} disabled={disabled} required={required} />
		</FieldShell>
	);
}

type FormDateRangeProps = ControlledFieldProps &
	Omit<
		ComponentPropsWithoutRef<typeof DateRangeInput>,
		| keyof ControlledFieldProps
		| 'fieldName'
		| 'showError'
		| 'value'
		| 'onChange'
	>;

function FormDateRangeControl(
	props: Omit<
		ComponentPropsWithoutRef<typeof DateRangeInput>,
		'fieldName' | 'showError' | 'value' | 'onChange'
	>
) {
	const { ariaDescribedBy, field, id, showError } = useFormField();

	return (
		<DateRangeInput
			{...props}
			ref={field.ref}
			id={id}
			name={field.name}
			value={(field.value ?? {}) as DateRangeValue}
			onChange={field.onChange}
			showError={showError}
			aria-describedby={joinIds(props['aria-describedby'], ariaDescribedBy)}
			aria-invalid={props['aria-invalid'] ?? (showError || undefined)}
		/>
	);
}

function FormDateRange({
	label,
	description,
	required,
	fieldClassName,
	...props
}: FormDateRangeProps) {
	const {
		name,
		rules,
		shouldUnregister,
		defaultValue,
		disabled,
		...dateProps
	} = props;

	return (
		<FieldShell
			name={name}
			rules={rules}
			shouldUnregister={shouldUnregister}
			defaultValue={defaultValue}
			disabled={disabled}
			label={label}
			description={description}
			required={required}
			fieldClassName={fieldClassName}
		>
			<FormDateRangeControl
				{...dateProps}
				disabled={disabled}
				required={required}
			/>
		</FieldShell>
	);
}

type FormDateTimeProps = ControlledFieldProps &
	Omit<
		ComponentPropsWithoutRef<typeof DateTimeInput>,
		| keyof ControlledFieldProps
		| 'fieldName'
		| 'showError'
		| 'value'
		| 'onChange'
		| 'timeValue'
		| 'onTimeChange'
		| 'timeRef'
	> & {
		timeName: string;
		timePlaceholder?: string;
	};

type FormDateTimeControlProps = Omit<
	ComponentPropsWithoutRef<typeof DateTimeInput>,
	| 'fieldName'
	| 'onChange'
	| 'onTimeChange'
	| 'showError'
	| 'timeRef'
	| 'timeValue'
	| 'value'
> & {
	timeName: string;
	timePlaceholder?: string;
};

function FormDateTimeControl({
	timeName,
	timePlaceholder,
	...props
}: FormDateTimeControlProps) {
	const { ariaDescribedBy, field, id, showError } = useFormField();
	const { control } = useFormContext();
	const { field: timeField } = useController({ name: timeName, control });

	return (
		<DateTimeInput
			{...props}
			ref={field.ref}
			id={id}
			name={field.name}
			value={field.value ?? ''}
			onChange={field.onChange}
			showError={showError}
			aria-describedby={joinIds(props['aria-describedby'], ariaDescribedBy)}
			aria-invalid={props['aria-invalid'] ?? (showError || undefined)}
			timeName={timeName}
			timeValue={timeField.value ?? ''}
			onTimeChange={timeField.onChange}
			timePlaceholder={timePlaceholder}
			timeRef={timeField.ref}
		/>
	);
}

function FormDateTime({
	label,
	description,
	required,
	fieldClassName,
	timeName,
	timePlaceholder,
	...props
}: FormDateTimeProps) {
	const {
		name,
		rules,
		shouldUnregister,
		defaultValue,
		disabled,
		...dateProps
	} = props;

	return (
		<FieldShell
			name={name}
			rules={rules}
			shouldUnregister={shouldUnregister}
			defaultValue={defaultValue}
			disabled={disabled}
			label={label}
			description={description}
			required={required}
			fieldClassName={fieldClassName}
		>
			<FormDateTimeControl
				{...dateProps}
				disabled={disabled}
				required={required}
				timeName={timeName}
				timePlaceholder={timePlaceholder}
			/>
		</FieldShell>
	);
}

type FormTimeProps = ControlledFieldProps &
	Omit<
		ComponentPropsWithoutRef<typeof TimeInput>,
		keyof ControlledFieldProps | 'fieldName' | 'showError' | 'value'
	>;

function FormTime({
	label,
	description,
	required,
	fieldClassName,
	...props
}: FormTimeProps) {
	const {
		name,
		rules,
		shouldUnregister,
		defaultValue,
		disabled,
		...timeProps
	} = props;

	return (
		<FieldShell
			name={name}
			rules={rules}
			shouldUnregister={shouldUnregister}
			defaultValue={defaultValue}
			disabled={disabled}
			label={label}
			description={description}
			required={required}
			fieldClassName={fieldClassName}
		>
			<FormControl>
				<TimeInput {...timeProps} disabled={disabled} required={required} />
			</FormControl>
		</FieldShell>
	);
}

type FormPhoneProps = ControlledFieldProps &
	Omit<
		ComponentPropsWithoutRef<typeof PhoneInput>,
		keyof ControlledFieldProps | 'fieldName' | 'showError' | 'value'
	>;

function FormPhone({
	label,
	description,
	required,
	fieldClassName,
	...props
}: FormPhoneProps) {
	const {
		name,
		rules,
		shouldUnregister,
		defaultValue,
		disabled,
		...phoneProps
	} = props;

	return (
		<FieldShell
			name={name}
			rules={rules}
			shouldUnregister={shouldUnregister}
			defaultValue={defaultValue}
			disabled={disabled}
			label={label}
			description={description}
			required={required}
			fieldClassName={fieldClassName}
		>
			<FormControl>
				<PhoneInput {...phoneProps} disabled={disabled} required={required} />
			</FormControl>
		</FieldShell>
	);
}

type FormCurrencyProps = ControlledFieldProps &
	Omit<
		ComponentPropsWithoutRef<typeof CurrencyInput>,
		keyof ControlledFieldProps | 'fieldName' | 'showError' | 'value'
	>;

function FormCurrency({
	label,
	description,
	required,
	fieldClassName,
	...props
}: FormCurrencyProps) {
	const {
		name,
		rules,
		shouldUnregister,
		defaultValue,
		disabled,
		...currencyProps
	} = props;

	return (
		<FieldShell
			name={name}
			rules={rules}
			shouldUnregister={shouldUnregister}
			defaultValue={defaultValue}
			disabled={disabled}
			label={label}
			description={description}
			required={required}
			fieldClassName={fieldClassName}
		>
			<FormControl>
				<CurrencyInput
					{...currencyProps}
					disabled={disabled}
					required={required}
				/>
			</FormControl>
		</FieldShell>
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
	Checkbox: FormCheckbox,
	CheckboxGroup: FormCheckboxGroup,
	RadioGroup: FormRadioGroup,
	Switch: FormSwitch,
	Combobox: FormCombobox,
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
	FormCheckbox,
	FormCheckboxGroup,
	FormRadioGroup,
	FormSwitch,
	FormCombobox,
	FormRange,
	FormDate,
	FormDateRange,
	FormDateTime,
	FormTime,
	FormPhone,
	FormCurrency,
	useFormField
};
