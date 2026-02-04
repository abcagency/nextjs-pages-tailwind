'use client';

import * as React from 'react';
import { Toaster as SonnerToaster, toast } from 'sonner';

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

function Toaster(props: ToasterProps) {
	return (
		<SonnerToaster
			position="top-right"
			expand={false}
			closeButton={true}
			{...props}
		/>
	);
}

export { Toaster, toast };
