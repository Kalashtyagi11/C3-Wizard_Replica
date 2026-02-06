export default function authHeader() {
  const user = localStorage.getItem('token');
  if (!user) {
    return { Authorization: `Bearer ${user}` };
  }
  return { Authorization: `Bearer ${user}` };
}
