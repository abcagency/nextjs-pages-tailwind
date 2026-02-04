import { z } from 'zod';

const dateRegExp = /^\d{4}-\d{2}-\d{2}$/;
const phoneRegExp = /^\d{10}$/;

const emptyToUndefined = (value: unknown) => {
	if (value === null || value === undefined) {
		return undefined;
	}
	if (typeof value === 'string' && value.trim() === '') {
		return undefined;
	}
	return value;
};
const asOptionalNumber = (value: unknown) => {
	if (value === '' || value === null || value === undefined) {
		return null;
	}
	const numericValue = typeof value === 'number' ? value : Number(value);
	return Number.isNaN(numericValue) ? null : numericValue;
};

const requiredString = (message = 'is required') => z.string().min(1, message);
const requiredDate = requiredString().refine(value => dateRegExp.test(value), {
	message: 'requires YYYY-MM-DD format'
});
const requiredPhone = requiredString().refine(
	value => phoneRegExp.test(value),
	{ message: 'requires 10 digits' }
);
const optionalDate = z
	.preprocess(value => {
		if (typeof value !== 'string') {
			return null;
		}
		const trimmed = value.trim();
		return trimmed === '' ? null : trimmed;
	}, z.union([z.null(), z.string().regex(dateRegExp, 'requires YYYY-MM-DD format')]));
const optionalPhone = z
	.preprocess(value => {
		if (typeof value !== 'string') {
			return null;
		}
		const digits = value.replace(/\D/g, '');
		return digits === '' ? null : digits;
	}, z.union([z.null(), z.string().regex(phoneRegExp, 'requires 10 digits')]));
const optionalNumber = z.preprocess(asOptionalNumber, z.number().nullable());

export const validationSchema = z
	.object({
		policyNumber: requiredString().regex(/^\d+$/, 'use digits only'),
		claimNumber: z.string().optional(),
		policyType: requiredString(),
		insuredFirstName: requiredString(),
		insuredLastName: requiredString(),
		insuredDob: requiredDate,
		insuredPhone: requiredPhone,
		insuredEmail: z
			.email({ message: 'has invalid format' })
			.min(1, 'is required'),
		contactPreference: requiredString(),
		mailingAddress1: requiredString(),
		mailingAddress2: z.string().optional(),
		mailingCity: requiredString(),
		mailingState: requiredString(),
		mailingPostal: requiredString(),
		mailingCountry: requiredString(),
		isPrimaryInsured: z.boolean().optional(),
		languagePreference: z.string().optional(),
		lossDate: requiredDate,
		lossWindow: z
			.object({
				start: optionalDate,
				end: optionalDate
			})
			.optional()
			.refine(
				value =>
					!value?.start && !value?.end
						? true
						: Boolean(value?.start && value?.end),
				{ message: 'start & end required' }
			),
		incidentType: requiredString(),
		incidentDescription: requiredString(),
		incidentLocationAddress: requiredString(),
		incidentLocationCity: requiredString(),
		incidentLocationState: requiredString(),
		incidentLocationPostal: requiredString(),
		weatherConditions: z.string().optional(),
		damagedAreas: z.array(z.string()).optional(),
		wasPoliceNotified: z.boolean().optional(),
		policeReportNumber: z.string().optional(),
		authorityName: z.string().optional(),
		authorityPhone: optionalPhone,
		reportDate: requiredDate,
		reportTime: requiredString(),
		propertyType: requiredString(),
		vehicleYear: requiredString(),
		vehicleMake: requiredString(),
		vehicleModel: requiredString(),
		vehicleVin: requiredString(),
		vehicleMileage: z.preprocess(asOptionalNumber, z.number().min(0)),
		vehicleUse: requiredString(),
		propertyOwnership: requiredString(),
		damageEstimate: optionalNumber.optional(),
		deductibleAmount: optionalNumber.optional(),
		claimAmountRequested: optionalNumber.refine(value => value !== null, {
			message: 'is required'
		}),
		towRequired: z.boolean().optional(),
		drivable: z.boolean().optional(),
		rentalNeeded: z.boolean().optional(),
		rentalStartDate: optionalDate,
		rentalEndDate: optionalDate,
		rentalCompany: z.string().optional(),
		photosProvided: z.boolean().optional(),
		witnessCount: z.preprocess(asOptionalNumber, z.number().min(0)),
		witness1Name: z.string().optional(),
		witness1Phone: optionalPhone,
		injuriesReported: z.boolean().optional(),
		injuryDescription: z.string().optional(),
		medicalProviderName: z.string().optional(),
		medicalProviderPhone: optionalPhone,
		fraudAcknowledgement: z
			.boolean()
			.refine(value => value, { message: 'is required' }),
		additionalNotes: z.string().optional()
	})
	.required();

export type InsuranceClaimFormValues = z.infer<typeof validationSchema>;
