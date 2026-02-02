import Icon from '~/components/modules/icon';

type ErrorEntry = {
	message?: string;
};

type ErrorsMap = Record<string, ErrorEntry | undefined> | undefined;

type LabelAndErrorProps = {
	className?: string;
	fieldName: string;
	errorsFieldName?: string;
	displayName: string;
	helpText?: string;
	required?: boolean;
	icon?: string;
	hideIcon?: boolean;
	errors?: ErrorsMap;
};

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
}: LabelAndErrorProps) => {
	const showError =
		errors &&
		(errors[fieldName] || (errorsFieldName ? errors[errorsFieldName] : undefined));
	const errorMessage = showError?.message;

	return (
		<div className={className ?? ''}>
			<div className="flex gap-1 mb-2">
				<label
					className={`
						flex gap-0.5 text-2xs font-bold uppercase transition-colors
						${showError ? 'text-red-750' : 'text-blue-850'}
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
								${showError ? 'text-red-750' : ''}
							`}
						/>
					)}
				</label>

				{showError && (
					<span
						id={`${fieldName}-error`}
						className="text-red-700 text-2xs font-bold inline-block"
					>
						{errorMessage}
					</span>
				)}
			</div>

			{helpText && <p className="mb-2 text-gray-400">{helpText}</p>}
		</div>
	);
};

export default LabelAndError;
