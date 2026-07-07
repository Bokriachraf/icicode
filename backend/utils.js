import jwt from 'jsonwebtoken';
import Abonnement from './models/abonnementModel.js';

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

// Middleware prof : isAdmin OU role === 'prof'
export const isProf = (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user.role === 'prof')) {
    next()
  } else {
    res.status(403).json({ message: 'Accès refusé : professeur uniquement' })
  }
}

// Middleware abonnement actif : bloque l'accès au contenu pédagogique tant que
// l'élève n'a pas d'abonnement 'actif' avec une date d'échéance non dépassée.
// Les admins et profs passent toujours (ils n'ont pas besoin d'abonnement).
export const hasActiveAbonnement = async (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user.role === 'prof')) {
    return next();
  }
  try {
    const abonnement = await Abonnement.findOne({
      eleveId: req.user._id,
      statut: 'actif',
      dateEcheance: { $gte: new Date() },
    });
    if (!abonnement) {
      return res.status(402).json({
        message: 'Un abonnement actif est requis pour accéder à ce contenu.',
        code: 'ABONNEMENT_REQUIS',
      });
    }
    req.abonnement = abonnement;
    next();
  } catch (e) {
    res.status(500).json({ message: 'Erreur de vérification de l\'abonnement.' });
  }
};