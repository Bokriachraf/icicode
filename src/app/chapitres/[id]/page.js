'use client';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getChapitreDetails } from '../../../redux/actions/chapitreActions';
import Axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ChapitrePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();

  const { userInfo } = useSelector((state) => state.userSignin);
  const { loading, chapitre, error } = useSelector((state) => state.chapitreDetails);

  const [onglet, setOnglet] = useState('math'); // 'math' | 'python'
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);

  useEffect(() => {
    if (!userInfo) { router.push('/signin'); return; }
    dispatch(getChapitreDetails(id));
  }, [dispatch, id, userInfo]);

  useEffect(() => {
    if (chapitre?.python?.codeStarter) {
      setCode(chapitre.python.codeStarter);
    }
  }, [chapitre]);

  // Charger Pyodide
  useEffect(() => {
    if (onglet !== 'python' || pyodideRef.current) return;
    const loadPyodide = async () => {
      try {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
        script.onload = async () => {
          pyodideRef.current = await window.loadPyodide({
            indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
          });
          setPyodideReady(true);
        };
        document.head.appendChild(script);
      } catch (e) {
        console.error('Erreur Pyodide:', e);
      }
    };
    loadPyodide();
  }, [onglet]);

  const runCode = async () => {
    if (!pyodideRef.current) return;
    setRunning(true);
    setOutput('');
    try {
      // Capturer les prints Python
      await pyodideRef.current.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
`);
      await pyodideRef.current.runPythonAsync(code);
      const result = await pyodideRef.current.runPythonAsync(`sys.stdout.getvalue()`);
      setOutput(result || '✅ Code exécuté sans sortie.');
    } catch (err) {
      setOutput(`❌ Erreur : ${err.message}`);
    }
    setRunning(false);
  };

  const terminerMath = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await Axios.put(`${API}/api/progression/terminer-math`, { chapitreId: id }, config);
      setOnglet('python');
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      Chargement du chapitre...
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center text-red-500">
      {error}
    </div>
  );

  if (!chapitre) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 md:px-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <button
          onClick={() => router.back()}
          className="text-sm text-indigo-600 hover:underline mb-2 flex items-center gap-1"
        >
          ← Retour au dashboard
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-indigo-800">
          {chapitre.titre}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {chapitre.niveauId?.nom} — {chapitre.niveauId?.equivalenceFrance}
        </p>
      </motion.div>

      {/* Onglets Math / Python */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setOnglet('math')}
          className={`px-6 py-2 rounded-xl font-semibold text-sm transition ${
            onglet === 'math'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-white text-gray-500 border border-gray-200 hover:border-purple-300'
          }`}
        >
          📐 Cours Math
        </button>
        <button
          onClick={() => setOnglet('python')}
          className={`px-6 py-2 rounded-xl font-semibold text-sm transition ${
            onglet === 'python'
              ? 'bg-green-600 text-white shadow'
              : 'bg-white text-gray-500 border border-gray-200 hover:border-green-300'
          }`}
        >
          🐍 Application Python
        </button>
      </div>

      <AnimatePresence mode="wait">

        {/* ── ONGLET MATH ── */}
        {onglet === 'math' && (
          <motion.div
            key="math"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Vidéo replay */}
            {chapitre.math?.videoUrl && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-800">🎥 Replay de la séance</h2>
                </div>
                <div className="aspect-video">
                  <iframe
                    src={chapitre.math.videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Contenu cours */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-800 mb-4">📖 Cours</h2>
              {chapitre.math?.contenu ? (
                <div
                  className="prose prose-indigo max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: chapitre.math.contenu }}
                />
              ) : (
                <p className="text-gray-400 italic">
                  Le contenu du cours sera disponible après la séance.
                </p>
              )}
            </div>

            {/* PDF */}
            {chapitre.math?.fichierPdf && (
              <a
                href={chapitre.math.fichierPdf}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-indigo-600 hover:underline font-medium"
              >
                📄 Télécharger le cours en PDF
              </a>
            )}

            {/* Bouton terminer Math */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={terminerMath}
              className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition"
            >
              ✅ J'ai compris — Passer à Python →
            </motion.button>
          </motion.div>
        )}

        {/* ── ONGLET PYTHON ── */}
        {onglet === 'python' && (
          <motion.div
            key="python"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Consignes */}
            {chapitre.python?.consignes && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <h2 className="font-semibold text-green-800 mb-2">📋 Consignes</h2>
                <p className="text-green-700 text-sm leading-relaxed">
                  {chapitre.python.consignes}
                </p>
              </div>
            )}

            {/* Éditeur Pyodide */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-gray-400 text-xs ml-2 font-mono">main.py</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={runCode}
                  disabled={running || !pyodideReady}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition flex items-center gap-2"
                >
                  {running ? '⏳ Exécution...' : !pyodideReady ? '⏳ Chargement Python...' : '▶ Exécuter'}
                </motion.button>
              </div>

              {/* Zone de code */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 bg-gray-900 text-green-400 font-mono text-sm p-5 outline-none resize-none"
                spellCheck={false}
                placeholder="# Écris ton code Python ici..."
              />

              {/* Output */}
              {output && (
                <div className="border-t border-gray-700 bg-gray-950 p-4">
                  <p className="text-xs text-gray-500 mb-2 font-mono">OUTPUT</p>
                  <pre className="text-green-300 font-mono text-sm whitespace-pre-wrap">
                    {output}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
