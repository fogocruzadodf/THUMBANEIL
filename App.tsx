import React, { useState, useCallback } from 'react';
import { generateThumbnail, correctPortugueseText } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import { ImageUploadIcon, DownloadIcon, SparklesIcon, WarnIcon, YouTubeIcon, InstagramIcon, CloseIcon } from './components/Icons';

type AspectRatio = '16:9' | '1:1' | '4:5' | '9:16';

interface UploadedFile {
  base64: string;
  mimeType: string;
  name: string;
}

interface GeneratedImage {
  src: string;
  format: string;
  aspectRatio: AspectRatio;
}

const App: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<UploadedFile | null>(null);
  const [styleReferenceFile, setStyleReferenceFile] = useState<UploadedFile | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [topText, setTopText] = useState('ROGÉRIO MORRO DA CRUZ');
  const [mainTextLine1, setMainTextLine1] = useState('NÃO É SÓ UM NOME,');
  const [mainTextLine2, setMainTextLine2] = useState('É UMA HISTÓRIA!');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setError(null);
        setGeneratedImages(null);
        const { base64, mimeType } = await fileToBase64(file);
        setUploadedFile({ base64, mimeType, name: file.name });
      } catch (err) {
        setError('Failed to read file. Please try again.');
        setUploadedFile(null);
      }
    }
  };

  const handleBackgroundFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const { base64, mimeType } = await fileToBase64(file);
        setBackgroundFile({ base64, mimeType, name: file.name });
      } catch (err) {
        setError('Failed to read background file.');
        setBackgroundFile(null);
      }
    }
  };
  
  const handleStyleReferenceChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const { base64, mimeType } = await fileToBase64(file);
        setStyleReferenceFile({ base64, mimeType, name: file.name });
      } catch (err) {
        setError('Failed to read style reference file.');
        setStyleReferenceFile(null);
      }
    }
  };


  const handleGenerateClick = useCallback(async () => {
    if (!uploadedFile) {
      setError('Please upload an image first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImages(null);

    try {
      const [correctedTop, correctedLine1, correctedLine2] = await Promise.all([
        correctPortugueseText(topText),
        correctPortugueseText(mainTextLine1),
        correctPortugueseText(mainTextLine2),
      ]);

      setTopText(correctedTop);
      setMainTextLine1(correctedLine1);
      setMainTextLine2(correctedLine2);
      
      const generationPromises = [
        generateThumbnail(
          uploadedFile.base64, uploadedFile.mimeType, correctedTop, correctedLine1, correctedLine2, '16:9', backgroundFile?.base64, backgroundFile?.mimeType, styleReferenceFile?.base64, styleReferenceFile?.mimeType
        ),
        generateThumbnail(
          uploadedFile.base64, uploadedFile.mimeType, correctedTop, correctedLine1, correctedLine2, '1:1', backgroundFile?.base64, backgroundFile?.mimeType, styleReferenceFile?.base64, styleReferenceFile?.mimeType
        )
      ];

      const [youtubeImage, instagramImage] = await Promise.all(generationPromises);
      
      const results: GeneratedImage[] = [];
      if (youtubeImage) {
        results.push({ src: youtubeImage, format: 'YouTube (16:9)', aspectRatio: '16:9' });
      }
      if (instagramImage) {
        results.push({ src: instagramImage, format: 'Instagram (1:1)', aspectRatio: '1:1' });
      }

      if (results.length === 0) {
        throw new Error("Generation failed for all formats.");
      }

      setGeneratedImages(results);

    } catch (err) {
      console.error(err);
      setError('Failed to generate thumbnail. The model may be unavailable. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedFile, topText, mainTextLine1, mainTextLine2, backgroundFile, styleReferenceFile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/40 to-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-yellow-300">
            AI Thumbnail Generator
          </h1>
          <p className="mt-2 text-lg text-gray-300">
            Create professional thumbnails in seconds.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls Column */}
          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
            <div className="space-y-6">
              <div>
                <label className="text-lg font-semibold text-blue-300">1. Upload Your Character</label>
                <div className="mt-2 flex justify-center items-center w-full">
                  <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700/80 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageUploadIcon className="w-10 h-10 mb-3 text-gray-400" />
                      {uploadedFile ? (
                         <p className="text-sm text-gray-300"><span className="font-semibold">{uploadedFile.name}</span> selected</p>
                      ) : (
                        <>
                        <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB)</p>
                        </>
                      )}
                    </div>
                    <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-lg font-semibold text-blue-300">2. Upload a Background (Optional)</label>
                 <div className="mt-2">
                    {!backgroundFile ? (
                        <label htmlFor="background-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700/80 transition-colors">
                            <div className="flex flex-col items-center justify-center">
                                <ImageUploadIcon className="w-8 h-8 mb-2 text-gray-400" />
                                <p className="text-sm text-gray-400"><span className="font-semibold">Upload a background image</span></p>
                                <p className="text-xs text-gray-500">Provide a scene for the character</p>
                            </div>
                            <input id="background-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleBackgroundFileChange} />
                        </label>
                    ) : (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-gray-600">
                             <img src={`data:${backgroundFile.mimeType};base64,${backgroundFile.base64}`} alt="Background" className="w-full h-full object-cover" />
                             <button onClick={() => setBackgroundFile(null)} className="absolute top-2 right-2 bg-black/60 rounded-full p-1.5 text-white hover:bg-black/80 transition-colors">
                                <CloseIcon className="w-5 h-5" />
                             </button>
                        </div>
                    )}
                 </div>
              </div>
              
              <div>
                 <label className="text-lg font-semibold text-blue-300">3. Customize Text</label>
                  <div className="space-y-4 mt-2">
                    <input type="text" value={topText} onChange={(e) => setTopText(e.target.value)} placeholder="Top corner text" className="w-full bg-gray-700 border-gray-600 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500 transition-all" />
                    <input type="text" value={mainTextLine1} onChange={(e) => setMainTextLine1(e.target.value)} placeholder="Main text (line 1)" className="w-full bg-gray-700 border-gray-600 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500 transition-all" />
                    <input type="text" value={mainTextLine2} onChange={(e) => setMainTextLine2(e.target.value)} placeholder="Main text (line 2)" className="w-full bg-gray-700 border-gray-600 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500 transition-all" />
                  </div>
              </div>

              <div>
                <label className="text-lg font-semibold text-blue-300">4. Formats</label>
                <div className="mt-2 bg-gray-700/50 p-4 rounded-lg flex items-center gap-4 border border-gray-600">
                  <YouTubeIcon className="w-8 h-8 text-red-500 flex-shrink-0" />
                  <InstagramIcon className="w-7 h-7 text-pink-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-200">YouTube & Instagram</p>
                    <p className="text-sm text-gray-400">Thumbnails will be generated for both platforms.</p>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-lg font-semibold text-blue-300">5. Style Reference (Optional)</label>
                 <div className="mt-2">
                    {!styleReferenceFile ? (
                        <label htmlFor="style-ref-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700/80 transition-colors">
                            <div className="flex flex-col items-center justify-center">
                                <ImageUploadIcon className="w-8 h-8 mb-2 text-gray-400" />
                                <p className="text-sm text-gray-400"><span className="font-semibold">Upload a style example</span></p>
                                <p className="text-xs text-gray-500">Use colors & fonts from an image</p>
                            </div>
                            <input id="style-ref-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleStyleReferenceChange} />
                        </label>
                    ) : (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-gray-600">
                             <img src={`data:${styleReferenceFile.mimeType};base64,${styleReferenceFile.base64}`} alt="Style reference" className="w-full h-full object-cover" />
                             <button onClick={() => setStyleReferenceFile(null)} className="absolute top-2 right-2 bg-black/60 rounded-full p-1.5 text-white hover:bg-black/80 transition-colors">
                                <CloseIcon className="w-5 h-5" />
                             </button>
                        </div>
                    )}
                 </div>
              </div>


              <button
                onClick={handleGenerateClick}
                disabled={isLoading || !uploadedFile}
                className="w-full flex items-center justify-center gap-2 text-lg font-bold py-4 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-6 h-6" />
                    Generate Thumbnails
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Previews Column */}
          <div className="grid grid-cols-1 gap-8 content-start">
            {uploadedFile && !generatedImages && !isLoading && (
              <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
                <h3 className="font-bold text-lg mb-2 text-gray-300">Original Image</h3>
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-900">
                    <img src={`data:${uploadedFile.mimeType};base64,${uploadedFile.base64}`} alt="Uploaded original" className="object-contain w-full h-full" />
                </div>
              </div>
            )}
             {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg flex items-start gap-3">
                <WarnIcon className="w-6 h-6 flex-shrink-0 mt-0.5"/>
                <div>
                  <h4 className="font-bold">Generation Failed</h4>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {isLoading && (
               <div className="space-y-6">
                <h3 className="font-bold text-xl text-gray-300">Generating Thumbnails...</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[{f: 'YouTube (16:9)', ar: 'aspect-video'}, {f: 'Instagram (1:1)', ar: 'aspect-square'}].map(item => (
                    <div key={item.f} className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
                      <h4 className="font-bold text-lg mb-2 text-gray-400">{item.f}</h4>
                      <div className={`rounded-lg overflow-hidden bg-gray-900 flex flex-col items-center justify-center text-gray-400 ${item.ar}`}>
                        <div className="w-10 h-10 border-4 border-t-transparent border-blue-400 rounded-full animate-spin"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {generatedImages && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-xl text-gray-300">Results</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {generatedImages.map((image) => {
                     const aspectRatioClass = image.aspectRatio === '16:9' ? 'aspect-video' : 'aspect-square';
                     return (
                        <div key={image.format} className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700">
                            <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-lg text-gray-300">{image.format}</h4>
                            <a
                                href={`data:image/jpeg;base64,${image.src}`}
                                download={`thumbnail-${image.aspectRatio.replace(':', '-')}-${new Date().getTime()}.jpg`}
                                className="flex items-center gap-2 bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors"
                            >
                                <DownloadIcon className="w-5 h-5"/>
                                Download
                            </a>
                            </div>
                            <div className={`${aspectRatioClass} rounded-lg overflow-hidden bg-gray-900`}>
                                <img src={`data:image/jpeg;base64,${image.src}`} alt={`Generated thumbnail for ${image.format}`} className="object-contain w-full h-full" />
                            </div>
                        </div>
                     )
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;