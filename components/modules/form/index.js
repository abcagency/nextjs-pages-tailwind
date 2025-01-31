import React, { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Slider } from 'radix-ui';

import Grid from '~/components/modules/grid';
import FormField from '~/components/modules/form/field';
import Button from '~/components/modules/button';

import { validationSchema } from '~/lib/validators/contact';

const ContactForm = ({ className }) => {
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors }
	} = useForm({
		mode: 'onBlur',
		defaultValues: {
			name: '',
			email: '',
			message: '',
			transportation: [],
			favoriteColor: 'pink',
			state: '',
			distance: [0]
		},
		resolver: yupResolver(validationSchema)
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const onSubmit = values => {
		setIsSubmitting(true);
		setTimeout(() => {
			alert(JSON.stringify(values, null, 2));
			reset();
			setIsSubmitting(false);
		}, 1000);
	};

	const transportationOptions = ['Car', 'Boat', 'Plane'];
	const favoriteColorOptions = ['blue', 'green', 'pink', 'red', 'yellow'];

	const handleSliderValueChange = useCallback((field, value) => {
		field.onChange(value);
	}, []);

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className={`form ${className ?? ''}`}
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
			</Grid>

			<Grid columns="sm:grid-cols-2" gap="gap-4">
				<Grid.Item>
					<h3
						id="transportation-group-title"
						className="inline-block text-xs uppercase font-bold mb-2"
					>
						Transportation
					</h3>

					{errors.transportation && (
						<span
							id="transportation-error"
							name="email"
							className="inline-block text-red-500 uppercase text-xs font-bold ml-1"
						>
							{errors.transportation?.message}
						</span>
					)}

					<div
						role="group"
						aria-labelledby="transportation-group-title"
						className="flex flex-col items-start"
					>
						{transportationOptions.map(value => (
							<label key={value} className="inline-flex items-center mb-3">
								<input
									{...register(`transportation`)}
									id={`transportation${value}`}
									value={value}
									type="checkbox"
									className="rounded-sm h-5 w-5 text-indigo-600 border-gray-400 transition-colors"
								/>
								<span className="ml-2">{value}</span>
							</label>
						))}
					</div>
				</Grid.Item>

				<Grid.Item>
					<h3
						id="favorite-color-group-title"
						className="inline-block text-xs uppercase font-bold mb-2"
					>
						Favorite color
					</h3>

					<div
						role="group"
						aria-labelledby="favorite-color-group-title"
						className="flex flex-col items-start"
					>
						{favoriteColorOptions.map(value => (
							<label key={value} className="inline-flex items-center mb-3">
								<input
									{...register(`favoriteColor`)}
									id={`favoriteColor${value}`}
									value={value}
									type="radio"
									name="favoriteColor"
									className="rounded-full h-5 w-5 text-indigo-600 border-gray-400  transition-colors"
								/>
								<span className="ml-2 capitalize">{value}</span>
							</label>
						))}
					</div>
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
					<label
						className="inline-block mb-2 text-xs font-bold uppercase"
						htmlFor="distance"
					>
						Distance
					</label>

					{errors.distance && (
						<span
							id="distance-error"
							name="distance"
							className="inline-block text-red-500 uppercase text-xs font-bold ml-1"
						>
							{errors.distance?.message}
						</span>
					)}

					<Controller
						name="distance"
						control={control}
						render={({ field }) => (
							<Slider.Root
								defaultValue={[0]}
								onValueChange={value => handleSliderValueChange(field, value)}
								aria-label="distance"
								className="relative flex h-5 mt-2 touch-none select-none items-center"
							>
								<Slider.Track className="relative h-3 grow rounded-full bg-gray-200">
									<Slider.Range className="absolute h-full rounded-full bg-indigo-600" />
								</Slider.Track>
								<Slider.Thumb
									className={`
										grid place-content-center size-9 p-1.5 rounded-full bg-indigo-600 text-white ring-4 ring-white text-center text-sm cursor-grab transition-colors focus:outline-none focus:bg-indigo-800 ${errors.distance && '!bg-red-500 !text-white'}
									`}
								>
									{field.value}
								</Slider.Thumb>
							</Slider.Root>
						)}
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

			<Button.Btn
				btnType="submit"
				variant="primary"
				disabled={isSubmitting}
				className="disabled:bg-gray-200 disabled:text-gray-400"
			>
				{isSubmitting ? 'Please wait...' : 'Submit'}
			</Button.Btn>
		</form>
	);
};

export default ContactForm;
