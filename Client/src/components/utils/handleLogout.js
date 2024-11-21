export const handleLogout = (e, navigate) => {
    e.preventDefault();
    localStorage.removeItem('username');
    navigate('/', { replace: true });
    window.location.reload();
};
