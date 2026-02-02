import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
import { forwardRef } from 'react';
import type { FieldErrors, FieldValues, UseFormSetValue } from 'react-hook-form';

import LabelAndError from '~/components/modules/form/label-error';
import Input from '~/components/modules/form/input';
import PhoneInput from '~/components/modules/form/phone';
import Select from '~/components/modules/form/select';
import Textarea from '~/components/modules/form/textarea';
import RangeSlider from '~/components/modules/form/range-slider';
import Checkbox from '~/components/modules/form/checkbox';
import TimeInput from '~/components/modules/form/time';
import RadioGroup from '~/components/modules/form/radio-group';
import CheckboxGroup from '~/components/modules/form/checkbox-group';

export type FormOption = {
	value: string;
	label: string;
};

type FieldType =
	| 'input'
	| 'select'
	| 'phone'
	| 'textarea'
	| 'time'
	| 'checkbox'
	| 'checkbox-group'
	| 'radio-group'
	| 'range';

type FieldProps = Omit<ComponentPropsWithoutRef<'input'>, 'name' | 'type'> & {
	className?: string;
	fieldClassName?: string;
	type?: FieldType;
	fieldType?: string;
	required?: boolean;
	fieldName: string;
	disabled?: boolean;
	errorsFieldName?: string;
	displayName: string;
	helpText?: string;
	placeholder?: string;
	options?: FormOption[];
	rows?: number;
	errors?: FieldErrors<FieldValues>;
	isSubmitting?: boolean;
	children?: ReactNode;
	fieldValue?: number | string;
	setFieldValue?: (value: number) => void;
	setValue?: UseFormSetValue<FieldValues>;
	layout?: 'vertical' | 'horizontal';
	mask?: ComponentPropsWithoutRef<typeof Input>['mask'];
	unmask?: ComponentPropsWithoutRef<typeof Input>['unmask'];
	min?: ComponentPropsWithoutRef<'input'>['min'];
	max?: ComponentPropsWithoutRef<'input'>['max'];
	maxValue?: number | null;
	step?: ComponentPropsWithoutRef<'input'>['step'];
};

