export const logout = async () => {
	await fetch('/api/logout', {method: 'PATCH'});
	window.location.href = '/';
};
