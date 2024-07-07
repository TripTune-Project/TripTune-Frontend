export const logout = async () => {
	await fetch('/api/members/logout', {method: 'PATCH'});
	window.location.href = '/';
};
