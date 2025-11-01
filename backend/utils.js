import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role,
    },
    process.env.JWT_SECRET || 'somethingsecret',
    {
      expiresIn: '30d',
    }
  );
};

export const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
      const token = authorization.slice(7, authorization.length); 
      jwt.verify(
        token,
        process.env.JWT_SECRET || 'somethingsecret',
        (err, decode) => {
          if (err) {
            res.status(401).send({ message: 'Invalid Token' });
          } else {
            req.user = decode;
            next();
          }
        }
      );
    } else {
      res.status(401).send({ message: 'No Token' });
    }
  };

// export const isAuth = (req, res, next) => {
//   const authorization = req.headers.authorization;

//   console.log('🟢 [isAuth] Vérification du token...');
//   console.log('📦 Authorization header reçu:', authorization);

//   if (authorization) {
//     const token = authorization.slice(7, authorization.length); // Supprime "Bearer "
//     console.log('🔑 Token extrait:', token);

//     jwt.verify(
//       token,
//       process.env.JWT_SECRET || 'somethingsecret',
//       (err, decode) => {
//         if (err) {
//           console.log('❌ Token invalide :', err.message);
//           return res.status(401).send({ message: 'Invalid Token' });
//         } else {
//           console.log('✅ Token valide pour l’utilisateur :', decode.email);
//           req.user = decode;
//           next();
//         }
//       }
//     );
//   } else {
//     console.log('🚫 Aucun token reçu dans les headers');
//     res.status(401).send({ message: 'No Token' });
//   }
// };


  export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(403).json({ message: 'Accès refusé : administrateur uniquement' })
  }
}