"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listMyInscription } from "../../../redux/actions/inscriptionActions";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  GraduationCap,
} from "lucide-react";

export default function SuiviInscriptionPage() {
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.userSignin || {});
  const inscriptionListMy = useSelector((state) => state.inscriptionListMy || {});
  const { loading, inscription, error } = inscriptionListMy || {};

  useEffect(() => {
    if (userInfo) {
      dispatch(listMyInscription());
    }
  }, [dispatch, userInfo]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Validé":
        return { color: "text-green-600", Icon: CheckCircle, bg: "bg-green-50" };
      case "Rejeté":
        return { color: "text-red-600", Icon: AlertCircle, bg: "bg-red-50" };
      case "En cours":
        return {
          color: "text-orange-500",
          Icon: () => <Loader2 className="w-4 h-4 animate-spin" />,
          bg: "bg-orange-50",
        };
      case "En attente":
      default:
        return { color: "text-blue-500", Icon: Clock, bg: "bg-blue-50" };
    }
  };

  if (!userInfo) {
    return (
      <div className="p-6 text-center text-gray-600 mt-20">
        <h2 className="text-xl font-semibold mb-3">Connexion requise</h2>
        <p>Veuillez vous connecter pour consulter vos inscriptions aux formations.</p>
        <Link
          href="/login"
          className="text-blue-600 hover:underline mt-2 inline-block"
        >
          Aller à la page de connexion
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 pt-24 pb-24 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Suivi de vos inscriptions aux formations
      </h1>

      {loading && (
        <div className="flex items-center justify-center text-gray-600">
          <Loader2 className="animate-spin mr-2" />
          Chargement en cours...
        </div>
      )}

      {error && (
        <div className="text-red-600 text-center mb-4">
          Une erreur est survenue : {error}
        </div>
      )}

      {!loading && inscription?.length === 0 && (
        <p className="text-center text-gray-500">
          Aucune inscription trouvée pour le moment.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {inscription?.map((item) => {
          const { color, Icon, bg } = getStatusStyle(item.status);

          return (
            <div
              key={item._id}
              className={`p-5 border rounded-xl shadow hover:shadow-md transition duration-200 ${bg}`}
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-sm text-gray-600">
                  Référence :{" "}
                  <span className="text-gray-800 font-mono">{item._id}</span>
                </h2>
                <span
                  className={`flex items-center gap-1 font-medium text-sm ${color}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.status || "En attente"}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <GraduationCap className="w-5 h-5 text-indigo-500" />
                <p className="text-gray-800 font-medium">
                  {item.formation || "Formation non spécifiée"}
                </p>
              </div>

              <p className="text-sm text-gray-700">
                <strong>Date d’inscription :</strong>{" "}
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("fr-FR")
                  : "Non renseignée"}
              </p>
              <Link
                href={`/inscription/${item._id}`}
                className="inline-block mt-3 text-sm text-blue-600 hover:underline font-medium"
              >
                Voir les détails
              </Link>
              {item.status === "Validé" && (
                <Link
                  href="/dashboard"
                  className="inline-block mt-3 text-sm text-indigo-600 hover:underline font-medium"
                >
                  Accéder à la formation →
                </Link>
              )}

              {item.status !== "Validé" && (
                <p className="mt-3 text-xs text-gray-500 italic">
                  L’accès à la formation sera disponible une fois la validation
                  effectuée.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


