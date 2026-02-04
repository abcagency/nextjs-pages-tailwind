'use client';

import { useEffect } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '~/components/modules/grid';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '~/components/modules/core/card';
import { Button } from '~/components/modules/core/button';
import {
	InputGroup,
	InputGroupText
} from '~/components/modules/core/input-group';
import { Spinner } from '~/components/modules/core/spinner';
import { toast } from '~/components/modules/core/sonner';
import type { CheckboxOption } from '~/components/modules/form/checkbox-group';
import type { ComboboxOption } from '~/components/modules/form/combobox';
import {
	Form,
	FormControl,
	useFormField
} from '~/components/modules/form/form';
import Input from '~/components/modules/form/input';
import type { RadioOption } from '~/components/modules/form/radio-group';
import type { SelectOption } from '~/components/modules/form/select';
import type { InsuranceClaimFormValues } from '~/lib/validators/insurance-claim-form';
import { validationSchema } from '~/lib/validators/insurance-claim-form';

const policyTypeOptions: SelectOption[] = [
	{ value: 'Auto', label: 'Auto' },
	{ value: 'Homeowners', label: 'Homeowners' },
	{ value: 'Renters', label: 'Renters' },
	{ value: 'Umbrella', label: 'Umbrella' }
];

const contactPreferenceOptions: RadioOption[] = [
	{ value: 'phone', label: 'Phone' },
	{ value: 'email', label: 'Email' },
	{ value: 'text', label: 'Text Message' }
];

const incidentTypeOptions: SelectOption[] = [
	{ value: 'Collision', label: 'Collision' },
	{ value: 'Theft', label: 'Theft' },
	{ value: 'Vandalism', label: 'Vandalism' },
	{ value: 'Weather', label: 'Weather' },
	{ value: 'Other', label: 'Other' }
];

const propertyTypeOptions: RadioOption[] = [
	{ value: 'Vehicle', label: 'Vehicle' },
	{ value: 'Property', label: 'Property' },
	{ value: 'Other', label: 'Other' }
];

const vehicleUseOptions: SelectOption[] = [
	{ value: 'Personal', label: 'Personal' },
	{ value: 'Business', label: 'Business' },
	{ value: 'Rideshare', label: 'Rideshare' }
];

const ownershipOptions: SelectOption[] = [
	{ value: 'Owned', label: 'Owned' },
	{ value: 'Leased', label: 'Leased' },
	{ value: 'Financed', label: 'Financed' }
];

const weatherOptions: ComboboxOption[] = [
	{ value: 'Clear', label: 'Clear', group: 'Conditions', icon: 'ph:sun' },
	{ value: 'Rain', label: 'Rain', group: 'Conditions', icon: 'ph:cloud-rain' },
	{ value: 'Snow', label: 'Snow', group: 'Conditions', icon: 'ph:snowflake' },
	{ value: 'Wind', label: 'High Winds', group: 'Conditions', icon: 'ph:wind' },
	{ value: 'Hail', label: 'Hail', group: 'Conditions', icon: 'ph:cloud-snow' }
];

const languageOptions: ComboboxOption[] = [
	{ value: 'English', label: 'English', group: 'Languages' },
	{ value: 'Spanish', label: 'Spanish', group: 'Languages' },
	{ value: 'French', label: 'French', group: 'Languages' },
	{ value: 'German', label: 'German', group: 'Languages' }
];

const rentalCompanyOptions: ComboboxOption[] = [
	{ value: 'Enterprise', label: 'Enterprise', group: 'Rental Companies' },
	{ value: 'Hertz', label: 'Hertz', group: 'Rental Companies' },
	{ value: 'Avis', label: 'Avis', group: 'Rental Companies' },
	{ value: 'Budget', label: 'Budget', group: 'Rental Companies' }
];

const damagedAreaOptions: CheckboxOption[] = [
	{ value: 'Front', label: 'Front' },
	{ value: 'Rear', label: 'Rear' },
	{ value: 'Left', label: 'Left Side' },
	{ value: 'Right', label: 'Right Side' },
	{ value: 'Roof', label: 'Roof' }
];

const stateOptions: SelectOption[] = [
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
];

const countryOptions: SelectOption[] = [
	{ value: 'US', label: 'United States' },
	{ value: 'CA', label: 'Canada' },
	{ value: 'MX', label: 'Mexico' }
];

