'use client';

import * as React from 'react';
import type {
	ControllerFieldState,
	ControllerRenderProps,
	ControllerProps,
	FieldPath,
	FieldValues
} from 'react-hook-form';
import { useController, useFormContext, useFormState } from 'react-hook-form';
import { Field } from '@base-ui/react/field';

import { cn } from '~/lib/utils';

type FormErrorMode = 'auto' | 'block' | 'inline';

type FormFieldContextValue<TFieldValues extends FieldValues = FieldValues> = {
	name: FieldPath<TFieldValues>;
	id: string;
	errorMode: FormErrorMode;
	inlineErrorMaxLength: number;
	field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
	fieldState: ControllerFieldState;
	hasDescription: boolean;
	hasLabel: boolean;
	hasMessage: boolean;
	setHasDescription: (value: boolean) => void;
	setHasLabel: (value: boolean) => void;
	setHasMessage: (value: boolean) => void;
};

const FormFieldContext = React.createContext<FormFieldContextValue<any> | null>(
	null
);

function useFormField() {
	const context = React.useContext(FormFieldContext);

	if (!context) {
		throw new Error('useFormField must be used within <FormField>.');
	}

	const {
		id,
		errorMode,
		inlineErrorMaxLength,
		field,
		fieldState,
		hasDescription,
		hasLabel,
		hasMessage,
		setHasDescription,
		setHasLabel,
		setHasMessage
	} = context;
	const { control } = useFormContext();
	const { submitCount, isSubmitted } = useFormState({ control });
	const descriptionId = `${id}-description`;
	const messageId = `${id}-message`;
	const message = fieldState.error?.message?.toString();
	const showError =
		Boolean(fieldState.error) &&
		(fieldState.isTouched || isSubmitted || submitCount > 0);
	const resolvedErrorMode =
		errorMode === 'auto'
			? message && message.length <= inlineErrorMaxLength
				? 'inline'
				: 'block'
			: errorMode;

	return {
		id,
		errorMode: resolvedErrorMode,
		inlineErrorMaxLength,
		field,
		fieldState,
		descriptionId,
		messageId,
		ariaDescribedBy:
			[
				hasDescription ? descriptionId : undefined,
				hasMessage ? messageId : undefined
			]
				.filter(Boolean)
				.join(' ') || undefined,
		error: fieldState.error,
		hasLabel,
		invalid: Boolean(fieldState.error),
		message,
		showError,
		setHasDescription,
		setHasLabel,
		setHasMessage
	};
}

export type FormFieldProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<ControllerProps<TFieldValues, TName>, 'render' | 'control'> & {
	className?: string;
	errorMode?: FormErrorMode;
	inlineErrorMaxLength?: number;
	children:
		| React.ReactNode
		| ((props: FormFieldContextValue<TFieldValues>) => React.ReactNode);
};

function FormField<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
	className,
	children,
	errorMode = 'inline',
	inlineErrorMaxLength = 15,
	...props
}: FormFieldProps<TFieldValues, TName>) {
	const { control } = useFormContext<TFieldValues>();
	const id = React.useId();
	const [hasDescription, setHasDescription] = React.useState(false);
	const [hasLabel, setHasLabel] = React.useState(false);
	const [hasMessage, setHasMessage] = React.useState(false);

	const { field, fieldState } = useController({ ...props, control });

	const contextValue = {
		name: props.name,
		id,
		errorMode,
		inlineErrorMaxLength,
		field,
		fieldState,
		hasDescription,
		hasLabel,
		hasMessage,
		setHasDescription,
		setHasLabel,
		setHasMessage
	} as FormFieldContextValue<TFieldValues>;

	const content =
		typeof children === 'function' ? children(contextValue) : children;

	return (
		<FormFieldContext.Provider value={contextValue}>
			<Field.Root
				name={field.name}
				invalid={Boolean(fieldState.error)}
				touched={fieldState.isTouched}
				dirty={fieldState.isDirty}
				className={cn('flex flex-col gap-2', className)}
			>
				{content}
			</Field.Root>
		</FormFieldContext.Provider>
	);
}

type FormLabelProps = Field.Label.Props & {
	required?: boolean;
};

function FormLabel({
	className,
	required,
	children,
	...props
}: FormLabelProps) {
	const { errorMode, id, message, setHasLabel, showError } = useFormField();

	React.useEffect(() => {
		setHasLabel(true);
		return () => setHasLabel(false);
	}, [setHasLabel]);

	return (
		<Field.Label
			htmlFor={id}
			className={cn(
				'text-xs font-semibold',
				showError ? 'text-destructive' : 'text-foreground',
				className
			)}
			{...props}
		>
			<span className="inline-flex items-start">
				<span>{children}</span>
				{required && (
					<span aria-hidden="true" className="text-destructive self-start">
						*
					</span>
				)}
				{showError && errorMode === 'inline' && message && (
					<span className="ml-1">{message}</span>
				)}
			</span>
		</Field.Label>
	);
}

function FormDescription({ className, ...props }: Field.Description.Props) {
	const { descriptionId, setHasDescription } = useFormField();

	React.useEffect(() => {
		setHasDescription(true);
		return () => setHasDescription(false);
	}, [setHasDescription]);

	return (
		<Field.Description
			id={descriptionId}
			className={cn('text-xs text-muted-foreground', className)}
			{...props}
		/>
	);
}

function FormMessage({ className, children, ...props }: Field.Error.Props) {
	const { errorMode, hasLabel, message, messageId, setHasMessage, showError } =
		useFormField();
	const content = showError && message ? message : children;
	const shouldRender = Boolean(content);
	const hideMessage = hasLabel && errorMode === 'inline';

	React.useEffect(() => {
		setHasMessage(shouldRender);
		return () => setHasMessage(false);
	}, [setHasMessage, shouldRender]);

	if (!shouldRender) {
		return null;
	}

	return (
		<Field.Error
			id={messageId}
			match={true}
			aria-live="polite"
			className={cn(
				hideMessage ? 'sr-only' : 'text-xs font-semibold text-destructive',
				className
			)}
			{...props}
		>
			{content}
		</Field.Error>
	);
}

export { FormDescription, FormField, FormLabel, FormMessage, useFormField };
