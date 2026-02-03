import * as Yup from 'yup';

const phoneRegExp =
	/^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;

export type ContactFormValues = {
	name: string;
	email: string;
	phone: string;
	message: string;
	transportation: string[];
	favoriteColor: string;
	state: string;
	distance: number;
	date: string;
	time: string;
};

export const validationSchema: Yup.ObjectSchema<ContactFormValues> = Yup.object(
	{
		name: Yup.string().required('is required'),
		email: Yup.string().email('invalid email address').required('is required'),
		phone: Yup.string()
			.matches(phoneRegExp, 'invalid phone number')
			.required('is required'),
		state: Yup.string().required('is required'),
		message: Yup.string().required('is required'),
		transportation: Yup.array()
			.of(Yup.string().required('is required'))
			.min(1, 'is required')
			.required('is required'),
		favoriteColor: Yup.string().required('is required'),
		distance: Yup.number().min(0).required('is required'),
		date: Yup.string().required('is required'),
		time: Yup.string().required('is required')
	}
).required();
