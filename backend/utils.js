import jwt from 'jsonwebtoken';
import Abonnement from './models/abonnementModel.js';
import Plan from './models/planModel.js';
import Chapitre from './models/chapitreModel.js';

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
// l'élève n'a pas d'abonnement 'actif' pour LE NIVEAU CONCERNÉ (pas n'importe
// quel abonnement — un élève peut suivre plusieurs formations, un abonnement
// pour la formation A ne doit jamais donner accès à la formation B).
// Les admins et profs passent toujours (ils n'ont pas besoin d'abonnement).
//
// `resolveNiveauId(req)` doit renvoyer le niveauId concerné par la requête.
// Si elle renvoie null/undefined, on refuse par prudence (mieux vaut bloquer
// que laisser passer par erreur).
export const hasActiveAbonnement = (resolveNiveauId) => async (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user.role === 'prof')) {
    return next();
  }
  try {
    const niveauId = await resolveNiveauId(req);
    if (!niveauId) {
      return res.status(400).json({ message: 'Niveau introuvable pour ce contenu.' });
    }

    const plans = await Plan.find({ niveauId }).select('_id');
    const planIds = plans.map((p) => p._id);

    const abonnement = await Abonnement.findOne({
      eleveId: req.user._id,
      planId: { $in: planIds },
      statut: 'actif',
      dateEcheance: { $gte: new Date() },
    });

    if (!abonnement) {
      return res.status(402).json({
        message: 'Un abonnement actif pour cette formation est requis pour accéder à ce contenu.',
        code: 'ABONNEMENT_REQUIS',
        niveauId,
      });
    }
    req.abonnement = abonnement;
    next();
  } catch (e) {
    res.status(500).json({ message: 'Erreur de vérification de l\'abonnement.' });
  }
};

// Résolveurs prêts à l'emploi pour les cas les plus courants
hasActiveAbonnement.parChapitreParam = (paramName = 'id') =>
  hasActiveAbonnement(async (req) => {
    const chapitre = await Chapitre.findById(req.params[paramName]).select('niveauId');
    return chapitre?.niveauId || null;
  });

hasActiveAbonnement.parChapitreBody = (fieldName = 'chapitreId') =>
  hasActiveAbonnement(async (req) => {
    const chapitre = await Chapitre.findById(req.body[fieldName]).select('niveauId');
    return chapitre?.niveauId || null;
  });