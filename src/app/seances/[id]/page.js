'use client';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { getSeanceDetails, joinSeance } from '../../../redux/actions/seanceActions';

export default function SeanceLivePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();

  const { userInfo } = useSelector((state) => state.userSignin);
  const { loading, seance } = useSelector((state) => state.seanceDetails);
  const { jitsiUrl, loading: joining } = useSelector((state) => state.seanceJoin);

  const [view, setView] = useState('split'); // 'split' | 'visio' | 'cours'
  const [code, setCode] = useState('# Code Python rapide\n');
  const [output, setOutput] = useState('');
  const [running, setRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef(null);

  useEffect(() => {
    if (!userInfo) { router.push('/signin'); return; }
    dispatch(getSeanceDetails(id));
    dispatch(joinSeance(id));
  }, [dispatch, id, userInfo]);

  // Charger Pyodide en arrière-plan
  useEffect(() => {
    if (pyodideRef.current) return;
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
    script.onload = async () => {
      pyodideRef.current = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/',
      });
      setPyodideReady(true);
    };
    document.head.appendChild(script);
  }, []);

  const runCode = async () => {
    if (!pyodideRef.current) return;
    setRunning(true);
    setOutput('');
    try {
      await pyodideRef.current.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
`);
      await pyodideRef.current.runPythonAsync(code);
      const result = await pyodideRef.current.runPythonAsync(`sys.stdout.getvalue()`);
      setOutput(result || '✅ Exécuté sans sortie.');
    } catch (err) {
      setOutput(`❌ ${err.message}`);
    }
    setRunning(false);
  };

  if (!userInfo) return null;

  return (
    <div className="h-screen bg-gray-900 flex flex-col">

      {/* Barre de navigation */}
      <div className="bg-gray-800 border-b border-gray-700 px-5 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/seances')}
            className="text-gray-400 hover:text-white text-sm transition"
          >
            ← Quitter
          </button>
          <div className="w-px h-4 bg-gray-600" />
          <span className="text-white font-semibold text-sm">
            {loading ? 'Chargement...' : seance?.titre}
          </span>
          {seance?.statut === 'en_cours' && (
            <span className="flex items-center gap-1 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">
              🔴 En direct
            </span>
          )}
        </div>

        {/* Switch de vue */}
        <div className="flex gap-1 bg-gray-700 rounded-lg p-1">
          {[
            { key: 'visio', label: '📹 Visio' },
            { key: 'split', label: '⬛ Split' },
            { key: 'cours', label: '🐍 Python' },
          ].map((v) => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              className={`text-xs px-3 py-1.5 rounded-md font-medium transition ${
                view === v.key
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Corps principal */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── Panneau Jitsi ── */}
        {(view === 'visio' || view === 'split') && (
          <div className={`flex flex-col ${view === 'split' ? 'w-1/2' : 'w-full'} border-r border-gray-700`}>
            {joining ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                Connexion à la séance...
              </div>
            ) : jitsiUrl ? (
              <iframe
                src={jitsiUrl}
                className="flex-1 w-full"
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                style={{ border: 'none' }}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Séance non disponible
              </div>
            )}
          </div>
        )}

        {/* ── Panneau Python ── */}
        {(view === 'cours' || view === 'split') && (
          <div className={`flex flex-col ${view === 'split' ? 'w-1/2' : 'w-full'} bg-gray-900`}>

            {/* Header éditeur */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="text-gray-400 text-xs ml-2 font-mono">main.py</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={runCode}
                disabled={running || !pyodideReady}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white text-xs font-bold px-4 py-1.5 rounded-lg transition"
              >
                {running ? '⏳...' : !pyodideReady ? '⏳ Python...' : '▶ Run'}
              </motion.button>
            </div>

            {/* Zone code */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-gray-900 text-green-400 font-mono text-sm p-4 outline-none resize-none"
              spellCheck={false}
            />

            {/* Output */}
            {output && (
              <div className="border-t border-gray-700 bg-gray-950 p-4 max-h-40 overflow-auto flex-shrink-0">
                <p className="text-xs text-gray-500 mb-1 font-mono">OUTPUT</p>
                <pre className="text-green-300 font-mono text-xs whitespace-pre-wrap">
                  {output}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
