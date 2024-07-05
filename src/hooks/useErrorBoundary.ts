import React, { useState, useEffect, ReactNode } from 'react';

const useErrorBoundary = () => {
	const [hasError, setHasError] = useState(false);
	const [error, setError] = useState(null);
	
	useEffect(() => {
		const errorHandler = (event: ErrorEvent) => {
			setHasError(true);
			setError(event.error);
		};
		
		window.addEventListener('error', errorHandler);
		
		return () => {
			window.removeEventListener('error', errorHandler);
		};
	}, []);
	
	const ErrorFallback = ({ children }: { children: ReactNode }) => {
		if (hasError) {
			return "Something went wrong.";
		}
		return children;
	};
	
	return { ErrorFallback, hasError, error };
};

export default useErrorBoundary;
