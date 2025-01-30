import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
	name: Yup.string().required('is required'),
	email: Yup.string()
		.email('Invalid email address format')
		.required('is required'),
	state: Yup.string().required('is required'),
	message: Yup.string().required('is required')
});
