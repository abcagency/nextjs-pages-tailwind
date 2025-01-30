import Icon from '~/components/modules/icon';

const LabelAndError = ({
	className,
	fieldName,
	errorsFieldName,
	displayName,
	helpText,
	required = false,
	hideAsterisk = false,
	errors
}) => {
	const showError = errors && (errors[fieldName] || errors[errorsFieldName]);

	return (
		<div className={className ?? ''}>
			<div className="flex gap-1 mb-2">
				<label
					className={`
						flex gap-0.5 text-xs font-bold uppercase transition-colors
						${showError ? 'text-red-500' : ''}
					`}
					htmlFor={fieldName}
				>
					{displayName}
					{!hideAsterisk && required && (
						<Icon
							icon="mdi:asterisk"
							size="size-1.5"
							className={`
								align-text-top
								${showError ? 'text-red-500' : ''}
							`}
						/>
					)}
				</label>

				{showError && (
					<span
						id={`${fieldName}-error`}
						name={fieldName}
						className="inline-block text-red-500 uppercase text-xs font-bold"
					>
						{showError?.message}
					</span>
				)}
			</div>

			{helpText && <p className="text-gray-400 mb-2">{helpText}</p>}
		</div>
	);
};

export default LabelAndError;
