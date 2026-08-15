import {
  ArrowLeft,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Settings2,
  VideoOff,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { supabase } from "../../lib/supabase";

interface Script {
  id: string;
  user_id: string;
  title: string;
  content: string;
}

export default function Recordings() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  /* ========================================= */
  /* SCRIPT ID */
  /* ========================================= */

  const scriptId = searchParams.get("script");

  /* ========================================= */
  /* REFS */
  /* ========================================= */

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const chunksRef =
    useRef<Blob[]>([]);

  const animationRef =
    useRef<number | null>(null);

  const lastFrameRef =
    useRef<number | null>(null);

  /* ========================================= */
  /* SCRIPT */
  /* ========================================= */

  const [script, setScript] =
    useState<Script | null>(null);

  const [scriptLoading, setScriptLoading] =
    useState(true);

  const [scriptError, setScriptError] =
    useState<string | null>(null);

  /* ========================================= */
  /* CAMERA */
  /* ========================================= */

  const [cameraReady, setCameraReady] =
    useState(false);

  const [cameraError, setCameraError] =
    useState(false);

  /* ========================================= */
  /* RECORDING */
  /* ========================================= */

  const [isRecording, setIsRecording] =
    useState(false);

  const [recordingTime, setRecordingTime] =
    useState(0);

  /* ========================================= */
  /* TELEPROMPTER */
  /* ========================================= */

  const [isPromptPlaying, setIsPromptPlaying] =
    useState(false);

  const [speed, setSpeed] =
    useState(1);

  const [fontSize, setFontSize] =
    useState(32);

  const [promptPosition, setPromptPosition] =
    useState(0);

  /* ========================================= */
  /* UI */
  /* ========================================= */

  const [showSettings, setShowSettings] =
    useState(false);

  const [showScript, setShowScript] =
    useState(true);

  /* ========================================= */
  /* LOAD SCRIPT FROM SUPABASE */
  /* ========================================= */

  useEffect(() => {
    let cancelled = false;

    const loadScript = async () => {
      setScriptLoading(true);
      setScriptError(null);

      if (!scriptId) {
        setScriptError(
          "Aucun script n'a été sélectionné."
        );

        setScriptLoading(false);
        return;
      }

      try {
        const {
          data: {
            user,
          },
        } = await supabase.auth.getUser();

        if (!user) {
          setScriptError(
            "Vous devez être connecté pour accéder à ce script."
          );

          setScriptLoading(false);
          return;
        }

        const {
          data,
          error,
        } = await supabase
          .from("scripts")
          .select(
            "id, user_id, title, content"
          )
          .eq("id", scriptId)
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error(
            "Erreur récupération script:",
            error
          );

          if (!cancelled) {
            setScriptError(
              "Impossible de récupérer ce script."
            );
          }

          return;
        }

        if (!cancelled) {
          setScript({
            id: data.id,
            user_id: data.user_id,
            title:
              data.title || "Nouveau script",
            content:
              data.content || "",
          });
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setScriptError(
            "Une erreur est survenue lors du chargement du script."
          );
        }
      } finally {
        if (!cancelled) {
          setScriptLoading(false);
        }
      }
    };

    loadScript();

    return () => {
      cancelled = true;
    };
  }, [scriptId]);

  /* ========================================= */
  /* CAMERA */
  /* ========================================= */

  const startCamera = useCallback(async () => {
    try {
      setCameraError(false);
      setCameraReady(false);

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        throw new Error(
          "getUserMedia n'est pas disponible."
        );
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: {
              ideal: 1920,
            },
            height: {
              ideal: 1080,
            },
          },
          audio: true,
        });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        await videoRef.current.play().catch(() => {});
      }

      setCameraReady(true);
    } catch (error) {
      console.error(
        "Erreur caméra:",
        error
      );

      setCameraError(true);
      setCameraReady(false);
    }
  }, []);

  /* ========================================= */
  /* INITIALIZE CAMERA */
  /* ========================================= */

  useEffect(() => {
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());

        streamRef.current = null;
      }
    };
  }, [startCamera]);

  /* ========================================= */
  /* TELEPROMPTER ANIMATION */
  /* ========================================= */

  const animatePrompt = useCallback(
    (timestamp: number) => {
      if (
        lastFrameRef.current === null
      ) {
        lastFrameRef.current = timestamp;
      }

      const delta =
        timestamp -
        lastFrameRef.current;

      lastFrameRef.current =
        timestamp;

      if (isPromptPlaying) {
        setPromptPosition(
          (previous) =>
            previous +
            (delta / 1000) *
              speed *
              28
        );
      }

      animationRef.current =
        requestAnimationFrame(
          animatePrompt
        );
    },
    [isPromptPlaying, speed]
  );

  useEffect(() => {
    if (isPromptPlaying) {
      lastFrameRef.current = null;

      animationRef.current =
        requestAnimationFrame(
          animatePrompt
        );
    }

    return () => {
      if (
        animationRef.current !== null
      ) {
        cancelAnimationFrame(
          animationRef.current
        );

        animationRef.current = null;
      }
    };
  }, [
    isPromptPlaying,
    animatePrompt,
  ]);

  /* ========================================= */
  /* RESET PROMPTER */
  /* ========================================= */

  const resetPrompt = () => {
    setPromptPosition(0);
    setIsPromptPlaying(false);
  };

  /* ========================================= */
  /* RECORDING TIMER */
  /* ========================================= */

  useEffect(() => {
    if (!isRecording) return;

    const interval =
      setInterval(() => {
        setRecordingTime(
          (previous) =>
            previous + 1
        );
      }, 1000);

    return () =>
      clearInterval(interval);
  }, [isRecording]);

  /* ========================================= */
  /* FORMAT TIME */
  /* ========================================= */

  const formatTime = (
    seconds: number
  ) => {
    const minutes =
      Math.floor(seconds / 60);

    const remainingSeconds =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  /* ========================================= */
  /* GET SUPPORTED MIME TYPE */
  /* ========================================= */

  const getMimeType = () => {
    const types = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
    ];

    for (const type of types) {
      if (
        MediaRecorder.isTypeSupported(
          type
        )
      ) {
        return type;
      }
    }

    return "";
  };

  /* ========================================= */
  /* START RECORDING */
  /* ========================================= */

  const startRecording = () => {
    if (
      !streamRef.current ||
      !cameraReady ||
      !script
    ) {
      return;
    }

    try {
      chunksRef.current = [];

      const mimeType =
        getMimeType();

      const recorder =
        mimeType
          ? new MediaRecorder(
              streamRef.current,
              {
                mimeType,
              }
            )
          : new MediaRecorder(
              streamRef.current
            );

      mediaRecorderRef.current =
        recorder;

      recorder.ondataavailable = (
        event
      ) => {
        if (
          event.data &&
          event.data.size > 0
        ) {
          chunksRef.current.push(
            event.data
          );
        }
      };

      recorder.onstop = () => {
        const finalType =
          mimeType ||
          "video/webm";

        const blob =
          new Blob(
            chunksRef.current,
            {
              type: finalType,
            }
          );

        const url =
          URL.createObjectURL(blob);

        /* Sauvegarde locale des infos */
        localStorage.setItem(
          "creatorflow_last_recording",
          JSON.stringify({
            scriptId: script.id,
            title: script.title,
            createdAt:
              new Date().toISOString(),
          })
        );

        /* Téléchargement */
        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.download = `${
          script.title ||
          "creatorflow-video"
        }.webm`;

        document.body.appendChild(
          link
        );

        link.click();

        document.body.removeChild(
          link
        );

        /*
         * On attend un peu avant de
         * libérer l'URL.
         */
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
      };

      recorder.onerror = (event) => {
        console.error(
          "MediaRecorder error:",
          event
        );

        setIsRecording(false);
        setIsPromptPlaying(false);
      };

      recorder.start(1000);

      setRecordingTime(0);

      setIsRecording(true);

      /*
       * Le téléprompteur démarre
       * automatiquement.
       */
      setIsPromptPlaying(true);
    } catch (error) {
      console.error(
        "Impossible de démarrer l'enregistrement:",
        error
      );
    }
  };

  /* ========================================= */
  /* STOP RECORDING */
  /* ========================================= */

  const stopRecording = () => {
    const recorder =
      mediaRecorderRef.current;

    if (
      recorder &&
      recorder.state !==
        "inactive"
    ) {
      recorder.stop();
    }

    setIsRecording(false);
    setIsPromptPlaying(false);
  };

  /* ========================================= */
  /* WORD COUNT */
  /* ========================================= */

  const wordCount =
    script?.content?.trim()
      ? script.content
          .trim()
          .split(/\s+/).length
      : 0;

  /* ========================================= */
  /* NO SCRIPT ID */
  /* ========================================= */

  if (
    !scriptLoading &&
    !scriptId
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-6">
        <div className="w-full max-w-md rounded-[28px] border border-black/[0.06] bg-white p-8 text-center shadow-xl">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <VideoOff size={22} />
          </div>

          <h2 className="text-lg font-bold">
            Aucun script sélectionné
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            Ouvrez un script puis cliquez
            sur « Démarrer la vidéo ».
          </p>

          <button
            onClick={() =>
              navigate(
                "/script/new"
              )
            }
            className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Créer un script
          </button>

        </div>
      </div>
    );
  }

  /* ========================================= */
  /* LOADING */
  /* ========================================= */

  if (scriptLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">

        <div className="text-center text-white">

          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />

          <p className="text-sm text-white/60">
            Chargement du script...
          </p>

        </div>

      </div>
    );
  }

  /* ========================================= */
  /* SCRIPT ERROR */
  /* ========================================= */

  if (scriptError || !script) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-6">

        <div className="w-full max-w-md rounded-[28px] border border-black/[0.06] bg-white p-8 text-center shadow-xl">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <VideoOff size={22} />
          </div>

          <h2 className="text-lg font-bold">
            Script introuvable
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            {scriptError ||
              "Ce script n'existe pas ou ne vous appartient pas."}
          </p>

          <button
            onClick={() =>
              navigate(
                "/script/new"
              )
            }
            className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Retour aux scripts
          </button>

        </div>

      </div>
    );
  }

  /* ========================================= */
  /* CAMERA ERROR */
  /* ========================================= */

  if (cameraError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-6">

        <div className="w-full max-w-md rounded-[28px] border border-black/[0.06] bg-white p-8 text-center shadow-xl">

          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <VideoOff size={22} />
          </div>

          <h2 className="text-lg font-bold">
            Caméra inaccessible
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            Autorisez l'accès à votre caméra
            et à votre microphone pour
            commencer l'enregistrement.
          </p>

          <button
            onClick={startCamera}
            className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Réessayer
          </button>

        </div>

      </div>
    );
  }

  /* ========================================= */
  /* UI */
  /* ========================================= */

  return (
    <div className="min-h-screen overflow-hidden bg-[#f5f5f5] text-[#151515]">

      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">

        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-4 sm:px-6">

          {/* BACK */}

          <button
            onClick={() =>
              navigate(
                "/script/new"
              )
            }
            className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-medium text-white backdrop-blur-xl transition hover:bg-white/20"
          >
            <ArrowLeft size={16} />

            <span className="hidden sm:block">
              Retour
            </span>
          </button>

          {/* TITLE */}

          <div className="max-w-[45%] text-center">

            <p className="truncate text-xs font-semibold text-white">
              {script.title}
            </p>

            <p className="mt-0.5 text-[9px] text-white/50">
              {wordCount} mots
            </p>

          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-2">

            {isRecording && (
              <div className="flex items-center gap-2 rounded-full bg-red-500/15 px-3 py-2 text-xs font-semibold text-white backdrop-blur-xl">

                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />

                {formatTime(
                  recordingTime
                )}

              </div>
            )}

            <button
              onClick={() =>
                setShowSettings(
                  !showSettings
                )
              }
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20"
            >
              <Settings2 size={16} />
            </button>

          </div>

        </div>

      </header>

      {/* ===================================== */}
      {/* CAMERA */}
      {/* ===================================== */}

      <main className="relative flex min-h-screen items-center justify-center">

        <div className="relative h-screen w-full overflow-hidden bg-black sm:h-[calc(100vh-32px)] sm:max-h-[900px] sm:w-[min(100vw,900px)] sm:rounded-[32px] sm:shadow-[0_30px_100px_rgba(0,0,0,0.25)]">

          {/* VIDEO */}

          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover [transform:scaleX(-1)]"
          />

          {/* OVERLAY */}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/55" />

          {/* ================================= */}
          {/* TELEPROMPTER */}
          {/* ================================= */}

          {showScript && (
            <div className="pointer-events-none absolute inset-x-0 top-[15%] bottom-[17%] overflow-hidden">

              {/* FADE TOP */}

              <div className="absolute left-0 right-0 top-0 z-20 h-24 bg-gradient-to-b from-black/50 to-transparent" />

              {/* FADE BOTTOM */}

              <div className="absolute bottom-0 left-0 right-0 z-20 h-28 bg-gradient-to-t from-black/60 to-transparent" />

              {/* TEXTE */}

              <div
                className="absolute left-6 right-6 top-1/2 z-30 text-center"
                style={{
                  transform: `translateY(-${promptPosition}px)`,
                }}
              >

                <div
                  className="mx-auto max-w-3xl whitespace-pre-wrap font-semibold leading-[1.45] tracking-[-0.02em] text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.8)]"
                  style={{
                    fontSize: `${fontSize}px`,
                  }}
                >
                  {script.content ||
                    "Votre script est vide."}
                </div>

              </div>

            </div>
          )}

          {/* ================================= */}
          {/* STATUS */}
          {/* ================================= */}

          <div className="absolute left-1/2 top-[90px] z-40 -translate-x-1/2">

            {!cameraReady ? (
              <div className="rounded-full bg-black/40 px-4 py-2 text-[10px] text-white/70 backdrop-blur-xl">
                Initialisation caméra...
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 text-[10px] text-white/80 backdrop-blur-xl">

                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />

                Caméra prête

              </div>
            )}

          </div>

          {/* ================================= */}
          {/* SETTINGS */}
          {/* ================================= */}

          {showSettings && (
            <div className="absolute right-4 top-[76px] z-50 w-[240px] rounded-[24px] border border-white/10 bg-black/75 p-4 text-white shadow-2xl backdrop-blur-2xl">

              <div className="mb-4 flex items-center justify-between">

                <span className="text-xs font-semibold">
                  Téléprompteur
                </span>

                <button
                  onClick={() =>
                    setShowSettings(
                      false
                    )
                  }
                  className="text-white/50 hover:text-white"
                >
                  <X size={15} />
                </button>

              </div>

              {/* VITESSE */}

              <div className="mb-5">

                <div className="mb-2 flex justify-between">

                  <span className="text-[10px] text-white/50">
                    Vitesse
                  </span>

                  <span className="text-[10px] font-semibold">
                    {speed.toFixed(1)}x
                  </span>

                </div>

                <input
                  type="range"
                  min="0.3"
                  max="2.5"
                  step="0.1"
                  value={speed}
                  onChange={(
                    event
                  ) =>
                    setSpeed(
                      Number(
                        event.target.value
                      )
                    )
                  }
                  className="w-full"
                />

              </div>

              {/* TAILLE */}

              <div>

                <div className="mb-2 flex justify-between">

                  <span className="text-[10px] text-white/50">
                    Taille du texte
                  </span>

                  <span className="text-[10px] font-semibold">
                    {fontSize}px
                  </span>

                </div>

                <div className="flex items-center gap-2">

                  <button
                    onClick={() =>
                      setFontSize(
                        Math.max(
                          20,
                          fontSize - 2
                        )
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                  >
                    <Minus size={13} />
                  </button>

                  <div className="flex-1 text-center text-[10px] text-white/50">
                    Texte
                  </div>

                  <button
                    onClick={() =>
                      setFontSize(
                        Math.min(
                          52,
                          fontSize + 2
                        )
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                  >
                    <Plus size={13} />
                  </button>

                </div>

              </div>

              {/* AFFICHAGE SCRIPT */}

              <div className="mt-5 border-t border-white/10 pt-4">

                <button
                  onClick={() =>
                    setShowScript(
                      !showScript
                    )
                  }
                  className="flex w-full items-center justify-between text-[10px]"
                >
                  <span className="text-white/50">
                    Téléprompteur
                  </span>

                  <span>
                    {showScript
                      ? "Activé"
                      : "Désactivé"}
                  </span>

                </button>

              </div>

            </div>
          )}

          {/* ================================= */}
          {/* BOTTOM CONTROLS */}
          {/* ================================= */}

          <div className="absolute bottom-6 left-1/2 z-50 flex w-[calc(100%-24px)] -translate-x-1/2 flex-col items-center gap-4">

            {/* TELEPROMPTER CONTROLS */}

            <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/45 p-1.5 text-white shadow-xl backdrop-blur-2xl">

              {/* RESET */}

              <button
                onClick={
                  resetPrompt
                }
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <RotateCcw
                  size={15}
                />
              </button>

              {/* PLAY */}

              <button
                onClick={() =>
                  setIsPromptPlaying(
                    !isPromptPlaying
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition hover:scale-105"
              >
                {isPromptPlaying ? (
                  <Pause
                    size={16}
                    fill="currentColor"
                  />
                ) : (
                  <Play
                    size={16}
                    fill="currentColor"
                  />
                )}
              </button>

              {/* SPEED */}

              <div className="flex items-center gap-1 px-3 text-[10px] font-semibold">

                <span className="text-white/40">
                  Vitesse
                </span>

                <span>
                  {speed.toFixed(1)}x
                </span>

              </div>

            </div>

            {/* RECORD BUTTON */}

            <button
              onClick={
                isRecording
                  ? stopRecording
                  : startRecording
              }
              disabled={
                !cameraReady ||
                !script
              }
              className="group flex items-center gap-3 rounded-full border border-white/20 bg-black/60 px-5 py-3 text-xs font-semibold text-white shadow-2xl backdrop-blur-2xl transition-all hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-40"
            >

              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                  isRecording
                    ? "bg-red-500"
                    : "bg-white"
                }`}
              >

                {isRecording ? (
                  <span className="h-4 w-4 rounded-[4px] bg-white" />
                ) : (
                  <span className="h-4 w-4 rounded-full bg-red-500 transition group-hover:scale-110" />
                )}

              </span>

              {isRecording
                ? "Arrêter"
                : "Démarrer la vidéo"}

            </button>

          </div>

        </div>

      </main>

    </div>
  );
}