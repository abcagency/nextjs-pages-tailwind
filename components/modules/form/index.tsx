import { useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Grid from '~/components/modules/grid';
import FormField from '~/components/modules/form/field';
import { Button } from '~/components/modules/core/button';

import type { ContactFormValues } from '~/lib/validators/contact';
import { validationSchema } from '~/lib/validators/contact';

type ContactFormProps = {
	className?: string;
};

type Option = {
	value: string;
	label: string;
};

const ContactForm = ({ className }: ContactFormProps) => {
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors }
	} = useForm<ContactFormValues>({
		mode: 'onBlur',
		defaultValues: {
			name: '',
			email: '',
			phone: '',
			message: '',
			transportation: [],
			favoriteColor: 'pink',
			state: '',
			distance: 0,
			date: '',
			time: ''
		},
		resolver: yupResolver<ContactFormValues, undefined, ContactFormValues>(
			validationSchema
		)
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const onSubmit: SubmitHandler<ContactFormValues> = values => {
		setIsSubmitting(true);
		setTimeout(() => {
			alert(JSON.stringify(values, null, 2));
			reset();
			setIsSubmitting(false);
		}, 1000);
	};

	const transportationOptions: Option[] = [
		{ value: 'car', label: 'Car' },
		{ value: 'boat', label: 'Boat' },
		{ value: 'plane', label: 'Plane' }
	];
	const favoriteColorOptions: Option[] = [
		{ value: 'blue', label: 'Blue' },
		{ value: 'green', label: 'Green' },
		{ value: 'pink', label: 'Pink' },
		{ value: 'red', label: 'Red' },
		{ value: 'yellow', label: 'Yellow' }
	];

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className={`space-y-6 ${className ?? ''}`}
		>
			<Grid columns="sm:grid-cols-2" gap="gap-4">
				<FormField
					{...register('name')}
					required={true}
					fieldName="name"
					displayName="Name"
					placeholder="First and last name"
					errors={errors}
					isSubmitting={isSubmitting}
				/>
				<FormField
					{...register('email')}
					required={true}
					fieldType="email"
					fieldName="email"
					displayName="Email"
					placeholder="user@domain.com"
					errors={errors}
					isSubmitting={isSubmitting}
				/>
				<FormField
					{...register('phone')}
					required={true}
					type="phone"
					fieldName="phone"
					displayName="phone"
					placeholder="(302) 555-1234"
					errors={errors}
					isSubmitting={isSubmitting}
				/>
			</Grid>

			<Grid columns="sm:grid-cols-2" gap="gap-4">
				<Grid.Item>
					<Controller
						name="transportation"
						control={control}
						render={({ field: { value, onChange } }) => (
							<FormField
								type="checkbox-group"
								fieldName="transportation"
								displayName="Transportation"
								options={transportationOptions}
								value={value}
								onChange={onChange}
								errors={errors}
								isSubmitting={isSubmitting}
							/>
						)}
					/>
				</Grid.Item>

				<Grid.Item>
					<Controller
						name="favoriteColor"
						control={control}
						render={({ field: { value, onChange } }) => (
							<FormField
								type="radio-group"
								fieldName="favoriteColor"
								displayName="Favorite Color"
								options={favoriteColorOptions}
								value={value}
								onChange={onChange}
								errors={errors}
								isSubmitting={isSubmitting}
							/>
						)}
					/>
				</Grid.Item>
			</Grid>

			<Grid columns="sm:grid-cols-2" gap="gap-4">
				<FormField
					{...register('state')}
					required={true}
					type="select"
					fieldName="state"
					displayName="State"
					placeholder="Choose a state"
					options={[
						{ value: 'AL', label: 'Alabama' },
						{ value: 'AK', label: 'Alaska' },
						{ value: 'AZ', label: 'Arizona' },
						{ value: 'AR', label: 'Arkansas' },
						{ value: 'CA', label: 'California' },
						{ value: 'CO', label: 'Colorado' },
						{ value: 'CT', label: 'Connecticut' },
						{ value: 'DE', label: 'Delaware' },
						{ value: 'FL', label: 'Florida' },
						{ value: 'GA', label: 'Georgia' },
						{ value: 'HI', label: 'Hawaii' },
						{ value: 'ID', label: 'Idaho' },
						{ value: 'IL', label: 'Illinois' },
						{ value: 'IN', label: 'Indiana' },
						{ value: 'IA', label: 'Iowa' },
						{ value: 'KS', label: 'Kansas' },
						{ value: 'KY', label: 'Kentucky' },
						{ value: 'LA', label: 'Louisiana' },
						{ value: 'ME', label: 'Maine' },
						{ value: 'MD', label: 'Maryland' },
						{ value: 'MA', label: 'Massachusetts' },
						{ value: 'MI', label: 'Michigan' },
						{ value: 'MN', label: 'Minnesota' },
						{ value: 'MS', label: 'Mississippi' },
						{ value: 'MO', label: 'Missouri' },
						{ value: 'MT', label: 'Montana' },
						{ value: 'NE', label: 'Nebraska' },
						{ value: 'NV', label: 'Nevada' },
						{ value: 'NH', label: 'New Hampshire' },
						{ value: 'NJ', label: 'New Jersey' },
						{ value: 'NM', label: 'New Mexico' },
						{ value: 'NY', label: 'New York' },
						{ value: 'NC', label: 'North Carolina' },
						{ value: 'ND', label: 'North Dakota' },
						{ value: 'OH', label: 'Ohio' },
						{ value: 'OK', label: 'Oklahoma' },
						{ value: 'OR', label: 'Oregon' },
						{ value: 'PA', label: 'Pennsylvania' },
						{ value: 'RI', label: 'Rhode Island' },
						{ value: 'SC', label: 'South Carolina' },
						{ value: 'SD', label: 'South Dakota' },
						{ value: 'TN', label: 'Tennessee' },
						{ value: 'TX', label: 'Texas' },
						{ value: 'UT', label: 'Utah' },
						{ value: 'VT', label: 'Vermont' },
						{ value: 'VA', label: 'Virginia' },
						{ value: 'WA', label: 'Washington' },
						{ value: 'WV', label: 'West Virginia' },
						{ value: 'WI', label: 'Wisconsin' },
						{ value: 'WY', label: 'Wyoming' }
					]}
					errors={errors}
					isSubmitting={isSubmitting}
				/>

				<Grid.Item>
					<Controller
						name="distance"
						control={control}
						render={({ field: { value, onChange } }) => (
							<FormField
								type="range"
								fieldName="distance"
								displayName="Distance"
								value={value}
								onChange={onChange}
								errors={errors}
								isSubmitting={isSubmitting}
							/>
						)}
					/>
				</Grid.Item>

				<Grid.Item>
					<Controller
						name="date"
						control={control}
						render={({ field: { value, onChange } }) => (
							<FormField
								required={true}
								type="date"
								fieldName="date"
								displayName="Date"
								value={value}
								onChange={onChange}
								errors={errors}
								isSubmitting={isSubmitting}
							/>
						)}
					/>
				</Grid.Item>
				<Grid.Item>
					<FormField
						{...register('time')}
						required={true}
						type="time"
						fieldName="time"
						displayName="Time"
						placeholder="12:00 PM"
						errors={errors}
						isSubmitting={isSubmitting}
					/>
				</Grid.Item>
			</Grid>

			<FormField
				{...register('message')}
				required={true}
				type="textarea"
				rows={3}
				fieldName="message"
				displayName="Message"
				placeholder="Say something..."
				errors={errors}
				isSubmitting={isSubmitting}
			/>

			<Button
				type="submit"
				disabled={isSubmitting}
				className="disabled:bg-gray-200 disabled:text-gray-400"
			>
				{isSubmitting ? 'Please wait…' : 'Submit'}
			</Button>
		</form>
	);
};

export default ContactForm;
