import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Slider from 'react-slider';
import * as Yup from 'yup';

let validationSchema = Yup.object().shape({
	name: Yup.string()
		.required("is required"),
	email: Yup.string()
		.email("Invalid email address format")
		.required("is required"),
	message: Yup.string()
		.required("is required"),
	transportation: Yup.array()
		.min(1, "Select a transportation type"),
	state: Yup.string()
		.required("is required"),
	distance: Yup.number()
		.min(1, "is required")
});

const ContactForm = () => {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		trigger,
		reset,
		formState:{ errors }
	} = useForm({
		mode: 'onBlur',
		defaultValues: {
			name: '',
			email: '',
			message: '',
			transportation: [],
			favoriteColor: 'pink',
			state: '',
			distance: 0
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

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className="sm:grid grid-cols-2 gap-4">
				<div className="mb-6">
					<label
						className="inline-block mb-2 text-xs font-bold uppercase"
						htmlFor="name"
					>
						Name
					</label>

					{errors.name &&
						<span
							id="name-error"
							name="name"
							className="inline-block text-red-500 uppercase text-xs font-bold ml-1"
						>
							{errors.name?.message}
						</span>
					}

					<input
						{...register("name")}
						type="text"
						name="name"
						placeholder="First and Last Name"
						className={`w-full rounded-md transition-colors ${
							errors.name ? "border-red-500" : "border-gray-800"
						}`}
						aria-invalid={errors.name ? 'true' : null}
						aria-describedby={errors.name ? 'name-error' : null}
						aria-required="true"
						disabled={isSubmitting}
					/>
				</div>

				<div className="mb-6">
					<label
						className="inline-block mb-2 text-xs font-bold uppercase"
						htmlFor="email"
					>
						Email
					</label>

					{errors.email &&
						<span
							id="email-error"
							name="email"
							className="inline-block text-red-500 uppercase text-xs font-bold ml-1"
						>
							{errors.email?.message}
						</span>
					}

					<input
						{...register("email")}
						type="email"
						name="email"
						placeholder="user@domain.com"
						className={`w-full rounded-md transition-colors ${
							errors.email ? "border-red-500" : "border-gray-800"
						}`}
						aria-invalid={errors.email ? 'true' : null}
						aria-describedby={errors.email? 'email-error' : null}
						aria-required="true"
						disabled={isSubmitting}
					/>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="mb-6">
					<h2 id="transportation-group-title" className="inline-block text-xs uppercase font-bold mb-2">Transportation</h2>

					{errors.transportation &&
						<span
							id="transportation-error"
							name="email"
							className="inline-block text-red-500 uppercase text-xs font-bold ml-1"
						>
							{errors.transportation?.message}
						</span>
					}

					<div role="group" aria-labelledby="transportation-group-title" className="flex flex-col items-start">
						{transportationOptions.map(value => (
							<label
								key={value}
								className="inline-flex items-center mb-3"
							>
								<input
									{...register(`transportation`)}
									id={`transportation${value}`}
									value={value}
									type="checkbox"
									className="rounded h-5 w-5 text-indigo-700 border-gray-800 transition-colors"
								/>
								<span className="ml-2">{value}</span>
							</label>
						))}
					</div>
				</div>

				<div className="mb-6">
					<h2 id="favorite-color-group-title" className="inline-block text-xs uppercase font-bold mb-2">Favorite color</h2>

					<div role="group" aria-labelledby="favorite-color-group-title" className="flex flex-col items-start">
						{favoriteColorOptions.map(value => (
							<label
								key={value}
								className="inline-flex items-center mb-3"
							>
								<input
									{...register(`favoriteColor`)}
									id={`favoriteColor${value}`}
									value={value}
									type="radio"
									name="favoriteColor"
									className="rounded-full h-5 w-5 text-indigo-700 border-gray-800  transition-colors"
								/>
								<span className="ml-2 capitalize">{value}</span>
							</label>
						))}
					</div>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="mb-6">
					<label
						className="inline-block mb-2 text-xs font-bold uppercase"
						htmlFor="state"
					>
						State
					</label>

					{errors.state &&
						<span
							id="state-error"
							name="state"
							className="inline-block text-red-500 uppercase text-xs font-bold ml-1"
						>
							{errors.state?.message}
						</span>
					}

					<select
						{...register(`state`)}
						className={`w-full rounded-md transition-colors ${
							errors.state ? "border-red-500" : "border-gray-800"
						}`}
						aria-invalid={errors.state ? 'true' : null}
						aria-describedby={errors.state ? 'state-error' : null}
						aria-required="true"
						disabled={isSubmitting}
					>
						<option value="">Select a state</option>
						<option value="AL">Alabama</option>
						<option value="AK">Alaska</option>
						<option value="AZ">Arizona</option>
						<option value="AR">Arkansas</option>
						<option value="CA">California</option>
						<option value="CO">Colorado</option>
						<option value="CT">Connecticut</option>
						<option value="DE">Delaware</option>
						<option value="DC">District Of Columbia</option>
						<option value="FL">Florida</option>
						<option value="GA">Georgia</option>
						<option value="HI">Hawaii</option>
						<option value="ID">Idaho</option>
						<option value="IL">Illinois</option>
						<option value="IN">Indiana</option>
						<option value="IA">Iowa</option>
						<option value="KS">Kansas</option>
						<option value="KY">Kentucky</option>
						<option value="LA">Louisiana</option>
						<option value="ME">Maine</option>
						<option value="MD">Maryland</option>
						<option value="MA">Massachusetts</option>
						<option value="MI">Michigan</option>
						<option value="MN">Minnesota</option>
						<option value="MS">Mississippi</option>
						<option value="MO">Missouri</option>
						<option value="MT">Montana</option>
						<option value="NE">Nebraska</option>
						<option value="NV">Nevada</option>
						<option value="NH">New Hampshire</option>
						<option value="NJ">New Jersey</option>
						<option value="NM">New Mexico</option>
						<option value="NY">New York</option>
						<option value="NC">North Carolina</option>
						<option value="ND">North Dakota</option>
						<option value="OH">Ohio</option>
						<option value="OK">Oklahoma</option>
						<option value="OR">Oregon</option>
						<option value="PA">Pennsylvania</option>
						<option value="RI">Rhode Island</option>
						<option value="SC">South Carolina</option>
						<option value="SD">South Dakota</option>
						<option value="TN">Tennessee</option>
						<option value="TX">Texas</option>
						<option value="UT">Utah</option>
						<option value="VT">Vermont</option>
						<option value="VA">Virginia</option>
						<option value="WA">Washington</option>
						<option value="WV">West Virginia</option>
						<option value="WI">Wisconsin</option>
						<option value="WY">Wyoming</option>
					</select>
				</div>
				<div className="mb-6 overflow-hidden">
					<label
						className="inline-block mb-2 text-xs font-bold uppercase"
						htmlFor="distance"
					>
						Distance
					</label>

					{errors.distance &&
						<span
							id="distance-error"
							name="distance"
							className="inline-block text-red-500 uppercase text-xs font-bold ml-1"
						>
							{errors.distance?.message}
						</span>
					}

					<Controller
						name="distance"
						control={control}
						render={({ field }) =>
							<>
								<input
									{...field}
									type="hidden"
									aria-invalid={errors.distance ? 'true' : null}
									aria-describedby={errors.distance ? 'distance-error' : null}
									aria-required="true"
								/>

								<Slider
									max={99}
									className="py-4"
									thumbClassName={`p-2 w-10 rounded-full bg-gray-100 text-gray-700 transform -translate-y-1/3 text-center outline-none cursor-grab focus:bg-indigo-700 focus:text-white transition-colors ${errors.distance && "!text-red-500"}`}
									trackClassName="bg-gray-300 h-3 rounded-md transition-colors"
									renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
									onChange={v => setValue('distance', v)}
									onAfterChange={() => trigger('distance')}
								/>
							</>
						}
					/>
				</div>
			</div>

			<div className="mb-6">
				<label
					className="inline-block mb-2 text-xs font-bold uppercase"
					htmlFor="message"
				>
					Message
				</label>

				{errors.message &&
					<span
						id="message-error"
						name="message"
						className="inline-block text-red-500 uppercase text-xs font-bold ml-1"
					>
						{errors.message?.message}
					</span>
				}

				<textarea
					{...register(`message`)}
					id="message"
					placeholder="Say something..."
					rows="8"
					className={`w-full rounded-md transition-colors ${
						errors.message ? "border-red-500" : "border-gray-800"
					}`}
					aria-invalid={errors.message ? 'true' : null}
					aria-describedby={errors.message ? 'state-error' : null}
					aria-required="true"
					disabled={isSubmitting}
				/>
			</div>

			<button
				type="submit"
				className="px-4 py-2 text-sm font-bold text-white bg-gray-700 border-b-4 border-gray-800 rounded hover:border-gray-700 hover:bg-gray-600 transfrom disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
				disabled={isSubmitting}
			>
				{isSubmitting ? "Please wait..." : "Submit"}
			</button>
		</form>
	);
};

export default ContactForm;
