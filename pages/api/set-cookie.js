import { COOKIE_NAME } from '../../constants/app';

export default (req, res) => {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${req.body}; HttpOnly; Max-Age=86400; Path=/; SameSite=Lax; Secure`)
  
  res.status(200).json({ message: 'ok' });
}