const Field = forwardRef<HTMLElement, FieldProps>(
	(
		{
			className,
			fieldClassName,
			type = 'input',
			fieldType = 'text',
			required = false,
			fieldName,
			disabled = false,
			errorsFieldName,
			displayName,
			helpText,
			placeholder,
			options,
			rows,
			errors,
			isSubmitting,
			children,
			fieldValue,
			setFieldValue,
			setValue,
			layout,
			mask,
			unmask = true,
			min,
			max,
			maxValue,
			step,
			...rest
		},
		ref
	) => {
		const showError =
			errors && (errors[fieldName] || (errorsFieldName && errors[errorsFieldName]));

		const inputProps = rest as ComponentPropsWithoutRef<'input'>;
		const selectProps = rest as ComponentPropsWithoutRef<'select'>;
		const textareaProps = rest as ComponentPropsWithoutRef<'textarea'>;

		return (
			<div
				className={`
				relative
				${className ?? ''}
			`}
			>
				{type !== 'checkbox' && (
					<LabelAndError
						fieldName={fieldName}
						errorsFieldName={errorsFieldName}
						displayName={displayName}
						helpText={helpText}
						errors={errors as FieldErrors<Record<string, unknown>>}
						required={required}
					/>
				)}

				{(() => {
					switch (type) {
						case 'input':
							return (
								<Input
									ref={ref as Ref<HTMLInputElement>}
									type={fieldType}
									className={fieldClassName}
									required={required}
									fieldName={fieldName}
									showError={Boolean(showError)}
									placeholder={placeholder}
									isSubmitting={isSubmitting}
									disabled={disabled}
									mask={mask}
									unmask={unmask}
									{...inputProps}
								/>
							);
						case 'select':
							return (
								<Select
									ref={ref as Ref<HTMLSelectElement>}
									className={fieldClassName}
									required={required}
									fieldName={fieldName}
									showError={Boolean(showError)}
									placeholder={placeholder}
									isSubmitting={isSubmitting}
									disabled={disabled}
									options={options ?? []}
									{...selectProps}
								/>
							);
						case 'phone':
							return (
								<PhoneInput
									ref={ref as Ref<HTMLInputElement>}
									className={fieldClassName}
									required={required}
									fieldName={fieldName}
									showError={Boolean(showError)}
									placeholder={placeholder}
									isSubmitting={isSubmitting}
									{...inputProps}
								/>
							);
						case 'textarea':
							return (
								<Textarea
									ref={ref as Ref<HTMLTextAreaElement>}
									className={fieldClassName}
									required={required}
									fieldName={fieldName}
									showError={Boolean(showError)}
									placeholder={placeholder}
									rows={rows}
									isSubmitting={isSubmitting}
									{...textareaProps}
								/>
							);
						case 'time':
							return (
								<TimeInput
									ref={ref as Ref<HTMLInputElement>}
									className={fieldClassName}
									required={required}
									fieldName={fieldName}
									showError={Boolean(showError)}
									placeholder={placeholder}
									isSubmitting={isSubmitting}
									disabled={disabled}
									{...inputProps}
								/>
							);
						case 'checkbox': {
							const checkboxValue =
								typeof inputProps.checked === 'boolean'
									? inputProps.checked
									: Boolean(inputProps.value);
							const { value: _inputValue, ...checkboxInputProps } = inputProps;

							return (
								<div className="flex flex-col justify-center h-full text-pretty">
									<Checkbox
										ref={ref as Ref<HTMLInputElement>}
										className={fieldClassName}
										required={required}
										fieldName={fieldName}
										showError={Boolean(showError)}
										displayName={displayName}
										isSubmitting={isSubmitting}
										disabled={disabled}
										value={checkboxValue}
										{...checkboxInputProps}
									/>
									{showError && (
										<p className="mt-2 text-sm text-red-600">
											{showError?.message?.toString()}
										</p>
									)}
								</div>
							);
						}
						case 'checkbox-group':
							return (
								<CheckboxGroup
									ref={ref as Ref<HTMLDivElement>}
									name={fieldName}
									options={options}
									value={inputProps.value as unknown as string[]}
									onChange={
										inputProps.onChange as unknown as (value: string[]) => void
									}
									onBlur={inputProps.onBlur}
									className={fieldClassName}
									labelClassName=""
									disabled={disabled}
									required={required}
									isSubmitting={isSubmitting}
									showError={Boolean(showError)}
									layout={layout}
								/>
							);
						case 'radio-group':
							return (
								<RadioGroup
									ref={ref as Ref<HTMLDivElement>}
									name={fieldName}
									options={options}
									value={inputProps.value as string}
									onChange={
										inputProps.onChange as unknown as (value: string) => void
									}
									onBlur={inputProps.onBlur}
									className={fieldClassName}
									labelClassName=""
									disabled={disabled}
									required={required}
									isSubmitting={isSubmitting}
									showError={Boolean(showError)}
									layout={layout}
								/>
							);
						case 'range':
							return (
								<RangeSlider
									ref={ref as Ref<HTMLInputElement>}
									className={fieldClassName}
									required={required}
									fieldName={fieldName}
									fieldValue={fieldValue as number}
									setFieldValue={setFieldValue}
									setValue={setValue}
									showError={Boolean(showError)}
									placeholder={placeholder}
									isSubmitting={isSubmitting}
									min={typeof min === 'number' ? min : undefined}
									max={typeof max === 'number' ? max : undefined}
									maxValue={maxValue}
									step={typeof step === 'number' ? step : undefined}
									value={inputProps.value as number}
									onChange={
										inputProps.onChange as unknown as (value: number) => void
									}
									onBlur={inputProps.onBlur}
								/>
							);
						default:
							return <div>Invalid field type: {type}</div>;
					}
				})()}

				{children}
				{helpText && <p className="mb-2 p-2 text-xs text-gray-400">{helpText}</p>}
			</div>
		);
	}
);

Field.displayName = 'Field';

export default Field;
