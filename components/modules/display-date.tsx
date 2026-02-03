import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

const estTimezone = 'America/New_York';

dayjs.extend(utc);
dayjs.extend(timezone);

type DisplayDateProps = {
	date: string | number | Date;
	format?: string;
	showTimeZone?: boolean;
	timezoneClassName?: string;
};

const DisplayDate = ({
	date,
	format = 'dddd, MMMM D, YYYY',
	showTimeZone = false,
	timezoneClassName
}: DisplayDateProps) => {
	return (
		<>
			{dayjs(date).tz(estTimezone).format(format)}{' '}
			{showTimeZone && <span className={timezoneClassName}>(EST)</span>}
		</>
	);
};

export default DisplayDate;
