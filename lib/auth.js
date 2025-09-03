import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export const generateToken = (userId, email) => {
  return jwt.sign(
    { id: userId, email: email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const getTokenFromRequest = (request) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};

// export const requireAuth = (request) => {
//   const token = getTokenFromRequest(request);
//   if (!token) {
//     return { error: 'No token provided', status: 401 };
//   }

//   const decoded = verifyToken(token);
//   if (!decoded) {
//     return { error: 'Invalid or expired token', status: 401 };
//   }

//   return { user: decoded };
// };

export const requireAuth = (request) => {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return { error: "No token provided", status: 401 };
    }

    const token = authHeader.split(" ")[1]; // Bearer <token>
    const user = verifyToken(token); // your JWT verification function
    return { user }; 
  } catch (err) {
    return { error: "Invalid or expired token", status: 401 };
  }
};
