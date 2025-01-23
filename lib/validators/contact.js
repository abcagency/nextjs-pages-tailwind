import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
	name: Yup.string().required('is required'),
	email: Yup.string()
		.email('Invalid email address format')
		.required('is required'),
	message: Yup.string().required('is required'),
	transportation: Yup.array().min(1, 'Select a transportation type'),
	state: Yup.string().required('is required')
});
