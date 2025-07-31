'use client';

import { useState } from 'react';
import Tesseract from 'tesseract.js';

export default function OCRUpload({ onExtractedText }) {
  const [loading, setLoading] = useState(false);
  const [ocrText, setOcrText] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const {
        data: { text },
      } = await Tesseract.recognize(file, 'fra+eng', {
        langPath: 'https://tessdata.projectnaptha.com/4.0.0/', // 👈 assure le chargement de fra
        logger: (m) => console.log(m),
      });

      setOcrText(text);
      onExtractedText(text); // renvoie le texte vers Step1.js
    } catch (error) {
      console.error('Erreur OCR :', error);
      setOcrText("Erreur lors de l'analyse OCR.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Importer un document (PDF/Image) pour pré-remplir automatiquement
      </label>
      <input type="file" accept="image/*,.pdf" onChange={handleFile} />

      {loading && <p className="text-xs text-blue-600 mt-2">🔍 Analyse OCR en cours (fra+eng)...</p>}

      {ocrText && (
        <textarea
          readOnly
          value={ocrText}
          className="mt-2 p-2 w-full h-32 border rounded text-xs"
        />
      )}
    </div>
  );
}


// 'use client'

// import React, { useState } from 'react'
// import Tesseract from 'tesseract.js'

// const OCRUpload = ({ onExtractedText }) => {
//   const [selectedFile, setSelectedFile] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [text, setText] = useState('')

//   const handleFileChange = (e) => {
//     const file = e.target.files[0]
//     if (file) {
//       setSelectedFile(file)
//       processImage(file)
//     }
//   }

//   const processImage = async (file) => {
//     setLoading(true)
//     try {
//       const { data: { text: extractedText } } = await Tesseract.recognize(
//         file,
//         'eng', // ou 'fra' si documents en français
//         {
//           logger: m => console.log(m) // pour voir la progression
//         }
//       )
//       setText(extractedText)
//       if (onExtractedText) {
//         onExtractedText(extractedText) // callback vers ton formulaire
//       }
//     } catch (error) {
//       console.error('Erreur OCR:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="p-4 border rounded-lg bg-gray-100">
//       <label className="block text-sm font-medium mb-2">Importer un document (image ou PDF)</label>
//       <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
//       {loading && <p className="text-blue-500 mt-2">Lecture du document en cours...</p>}
//       {text && (
//         <div className="mt-4">
//           <p className="text-sm font-semibold mb-1">Texte extrait :</p>
//           <pre className="bg-white p-2 rounded border text-sm whitespace-pre-wrap">{text}</pre>
//         </div>
//       )}
//     </div>
//   )
// }

// export default OCRUpload