const isDev = process.env.NODE_ENV === 'production';

const defaultValues: InsuranceClaimFormValues = {
	policyNumber: isDev ? '284732' : '',
	claimNumber: isDev ? 'CLM-10488' : '',
	policyType: isDev ? 'Auto' : '',
	insuredFirstName: isDev ? 'Jordan' : '',
	insuredLastName: isDev ? 'Taylor' : '',
	insuredDob: isDev ? '1988-05-14' : '',
	insuredPhone: isDev ? '4155550198' : '',
	insuredEmail: isDev ? 'jordan.taylor@example.com' : '',
	contactPreference: isDev ? 'phone' : '',
	mailingAddress1: isDev ? '410 Market Street' : '',
	mailingAddress2: isDev ? 'Suite 220' : '',
	mailingCity: isDev ? 'San Francisco' : '',
	mailingState: isDev ? 'CA' : '',
	mailingPostal: isDev ? '94111' : '',
	mailingCountry: isDev ? 'US' : '',
	isPrimaryInsured: isDev ? true : false,
	languagePreference: isDev ? 'English' : '',
	lossDate: isDev ? '2025-12-08' : '',
	lossWindow: isDev ? { start: '2025-12-07', end: '2025-12-08' } : {},
	incidentType: isDev ? 'Collision' : '',
	incidentDescription: isDev
		? 'Rear-ended at a stoplight. No airbags deployed.'
		: '',
	incidentLocationAddress: isDev ? '1200 Mission Street' : '',
	incidentLocationCity: isDev ? 'San Francisco' : '',
	incidentLocationState: isDev ? 'CA' : '',
	incidentLocationPostal: isDev ? '94103' : '',
	weatherConditions: isDev ? 'Rain' : '',
	damagedAreas: isDev ? ['Rear'] : [],
	wasPoliceNotified: isDev ? true : false,
	policeReportNumber: isDev ? 'SF-221904' : '',
	authorityName: isDev ? 'SFPD Central' : '',
	authorityPhone: isDev ? '4155550150' : '',
	reportDate: isDev ? '2025-12-09' : '',
	reportTime: isDev ? '09:15' : '',
	propertyType: isDev ? 'Vehicle' : '',
	vehicleYear: isDev ? '2021' : '',
	vehicleMake: isDev ? 'Toyota' : '',
	vehicleModel: isDev ? 'RAV4' : '',
	vehicleVin: isDev ? 'JTNBF3HK4L3100001' : '',
	vehicleMileage: isDev ? 24850 : 0,
	vehicleUse: isDev ? 'Personal' : '',
	propertyOwnership: isDev ? 'Owned' : '',
	damageEstimate: isDev ? 4200 : null,
	deductibleAmount: isDev ? 500 : null,
	claimAmountRequested: isDev ? 3700 : 0,
	towRequired: isDev ? false : false,
	drivable: isDev ? true : false,
	rentalNeeded: isDev ? true : false,
	rentalStartDate: isDev ? '2025-12-10' : '',
	rentalEndDate: isDev ? '2025-12-15' : '',
	rentalCompany: isDev ? 'Enterprise' : '',
	photosProvided: isDev ? true : false,
	witnessCount: isDev ? 1 : 0,
	witness1Name: isDev ? 'Morgan Lee' : '',
	witness1Phone: isDev ? '4155550140' : '',
	injuriesReported: isDev ? false : false,
	injuryDescription: isDev ? '' : '',
	medicalProviderName: isDev ? '' : '',
	medicalProviderPhone: isDev ? '' : '',
	fraudAcknowledgement: isDev ? true : false,
	additionalNotes: isDev
		? 'Please coordinate repairs with the preferred shop.'
		: ''
};

const PolicyNumberControl = () => {
	const { invalid } = useFormField();

	return (
		<InputGroup className={invalid ? 'ring-destructive/20 ring-2' : undefined}>
			<InputGroupText>INS</InputGroupText>
			<FormControl>
				<Input
					placeholder="284732"
					autoComplete="off"
					spellCheck={false}
					inputMode="numeric"
					pattern="[0-9]*"
				/>
			</FormControl>
		</InputGroup>
	);
};

