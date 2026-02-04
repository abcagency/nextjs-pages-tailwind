'use client';

import * as React from 'react';
import type {
	ControllerFieldState,
	ControllerRenderProps,
	ControllerProps,
	FieldPath,
	FieldValues
} from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';
import { Field } from '@base-ui/react/field';

import { cn } from '~/lib/utils';
import Icon from '~/components/modules/icon';

type FormFieldContextValue<TFieldValues extends FieldValues = FieldValues> = {
	name: FieldPath<TFieldValues>;
	id: string;
	field: ControllerRenderProps<TFieldValues, FieldPath<TFieldValues>>;
	fieldState: ControllerFieldState;
};

const FormFieldContext = React.createContext<FormFieldContextValue<any> | null>(
	null
);

function useFormField() {
	const context = React.useContext(FormFieldContext);

	if (!context) {
		throw new Error('useFormField must be used within <FormField>.');
	}

	const { id, field, fieldState } = context;
	const descriptionId = `${id}-description`;
	const messageId = `${id}-message`;

	return {
		id,
		field,
		fieldState,
		descriptionId,
		messageId,
		error: fieldState.error,
		invalid: Boolean(fieldState.error)
	};
}

export type FormFieldProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = Omit<ControllerProps<TFieldValues, TName>, 'render' | 'control'> & {
	className?: string;
	children:
		| React.ReactNode
		| ((props: FormFieldContextValue<TFieldValues>) => React.ReactNode);
};

function FormField<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ className, children, ...props }: FormFieldProps<TFieldValues, TName>) {
	const { control } = useFormContext<TFieldValues>();
	const id = React.useId();

	const { field, fieldState } = useController({ ...props, control });

	const content =
		typeof children === 'function'
			? children({ name: props.name, id, field, fieldState })
			: children;

	return (
		<FormFieldContext.Provider
			value={{ name: props.name, id, field, fieldState }}
		>
			<Field.Root
				name={field.name}
				invalid={Boolean(fieldState.error)}
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
	const { id, invalid } = useFormField();

	return (
		<Field.Label
			htmlFor={id}
			className={cn(
				'text-2xs font-semibold uppercase tracking-wide',
				invalid ? 'text-destructive' : 'text-foreground',
				className
			)}
			{...props}
		>
			<span className="inline-flex items-start gap-1">
				<span>{children}</span>
				{required && (
					<Icon
						icon="mdi:asterisk"
						size="size-2"
						className="text-destructive self-start"
					/>
				)}
			</span>
		</Field.Label>
	);
}

function FormDescription({ className, ...props }: Field.Description.Props) {
	const { descriptionId } = useFormField();

	return (
		<Field.Description
			id={descriptionId}
			className={cn('text-xs text-muted-foreground', className)}
			{...props}
		/>
	);
}

function FormMessage({
	className,
	children,
	...props
}: React.ComponentProps<'div'>) {
	const { error, messageId } = useFormField();
	const message = error?.message?.toString();

	if (!message && !children) {
		return null;
	}

	return (
		<div
			id={messageId}
			aria-live="polite"
			className={cn('text-xs font-semibold text-destructive', className)}
			{...props}
		>
			{message ?? children}
		</div>
	);
}

export { FormDescription, FormField, FormLabel, FormMessage, useFormField };
