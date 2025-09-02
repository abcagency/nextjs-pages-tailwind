import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

const DisplayDate = ({
	date,
	format = 'dddd, MMMM D, YYYY',
	showTimeZone = false,
	timezoneClassName
}) => {
	dayjs.extend(utc);
	dayjs.extend(timezone);

	const estTimezone = 'America/New_York';

	return (
		<>
			{dayjs(date).tz(estTimezone).format(format)}{' '}
			{showTimeZone && <span className={timezoneClassName}>(EST)</span>}
		</>
	);
};

export default DisplayDate;