const InsuranceClaimForm = () => {
	const form = useForm<InsuranceClaimFormValues>({
		mode: 'onBlur',
		defaultValues,
		resolver: zodResolver(
			validationSchema
		) as Resolver<InsuranceClaimFormValues>
	});

	const { isDirty, isSubmitting } = form.formState;

	useEffect(() => {
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (!isDirty) {
				return;
			}
			event.preventDefault();
			event.returnValue = '';
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	}, [isDirty]);

	const onSubmit = async (values: InsuranceClaimFormValues) => {
		await new Promise(resolve => setTimeout(resolve, 900));
		toast('Claim draft saved.');
		console.info('Claim submission payload', values);
	};

	return (
		<Form.Root form={form} onSubmit={onSubmit} className="space-y-10">
			<Card>
				<CardHeader>
					<CardTitle>Insurance Claim Intake</CardTitle>
					<CardDescription>
						Provide accurate claim details to speed up intake.
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-10">
					<section className="space-y-6">
						<div>
							<h2 className="text-base font-semibold">Policyholder</h2>
							<p className="text-sm text-muted-foreground">
								Verify policy details & primary contact information.
							</p>
						</div>
						<Grid columns="lg:grid-cols-4" gap="gap-4">
							<Form.Field name="policyNumber">
								<Form.Label required={true}>Policy Number</Form.Label>
								<PolicyNumberControl />
								<Form.Message />
							</Form.Field>
							<Form.Input
								name="claimNumber"
								label="Claim Reference"
								placeholder="CLM-10488"
								autoComplete="off"
								spellCheck={false}
							/>
							<Form.Select
								name="policyType"
								label="Policy Type"
								placeholder="Select policy"
								options={policyTypeOptions}
								required={true}
							/>
						</Grid>
						<Grid columns="lg:grid-cols-3" gap="gap-4">
							<Form.Input
								name="insuredFirstName"
								label="First Name"
								placeholder="Jordan"
								autoComplete="given-name"
								required={true}
							/>
							<Form.Input
								name="insuredLastName"
								label="Last Name"
								placeholder="Taylor"
								autoComplete="family-name"
								required={true}
							/>
							<Form.Date
								name="insuredDob"
								label="Date of Birth"
								placeholder="Select date"
								variant="dob"
								autoComplete="bday"
								required={true}
							/>
						</Grid>
						<Grid columns="lg:grid-cols-3" gap="gap-4">
							<Form.Phone
								name="insuredPhone"
								label="Phone Number"
								placeholder="(415) 555-0198"
								required={true}
							/>
							<Form.Input
								name="insuredEmail"
								label="Email Address"
								placeholder="name@provider.com"
								type="email"
								autoComplete="email"
								spellCheck={false}
								required={true}
							/>
							<Form.RadioGroup
								name="contactPreference"
								label="Preferred Contact"
								options={contactPreferenceOptions}
								layout="horizontal"
								required={true}
							/>
						</Grid>
						<Grid columns="lg:grid-cols-2" gap="gap-4">
							<Form.Input
								name="mailingAddress1"
								label="Address Line 1"
								placeholder="410 Market Street"
								autoComplete="address-line1"
								required={true}
							/>
							<Form.Input
								name="mailingAddress2"
								label="Address Line 2"
								placeholder="Suite 220"
								autoComplete="address-line2"
							/>
						</Grid>
						<Grid columns="lg:grid-cols-4" gap="gap-4">
							<Form.Input
								name="mailingCity"
								label="City"
								placeholder="San Francisco"
								autoComplete="address-level2"
								required={true}
							/>
							<Form.Select
								name="mailingState"
								label="State"
								placeholder="Select state"
								options={stateOptions}
								required={true}
							/>
							<Form.Input
								name="mailingPostal"
								label="Postal Code"
								placeholder="94111"
								autoComplete="postal-code"
								required={true}
								inputMode="numeric"
								pattern="[0-9]*"
							/>
							<Form.Select
								name="mailingCountry"
								label="Country"
								placeholder="Select country"
								options={countryOptions}
								required={true}
							/>
						</Grid>
						<Grid columns="lg:grid-cols-2" gap="gap-4">
							<Form.Combobox
								name="languagePreference"
								label="Language Preference"
								placeholder="Select language"
								options={languageOptions}
								autoComplete="off"
							/>
							<Form.Checkbox
								name="isPrimaryInsured"
								label="I am the primary insured on this policy"
								description="Confirm that you can authorize claim decisions."
							/>
						</Grid>
					</section>

					<section className="space-y-6">
						<div>
							<h2 className="text-base font-semibold">Incident Details</h2>
							<p className="text-sm text-muted-foreground">
								Describe when, where, and how the loss occurred.
							</p>
						</div>
						<Grid columns="lg:grid-cols-3" gap="gap-4">
							<Form.Date
								name="lossDate"
								label="Loss Date"
								placeholder="Select date"
								autoComplete="off"
								required={true}
							/>
							<Form.DateRange
								name="lossWindow"
								label="Loss Window"
								placeholder="Select range"
								autoComplete="off"
							/>
							<Form.Select
								name="incidentType"
								label="Incident Type"
								placeholder="Select type"
								options={incidentTypeOptions}
								required={true}
							/>
						</Grid>
						<Form.Textarea
							name="incidentDescription"
							label="Incident Summary"
							placeholder="Describe what happened"
							autoComplete="off"
							required={true}
						/>
						<Grid columns="lg:grid-cols-2" gap="gap-4">
							<Form.Input
								name="incidentLocationAddress"
								label="Location Address"
								placeholder="1200 Mission Street"
								autoComplete="street-address"
								required={true}
							/>
							<Form.Input
								name="incidentLocationCity"
								label="Location City"
								placeholder="San Francisco"
								autoComplete="address-level2"
								required={true}
							/>
						</Grid>
						<Grid columns="lg:grid-cols-3" gap="gap-4">
							<Form.Select
								name="incidentLocationState"
								label="Location State"
								placeholder="Select state"
								options={stateOptions}
								required={true}
							/>
							<Form.Input
								name="incidentLocationPostal"
								label="Location Postal Code"
								placeholder="94103"
								autoComplete="postal-code"
								required={true}
								inputMode="numeric"
								pattern="[0-9]*"
							/>
							<Form.Combobox
								name="weatherConditions"
								label="Weather Conditions"
								placeholder="Select weather"
								options={weatherOptions}
								autoComplete="off"
							/>
						</Grid>
						<Form.CheckboxGroup
							name="damagedAreas"
							label="Damaged Areas"
							options={damagedAreaOptions}
							layout="horizontal"
						/>
						<Grid columns="lg:grid-cols-3" gap="gap-4">
							<Form.Checkbox
								name="wasPoliceNotified"
								label="Police Notified"
								display="switch"
							/>
							<Form.Input
								name="policeReportNumber"
								label="Police Report Number"
								placeholder="SF-221904"
								autoComplete="off"
								spellCheck={false}
							/>
							<Form.Date
								name="reportDate"
								label="Reported Date"
								placeholder="Select date"
								autoComplete="off"
								required={true}
							/>
							<Form.Time
								name="reportTime"
								label="Reported Time"
								placeholder="09:15"
								autoComplete="off"
								required={true}
							/>
						</Grid>
						<Grid columns="lg:grid-cols-2" gap="gap-4">
							<Form.Input
								name="authorityName"
								label="Responding Authority"
								placeholder="SFPD Central"
								autoComplete="off"
							/>
							<Form.Phone
								name="authorityPhone"
								label="Authority Phone"
								placeholder="(415) 555-0150"
								autoComplete="off"
							/>
						</Grid>
					</section>

					<section className="space-y-6">
						<div>
							<h2 className="text-base font-semibold">Vehicle & Property</h2>
							<p className="text-sm text-muted-foreground">
								Share the affected asset and repair details.
							</p>
						</div>
						<Form.RadioGroup
							name="propertyType"
							label="Property Type"
							options={propertyTypeOptions}
							layout="horizontal"
							required={true}
						/>
						<Grid columns="lg:grid-cols-4" gap="gap-4">
							<Form.Input
								name="vehicleYear"
								label="Vehicle Year"
								placeholder="2021"
								inputMode="numeric"
								autoComplete="off"
								pattern="[0-9]*"
								required={true}
							/>
							<Form.Input
								name="vehicleMake"
								label="Vehicle Make"
								placeholder="Toyota"
								autoComplete="off"
								required={true}
							/>
							<Form.Input
								name="vehicleModel"
								label="Vehicle Model"
								placeholder="RAV4"
								autoComplete="off"
								required={true}
							/>
							<Form.Input
								name="vehicleVin"
								label="Vehicle VIN"
								placeholder="17-character VIN"
								autoComplete="off"
								spellCheck={false}
								required={true}
							/>
						</Grid>
						<Grid columns="lg:grid-cols-3" gap="gap-4">
							<Form.Range
								name="vehicleMileage"
								label="Current Mileage"
								min={0}
								max={200000}
								maxValue={200000}
								step={250}
							/>
							<Form.Select
								name="vehicleUse"
								label="Vehicle Use"
								placeholder="Select use"
								options={vehicleUseOptions}
								required={true}
							/>
							<Form.Select
								name="propertyOwnership"
								label="Ownership Status"
								placeholder="Select ownership"
								options={ownershipOptions}
								required={true}
							/>
						</Grid>
						<Grid columns="lg:grid-cols-3" gap="gap-4">
							<Form.Currency
								name="damageEstimate"
								label="Damage Estimate"
								placeholder="$4,200"
							/>
							<Form.Currency
								name="deductibleAmount"
								label="Deductible"
								placeholder="$500"
							/>
							<Form.Currency
								name="claimAmountRequested"
								label="Amount Requested"
								placeholder="$3,700"
								required={true}
							/>
						</Grid>
						<Grid columns="lg:grid-cols-3" gap="gap-4">
							<Form.Checkbox name="towRequired" label="Tow Required" />
							<Form.Checkbox
								name="drivable"
								label="Vehicle Drivable"
								display="toggle"
							/>
							<Form.Checkbox
								name="rentalNeeded"
								label="Rental Needed"
								display="switch"
							/>
						</Grid>
						<Grid columns="lg:grid-cols-3" gap="gap-4">
							<Form.Date
								name="rentalStartDate"
								label="Rental Start Date"
								placeholder="Select date"
								autoComplete="off"
							/>
							<Form.Date
								name="rentalEndDate"
								label="Rental End Date"
								placeholder="Select date"
								autoComplete="off"
							/>
							<Form.Combobox
								name="rentalCompany"
								label="Rental Company"
								placeholder="Select company"
								options={rentalCompanyOptions}
								autoComplete="off"
							/>
						</Grid>
						<Grid columns="lg:grid-cols-2" gap="gap-4">
							<Form.Checkbox
								name="photosProvided"
								label="Photos Provided"
								description="Upload receipts & images after submission."
							/>
							<Form.Range
								name="witnessCount"
								label="Number of Witnesses"
								min={0}
								max={5}
								step={1}
							/>
						</Grid>
						<Grid columns="lg:grid-cols-2" gap="gap-4">
							<Form.Input
								name="witness1Name"
								label="Witness Name"
								placeholder="Morgan Lee"
								autoComplete="off"
							/>
							<Form.Phone
								name="witness1Phone"
								label="Witness Phone"
								placeholder="(415) 555-0140"
								autoComplete="off"
							/>
						</Grid>
					</section>

					<section className="space-y-6">
						<div>
							<h2 className="text-base font-semibold">Medical & Compliance</h2>
							<p className="text-sm text-muted-foreground">
								Add medical contacts and confirm disclosures.
							</p>
						</div>
						<Grid columns="lg:grid-cols-2" gap="gap-4">
							<Form.Checkbox
								name="injuriesReported"
								label="Injuries Reported"
							/>
							<Form.Input
								name="medicalProviderName"
								label="Medical Provider"
								placeholder="City Care Clinic"
								autoComplete="off"
							/>
						</Grid>
						<Grid columns="lg:grid-cols-2" gap="gap-4">
							<Form.Phone
								name="medicalProviderPhone"
								label="Provider Phone"
								placeholder="(415) 555-0172"
								autoComplete="off"
							/>
							<Form.Textarea
								name="injuryDescription"
								label="Injury Description"
								placeholder="Describe any injuries"
								autoComplete="off"
							/>
						</Grid>
						<Form.Checkbox
							name="fraudAcknowledgement"
							label="I understand that insurance fraud is a crime."
							description="Required to submit this claim."
							required={true}
						/>
						<Form.Textarea
							name="additionalNotes"
							label="Additional Notes"
							placeholder="Add any extra details"
							autoComplete="off"
						/>
					</section>
				</CardContent>
			</Card>

			<div className="flex flex-wrap items-center justify-end gap-3">
				<Button
					type="submit"
					variant="default"
					size="lg"
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<>
							<Spinner size="sm" />
							Saving
						</>
					) : (
						'Save Claim'
					)}
				</Button>
			</div>
		</Form.Root>
	);
};

export default InsuranceClaimForm;
