import { forwardRef } from 'react';

import LabelAndError from '~/components/modules/form/label-error';
import Input from '~/components/modules/form/input';
import Select from '~/components/modules/form/select';
import Textarea from '~/components/modules/form/textarea';

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
			...rest
		},
		ref
	) => {
		const showError = errors && (errors[fieldName] || errors[errorsFieldName]);

		return (
			<div
				ref={ref}
				className={`
				relative
				${className ?? ''}
			`}
			>
				<LabelAndError
					fieldName={fieldName}
					errorsFieldName={errorsFieldName}
					displayName={displayName}
					helpText={helpText}
					errors={errors}
					required={required}
					hint={hint}
				/>

				{(() => {
					switch (type) {
						case 'input':
							return (
								<Input
									type={fieldType}
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
						case 'select':
							return (
								<Select
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
						case 'textarea':
							return (
								<Textarea
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
						default:
							return null;
					}
				})()}

				{children}
			</div>
		);
	}
);

Field.displayName = 'Field';

export default Field;
