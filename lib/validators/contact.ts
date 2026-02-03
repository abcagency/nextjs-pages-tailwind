import * as Yup from 'yup';

export type ContactFormValues = {
	name: string;
	email: string;
	message: string;
	transportation: string[];
	favoriteColor: string;
	state: string;
	distance: number;
};

export const validationSchema: Yup.ObjectSchema<ContactFormValues> = Yup.object({
	name: Yup.string().required('is required'),
	email: Yup.string()
		.email('Invalid email address format')
		.required('is required'),
	state: Yup.string().required('is required'),
	message: Yup.string().required('is required'),
	transportation: Yup.array()
		.of(Yup.string().required('is required'))
		.min(1, 'is required')
		.required('is required'),
	favoriteColor: Yup.string().required('is required'),
	distance: Yup.number().min(0).required('is required')
}).required();
