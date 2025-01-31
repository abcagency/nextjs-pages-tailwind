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
						flex gap-0.5 text-xs font-bold uppercase transition-colors
						${showError ? 'text-red-500' : ''}
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
								${showError ? 'text-red-500' : ''}
							`}
						/>
					)}
				</label>

				{showError && (
					<span
						id={`${fieldName}-error`}
						name={fieldName}
						className="text-red-500 uppercase text-xs font-bold inline-block"
					>
						{showError?.message}
					</span>
				)}
			</div>

			{helpText && <p className="mb-2 text-gray-400">{helpText}</p>}
		</div>
	);
};

export default LabelAndError;
