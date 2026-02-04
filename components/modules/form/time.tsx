import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';

import Input from '~/components/modules/form/input';

type TimeInputProps = ComponentPropsWithoutRef<typeof Input>;

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>((props, ref) => {
	return <Input {...props} ref={ref} type="time" />;
});

TimeInput.displayName = 'TimeInput';

export default TimeInput;
