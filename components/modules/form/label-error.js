import Icon from '~/components/modules/icon';

const LabelAndError = ({
	className,
	fieldName,
	errorsFieldName,
	displayName,
	helpText,
	required = false,
	icon = 'mdi:asterisk',
	hideIcon = false,
	errors
}) => {
	const showError = errors && (errors[fieldName] || errors[errorsFieldName]);

	return (
		<div className={className ?? ''}>
			<div className="flex gap-1 mb-2">
				<label
					className={`
						form-label flex gap-0.5 transition-colors
						${showError ? 'label-hasErrors' : ''}
					`}
					htmlFor={fieldName}
				>
					{displayName}
					{!hideIcon && required && (
						<Icon
							icon={icon}
							size="size-1.5"
							className={`
								align-text-top
								${showError ? 'label-hasErrors' : ''}
							`}
						/>
					)}
				</label>

				{showError && (
					<span
						id={`${fieldName}-error`}
						name={fieldName}
						className="field-error inline-block"
					>
						{showError?.message}
					</span>
				)}
			</div>

			{helpText && <p className="field-help-text">{helpText}</p>}
		</div>
	);
};

export default LabelAndError;
