import { forwardRef } from 'react';

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

const Field = forwardRef(
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
			hint,
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
		const showError = errors && (errors[fieldName] || errors[errorsFieldName]);

		return (
			<div
				className={`
				relative
				${className ?? ''}
			`}
			>
				{/* Only show LabelAndError for non-checkbox types */}
				{type !== 'checkbox' && (
					<LabelAndError
						fieldName={fieldName}
						errorsFieldName={errorsFieldName}
						displayName={displayName}
						helpText={helpText}
						errors={errors}
						required={required}
						hint={hint}
					/>
				)}

				{(() => {
					switch (type) {
						case 'input':
							return (
								<Input
									ref={ref}
									type={fieldType}
									className={fieldClassName}
									required={required}
									fieldName={fieldName}
									showError={showError}
									placeholder={placeholder}
									isSubmitting={isSubmitting}
									disabled={disabled}
									mask={mask}
									unmask={unmask}
									{...rest}
								/>
							);
						case 'select':
							return (
								<Select
									ref={ref}
									className={fieldClassName}
									required={required}
									fieldName={fieldName}
									showError={showError}
									placeholder={placeholder}
									isSubmitting={isSubmitting}
									disabled={disabled}
									options={options}
									{...rest}
								/>
							);
						case 'phone':
							return (
								<PhoneInput
									ref={ref}
									type={fieldType}
									className={fieldClassName}
									required={required}
									fieldName={fieldName}
									fieldValue={fieldValue}
									setFieldValue={setFieldValue}
									setValue={setValue}
									showError={showError}
									placeholder={placeholder}
									isSubmitting={isSubmitting}
									{...rest}
								/>
							);
						case 'textarea':
							return (
								<Textarea
									ref={ref}
									className={fieldClassName}
									required={required}
									fieldName={fieldName}
									showError={showError}
									placeholder={placeholder}
									rows={rows}
									isSubmitting={isSubmitting}
									{...rest}
								/>
							);
						case 'time':
							return (
								<TimeInput
									ref={ref}
									className={fieldClassName}
									required={required}
									fieldName={fieldName}
									showError={showError}
									placeholder={placeholder}
									isSubmitting={isSubmitting}
									disabled={disabled}
									{...rest}
								/>
							);
						case 'checkbox':
							return (
								<div className="flex flex-col justify-center h-full text-pretty">
									<Checkbox
										ref={ref}
										className={fieldClassName}
										required={required}
										fieldName={fieldName}
										showError={showError}
										displayName={displayName}
										isSubmitting={isSubmitting}
										disabled={disabled}
										{...rest}
									/>
									{/* Show error below checkbox */}
									{showError && (
										<p className="mt-2 text-sm text-red-600">
											{errors[fieldName]?.message ||
												errors[errorsFieldName]?.message}
										</p>
									)}
								</div>
							);
						case 'checkbox-group':
							return (
								<CheckboxGroup
									ref={ref}
									name={fieldName}
									options={options}
									value={rest.value}
									onChange={rest.onChange}
									className={fieldClassName}
									labelClassName=""
									disabled={disabled}
									required={required}
									isSubmitting={isSubmitting}
									showError={showError}
									layout={layout}
									{...rest}
								/>
							);
						case 'radio-group':
							return (
								<RadioGroup
									ref={ref}
									name={fieldName}
									options={options}
									value={rest.value}
									onChange={rest.onChange}
									className={fieldClassName}
									labelClassName=""
									disabled={disabled}
									required={required}
									isSubmitting={isSubmitting}
									showError={showError}
									layout={layout}
									{...rest}
								/>
							);
						case 'range':
							return (
								<RangeSlider
									ref={ref}
									className={fieldClassName}
									required={required}
									fieldName={fieldName}
									fieldValue={fieldValue}
									setFieldValue={setFieldValue}
									setValue={setValue}
									showError={showError}
									placeholder={placeholder}
									isSubmitting={isSubmitting}
									min={min}
									max={max}
									maxValue={maxValue}
									step={step}
									{...rest}
								/>
							);
						default:
							return <div>Invalid field type: {type}</div>;
					}
				})()}

				{children}
				{helpText && (
					<p className="mb-2 p-2 text-xs text-gray-400">{helpText}</p>
				)}
			</div>
		);
	}
);

Field.displayName = 'Field';

export default Field;
