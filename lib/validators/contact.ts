import * as Yup from 'yup';

const dateRegExp = /^\d{4}-\d{2}-\d{2}$/;
const phoneRegExp = /^\d{10}$/;

const asOptionalNumber = (value: unknown, originalValue: unknown) => {
	if (
		originalValue === '' ||
		originalValue === null ||
		originalValue === undefined
	) {
		return null;
	}
	if (typeof value === 'number' && Number.isNaN(value)) {
		return null;
	}
	return value;
};

export type InsuranceClaimFormValues = {
	policyNumber: string;
	claimNumber: string | undefined;
	policyType: string;
	insuredFirstName: string;
	insuredLastName: string;
	insuredDob: string;
	insuredPhone: string;
	insuredEmail: string;
	contactPreference: string;
	mailingAddress1: string;
	mailingAddress2: string | undefined;
	mailingCity: string;
	mailingState: string;
	mailingPostal: string;
	mailingCountry: string;
	isPrimaryInsured: boolean | undefined;
	languagePreference: string | undefined;
	lossDate: string;
	lossWindow: {
		start?: string;
		end?: string;
	} | undefined;
	incidentType: string;
	incidentDescription: string;
	incidentLocationAddress: string;
	incidentLocationCity: string;
	incidentLocationState: string;
	incidentLocationPostal: string;
	weatherConditions: string | undefined;
	damagedAreas: Array<string | undefined> | undefined;
	wasPoliceNotified: boolean | undefined;
	policeReportNumber: string | undefined;
	authorityName: string | undefined;
	authorityPhone: string | undefined;
	reportDate: string;
	reportTime: string;
	propertyType: string;
	vehicleYear: string;
	vehicleMake: string;
	vehicleModel: string;
	vehicleVin: string;
	vehicleMileage: number;
	vehicleUse: string;
	propertyOwnership: string;
	damageEstimate: number | null | undefined;
	deductibleAmount: number | null | undefined;
	claimAmountRequested: number | null;
	towRequired: boolean | undefined;
	drivable: boolean | undefined;
	rentalNeeded: boolean | undefined;
	rentalStartDate: string | undefined;
	rentalEndDate: string | undefined;
	rentalCompany: string | undefined;
	photosProvided: boolean | undefined;
	witnessCount: number;
	witness1Name: string | undefined;
	witness1Phone: string | undefined;
	injuriesReported: boolean | undefined;
	injuryDescription: string | undefined;
	medicalProviderName: string | undefined;
	medicalProviderPhone: string | undefined;
	fraudAcknowledgement: boolean | undefined;
	additionalNotes: string | undefined;
};

export const validationSchema: Yup.ObjectSchema<InsuranceClaimFormValues> =
	Yup.object({
		policyNumber: Yup.string()
			.matches(/^\d+$/, 'enter digits only')
			.required('is required'),
		claimNumber: Yup.string(),
		policyType: Yup.string().required('is required'),
		insuredFirstName: Yup.string().required('is required'),
		insuredLastName: Yup.string().required('is required'),
		insuredDob: Yup.string()
			.matches(dateRegExp, 'use YYYY-MM-DD format')
			.required('is required'),
		insuredPhone: Yup.string()
			.matches(phoneRegExp, 'enter 10 digits')
			.required('is required'),
		insuredEmail: Yup.string()
			.email('invalid email address')
			.required('is required'),
		contactPreference: Yup.string().required('is required'),
		mailingAddress1: Yup.string().required('is required'),
		mailingAddress2: Yup.string(),
		mailingCity: Yup.string().required('is required'),
		mailingState: Yup.string().required('is required'),
		mailingPostal: Yup.string().required('is required'),
		mailingCountry: Yup.string().required('is required'),
		isPrimaryInsured: Yup.boolean(),
		languagePreference: Yup.string(),
		lossDate: Yup.string()
			.matches(dateRegExp, 'use YYYY-MM-DD format')
			.required('is required'),
		lossWindow: Yup.object({
			start: Yup.string().matches(dateRegExp, {
				message: 'use YYYY-MM-DD format',
				excludeEmptyString: true
			}),
			end: Yup.string().matches(dateRegExp, {
				message: 'use YYYY-MM-DD format',
				excludeEmptyString: true
			})
		}).test('lossWindow-complete', 'start & end required', value => {
			if (!value?.start && !value?.end) {
				return true;
			}
			return Boolean(value?.start && value?.end);
		}),
		incidentType: Yup.string().required('is required'),
		incidentDescription: Yup.string().required('is required'),
		incidentLocationAddress: Yup.string().required('is required'),
		incidentLocationCity: Yup.string().required('is required'),
		incidentLocationState: Yup.string().required('is required'),
		incidentLocationPostal: Yup.string().required('is required'),
		weatherConditions: Yup.string(),
		damagedAreas: Yup.array().of(Yup.string()),
		wasPoliceNotified: Yup.boolean(),
		policeReportNumber: Yup.string(),
		authorityName: Yup.string(),
		authorityPhone: Yup.string().matches(phoneRegExp, {
			message: 'enter 10 digits',
			excludeEmptyString: true
		}),
		reportDate: Yup.string()
			.matches(dateRegExp, 'use YYYY-MM-DD format')
			.required('is required'),
		reportTime: Yup.string().required('is required'),
		propertyType: Yup.string().required('is required'),
		vehicleYear: Yup.string().required('is required'),
		vehicleMake: Yup.string().required('is required'),
		vehicleModel: Yup.string().required('is required'),
		vehicleVin: Yup.string().required('is required'),
		vehicleMileage: Yup.number().min(0).required('is required'),
		vehicleUse: Yup.string().required('is required'),
		propertyOwnership: Yup.string().required('is required'),
		damageEstimate: Yup.number().transform(asOptionalNumber).nullable(),
		deductibleAmount: Yup.number().transform(asOptionalNumber).nullable(),
		claimAmountRequested: Yup.number()
			.transform(asOptionalNumber)
			.nullable()
			.required('is required'),
		towRequired: Yup.boolean(),
		drivable: Yup.boolean(),
		rentalNeeded: Yup.boolean(),
		rentalStartDate: Yup.string().matches(dateRegExp, {
			message: 'use YYYY-MM-DD format',
			excludeEmptyString: true
		}),
		rentalEndDate: Yup.string().matches(dateRegExp, {
			message: 'use YYYY-MM-DD format',
			excludeEmptyString: true
		}),
		rentalCompany: Yup.string(),
		photosProvided: Yup.boolean(),
		witnessCount: Yup.number().min(0).required('is required'),
		witness1Name: Yup.string(),
		witness1Phone: Yup.string().matches(phoneRegExp, {
			message: 'enter 10 digits',
			excludeEmptyString: true
		}),
		injuriesReported: Yup.boolean(),
		injuryDescription: Yup.string(),
		medicalProviderName: Yup.string(),
		medicalProviderPhone: Yup.string().matches(phoneRegExp, {
			message: 'enter 10 digits',
			excludeEmptyString: true
		}),
		fraudAcknowledgement: Yup.boolean().oneOf([true], 'is required'),
		additionalNotes: Yup.string()
	}).required();
