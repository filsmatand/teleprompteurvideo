import {
  ArrowLeft,
  Camera,
  Check,
  FlipHorizontal2,
  Mic,
  MicOff,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  Sparkles,
  Square,
  Timer,
  X,
  Zap,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

interface ScriptData {
  id?: number;
  title: string;
  content: string;
  category?: string;
  createdAt?: string;
}

type RecordingStatus =
  | "idle"
  | "ready"
  | "recording"
  | "paused"
  | "finished";

const WPM_VALUES = [80, 100, 120, 140, 160];

export default function CameraRecorder() {
  const navigate = useNavigate();

  // =====================================================
  // REFS
  // =====================================================

  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  const recorderRef =
    useRef<MediaRecorder | null>(null);

  const chunksRef =
    useRef<Blob[]>([]);

  const teleprompterRef =
    useRef<HTMLDivElement | null>(null);

  const animationFrameRef =
    useRef<number | null>(null);

  const lastFrameTimeRef =
    useRef<number | null>(null);

  // =====================================================
  // SCRIPT
  // =====================================================

  const [script, setScript] =
    useState<ScriptData | null>(null);

  // =====================================================
  // CAMERA
  // =====================================================

  const [cameraReady, setCameraReady] =
    useState(false);

  const [cameraError, setCameraError] =
    useState("");

  const [facingMode, setFacingMode] =
    useState<"user" | "environment">("user");

  const [isMuted, setIsMuted] =
    useState(false);

  // =====================================================
  // RECORDING
  // =====================================================

  const [status, setStatus] =
    useState<RecordingStatus>("idle");

  const [elapsedTime, setElapsedTime] =
    useState(0);

  const [recordedUrl, setRecordedUrl] =
    useState<string | null>(null);

  const [recordedBlob, setRecordedBlob] =
    useState<Blob | null>(null);

  // =====================================================
  // TELEPROMPTER
  // =====================================================

  const [wpm, setWpm] =
    useState(120);

  const [fontSize, setFontSize] =
    useState(34);

  const [teleprompterPlaying, setTeleprompterPlaying] =
    useState(false);

  const [showSettings, setShowSettings] =
    useState(false);

  // =====================================================
  // CHARGEMENT DU SCRIPT
  // =====================================================

  useEffect(() => {
    const savedScript =
      localStorage.getItem(
        "creatorflow_current_script"
      );

    if (!savedScript) {
      navigate("/scripts");
      return;
    }

    try {
      const parsed: ScriptData =
        JSON.parse(savedScript);

      setScript(parsed);
    } catch (error) {
      console.error(
        "Impossible de charger le script :",
        error
      );

      navigate("/scripts");
    }
  }, [navigate]);

  // =====================================================
  // CAMERA
  // =====================================================

  const stopCamera = useCallback(() => {
    if (!streamRef.current) {
      return;
    }

    streamRef.current
      .getTracks()
      .forEach((track) => track.stop());

    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setCameraError("");
      setCameraReady(false);

      stopCamera();

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
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
        videoRef.current.srcObject =
          stream;

        videoRef.current.muted = true;

        await videoRef.current.play();
      }

      setCameraReady(true);
      setStatus("ready");
    } catch (error) {
      console.error(error);

      setCameraError(
        "Impossible d'accéder à la caméra ou au microphone. Vérifiez les autorisations de votre navigateur."
      );

      setCameraReady(false);
      setStatus("idle");
    }
  }, [facingMode, stopCamera]);

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // =====================================================
  // TIMER
  // =====================================================

  useEffect(() => {
    if (status !== "recording") {
      return;
    }

    const interval =
      window.setInterval(() => {
        setElapsedTime(
          (previous) => previous + 1
        );
      }, 1000);

    return () =>
      window.clearInterval(interval);
  }, [status]);

  // =====================================================
  // NETTOYAGE TELEPROMPTEUR
  // =====================================================

  const stopTeleprompter = useCallback(() => {
    setTeleprompterPlaying(false);

    if (
      animationFrameRef.current !== null
    ) {
      cancelAnimationFrame(
        animationFrameRef.current
      );

      animationFrameRef.current = null;
    }

    lastFrameTimeRef.current = null;
  }, []);

  // =====================================================
  // CALCUL DE LA VITESSE
  // =====================================================

  /*
   * Le téléprompteur est basé sur les mots/minute.
   *
   * Exemple :
   *
   * 120 WPM
   * =
   * 2 mots par seconde
   *
   * On estime ensuite une hauteur moyenne
   * pour déterminer combien de pixels le
   * texte doit parcourir.
   */

  const getScrollSpeed = useCallback(() => {
    const averageCharactersPerWord = 6;

    const pixelsPerCharacter =
      fontSize * 0.45;

    const charactersPerMinute =
      wpm * averageCharactersPerWord;

    const pixelsPerMinute =
      charactersPerMinute *
      pixelsPerCharacter;

    const pixelsPerSecond =
      pixelsPerMinute / 60;

    return pixelsPerSecond;
  }, [fontSize, wpm]);

  // =====================================================
  // SCROLL FLUIDE
  // =====================================================

  const startTeleprompter = useCallback(() => {
    if (!teleprompterRef.current) {
      return;
    }

    if (teleprompterPlaying) {
      return;
    }

    setTeleprompterPlaying(true);

    lastFrameTimeRef.current =
      performance.now();

    const animate = (
      currentTime: number
    ) => {
      const container =
        teleprompterRef.current;

      if (!container) {
        return;
      }

      const lastTime =
        lastFrameTimeRef.current ??
        currentTime;

      const delta =
        currentTime - lastTime;

      lastFrameTimeRef.current =
        currentTime;

      /*
       * Protection contre les gros sauts
       * lorsque l'onglet devient inactif.
       */

      const safeDelta =
        Math.min(delta, 50);

      const pixelsPerSecond =
        getScrollSpeed();

      const distance =
        pixelsPerSecond *
        (safeDelta / 1000);

      container.scrollTop += distance;

      const reachedEnd =
        container.scrollTop +
          container.clientHeight >=
        container.scrollHeight - 5;

      if (reachedEnd) {
        setTeleprompterPlaying(false);

        animationFrameRef.current =
          null;

        lastFrameTimeRef.current =
          null;

        return;
      }

      animationFrameRef.current =
        requestAnimationFrame(animate);
    };

    animationFrameRef.current =
      requestAnimationFrame(animate);
  }, [
    getScrollSpeed,
    teleprompterPlaying,
  ]);

  // =====================================================
  // PAUSE TELEPROMPTEUR
  // =====================================================

  const pauseTeleprompter =
    useCallback(() => {
      stopTeleprompter();
    }, [stopTeleprompter]);

  // =====================================================
  // RESET TELEPROMPTEUR
  // =====================================================

  const resetTeleprompter =
    useCallback(() => {
      stopTeleprompter();

      if (teleprompterRef.current) {
        teleprompterRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }, [stopTeleprompter]);

  // =====================================================
  // CHANGER CAMERA
  // =====================================================

  function switchCamera() {
    if (
      status === "recording" ||
      status === "paused"
    ) {
      return;
    }

    setFacingMode((previous) =>
      previous === "user"
        ? "environment"
        : "user"
    );
  }

  // =====================================================
  // MICROPHONE
  // =====================================================

  function toggleMute() {
    if (!streamRef.current) {
      return;
    }

    const audioTracks =
      streamRef.current.getAudioTracks();

    const nextMuted = !isMuted;

    audioTracks.forEach((track) => {
      track.enabled = !nextMuted;
    });

    setIsMuted(nextMuted);
  }

  // =====================================================
  // FORMAT TIME
  // =====================================================

  function formatTime(seconds: number) {
    const minutes = Math.floor(
      seconds / 60
    );

    const secondsRemaining =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(
      secondsRemaining
    ).padStart(2, "0")}`;
  }

  // =====================================================
  // DEMARRER ENREGISTREMENT
  // =====================================================

  function startRecording() {
    if (!streamRef.current) {
      return;
    }

    if (
      typeof MediaRecorder ===
      "undefined"
    ) {
      alert(
        "Votre navigateur ne supporte pas l'enregistrement vidéo."
      );

      return;
    }

    chunksRef.current = [];

    setRecordedUrl(null);
    setRecordedBlob(null);
    setElapsedTime(0);

    resetTeleprompter();

    let mimeType =
      "video/webm;codecs=vp9,opus";

    if (
      !MediaRecorder.isTypeSupported(
        mimeType
      )
    ) {
      mimeType = "video/webm";
    }

    const recorder =
      new MediaRecorder(
        streamRef.current,
        {
          mimeType,
        }
      );

    recorderRef.current =
      recorder;

    recorder.ondataavailable = (
      event
    ) => {
      if (event.data.size > 0) {
        chunksRef.current.push(
          event.data
        );
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(
        chunksRef.current,
        {
          type: mimeType,
        }
      );

      const url =
        URL.createObjectURL(blob);

      setRecordedBlob(blob);
      setRecordedUrl(url);
      setStatus("finished");

      stopTeleprompter();
    };

    recorder.start(1000);

    setStatus("recording");

    /*
     * Petit délai pour laisser
     * l'enregistrement démarrer avant
     * de lancer le téléprompteur.
     */

    window.setTimeout(() => {
      startTeleprompter();
    }, 150);
  }

  // =====================================================
  // PAUSE ENREGISTREMENT
  // =====================================================

  function pauseRecording() {
    const recorder =
      recorderRef.current;

    if (!recorder) {
      return;
    }

    if (
      recorder.state === "recording"
    ) {
      recorder.pause();

      setStatus("paused");

      pauseTeleprompter();
    }
  }

  // =====================================================
  // REPRENDRE
  // =====================================================

  function resumeRecording() {
    const recorder =
      recorderRef.current;

    if (!recorder) {
      return;
    }

    if (
      recorder.state === "paused"
    ) {
      recorder.resume();

      setStatus("recording");

      window.setTimeout(() => {
        startTeleprompter();
      }, 100);
    }
  }

  // =====================================================
  // STOP
  // =====================================================

  function stopRecording() {
    const recorder =
      recorderRef.current;

    if (!recorder) {
      return;
    }

    stopTeleprompter();

    if (
      recorder.state !== "inactive"
    ) {
      recorder.stop();
    }
  }

  // =====================================================
  // RECOMMENCER
  // =====================================================

  function restartRecording() {
    setRecordedUrl(null);
    setRecordedBlob(null);
    setElapsedTime(0);

    resetTeleprompter();

    setStatus("ready");
  }

  // =====================================================
  // TELECHARGER VIDEO
  // =====================================================

  function downloadVideo() {
    if (!recordedBlob) {
      return;
    }

    const url =
      URL.createObjectURL(recordedBlob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download = `${
      script?.title ||
      "creatorflow-video"
    }.webm`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
  }

  // =====================================================
  // QUITTER
  // =====================================================

  function leaveRecorder() {
    if (
      status === "recording" ||
      status === "paused"
    ) {
      const confirmed =
        window.confirm(
          "Vous êtes en train d'enregistrer. Voulez-vous vraiment quitter ?"
        );

      if (!confirmed) {
        return;
      }
    }

    stopTeleprompter();
    stopCamera();

    navigate("/scripts");
  }

  // =====================================================
  // SCRIPT NON CHARGE
  // =====================================================

  if (!script) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111014] text-white">

        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7041e8]/15 text-[#9b7cff]">
            <Sparkles size={24} />
          </div>

          <p className="mt-4 text-sm font-semibold">
            Chargement du script...
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#111014] text-white">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#111014]/90 backdrop-blur-xl">

        <div className="mx-auto flex h-[68px] max-w-[1500px] items-center justify-between px-4">

          {/* LEFT */}

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={leaveRecorder}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="hidden sm:block">

              <p className="max-w-[280px] truncate text-sm font-bold">
                {script.title}
              </p>

              <p className="text-[10px] text-white/35">
                {script.category ||
                  "Présentation"}
              </p>

            </div>

          </div>

          {/* LOGO */}

          <div className="flex items-center gap-2">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7041e8] shadow-lg shadow-[#7041e8]/30">
              <Sparkles size={16} />
            </div>

            <span className="hidden text-sm font-bold sm:block">
              Creator
              <span className="text-[#8d64ff]">
                Flow
              </span>
            </span>

          </div>

          {/* STATUS */}

          <div
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-[10px] font-bold ${
              status === "recording"
                ? "bg-red-500/15 text-red-400"
                : status === "paused"
                ? "bg-yellow-500/10 text-yellow-400"
                : "bg-white/5 text-white/50"
            }`}
          >

            <span
              className={`h-2 w-2 rounded-full ${
                status === "recording"
                  ? "animate-pulse bg-red-500"
                  : status === "paused"
                  ? "bg-yellow-400"
                  : "bg-white/30"
              }`}
            />

            {status === "recording"
              ? "ENREGISTREMENT"
              : status === "paused"
              ? "PAUSE"
              : status === "finished"
              ? "TERMINÉ"
              : "PRÊT"}

          </div>

        </div>

      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="mx-auto flex min-h-screen max-w-[1500px] flex-col px-3 pb-5 pt-[84px]">

        {/* CAMERA ERROR */}

        {cameraError && (
          <div className="mb-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-xs text-red-300">
            {cameraError}
          </div>
        )}

        {/* =================================================
            CAMERA + TELEPROMPTER
        ================================================= */}

        <div className="grid min-h-[calc(100vh-180px)] flex-1 gap-3 lg:grid-cols-[1.45fr_0.75fr]">

          {/* =================================================
              CAMERA
          ================================================= */}

          <section className="relative min-h-[500px] overflow-hidden rounded-[28px] border border-white/10 bg-[#19171d] shadow-2xl">

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`absolute inset-0 h-full w-full object-cover ${
                facingMode === "user"
                  ? "scale-x-[-1]"
                  : ""
              }`}
            />

            {/* GRADIENT */}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />

            {/* CAMERA LOADING */}

            {!cameraReady && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#19171d]">

                <div className="max-w-xs px-6 text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7041e8]/15 text-[#9b7cff]">
                    <Camera size={24} />
                  </div>

                  <p className="mt-4 text-sm font-semibold">
                    Activation de la caméra
                  </p>

                  <p className="mt-2 text-[10px] leading-5 text-white/35">
                    Autorisez la caméra et le
                    microphone dans votre
                    navigateur.
                  </p>

                </div>

              </div>
            )}

            {/* TOP */}

            <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between">

              <div className="flex items-center gap-2 rounded-xl bg-black/40 px-3 py-2 backdrop-blur-md">

                <Camera size={14} />

                <span className="text-[10px] font-semibold">
                  Caméra
                </span>

              </div>

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={switchCamera}
                  disabled={
                    status ===
                      "recording" ||
                    status === "paused"
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/40 text-white/80 backdrop-blur-md transition hover:bg-black/60 disabled:opacity-30"
                  title="Changer de caméra"
                >
                  <FlipHorizontal2
                    size={17}
                  />
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl backdrop-blur-md ${
                    isMuted
                      ? "bg-red-500 text-white"
                      : "bg-black/40 text-white/80"
                  }`}
                >
                  {isMuted ? (
                    <MicOff size={17} />
                  ) : (
                    <Mic size={17} />
                  )}
                </button>

              </div>

            </div>

            {/* TIMER */}

            {(status === "recording" ||
              status === "paused") && (

              <div className="absolute left-1/2 top-5 z-10 -translate-x-1/2">

                <div className="flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 backdrop-blur-md">

                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      status === "recording"
                        ? "animate-pulse bg-red-500"
                        : "bg-yellow-400"
                    }`}
                  />

                  <span className="font-mono text-xs font-bold">
                    {formatTime(
                      elapsedTime
                    )}
                  </span>

                </div>

              </div>

            )}

            {/* RECORD BUTTONS */}

            <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-center">

              {status === "ready" && (

                <button
                  type="button"
                  onClick={startRecording}
                  disabled={!cameraReady}
                  className="group flex h-20 w-20 items-center justify-center rounded-full border-[5px] border-white/30 bg-red-500 shadow-2xl transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="h-12 w-12 rounded-full border-4 border-white transition group-hover:scale-90" />
                </button>

              )}

              {status === "recording" && (

                <button
                  type="button"
                  onClick={pauseRecording}
                  className="flex h-20 w-20 items-center justify-center rounded-full border-[5px] border-white/30 bg-red-500 shadow-2xl transition hover:scale-105"
                >
                  <Pause
                    size={25}
                    fill="white"
                  />
                </button>

              )}

              {status === "paused" && (

                <div className="flex items-center gap-4">

                  <button
                    type="button"
                    onClick={resumeRecording}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-[#7041e8] shadow-xl shadow-[#7041e8]/30 transition hover:scale-105"
                  >
                    <Play
                      size={22}
                      fill="white"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={stopRecording}
                    className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur transition hover:bg-red-500/30"
                  >
                    <Square
                      size={20}
                      fill="white"
                    />
                  </button>

                </div>

              )}

            </div>

          </section>

          {/* =================================================
              TELEPROMPTER
          ================================================= */}

          <section className="relative flex min-h-[500px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#18161c]">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7041e8]/15 text-[#a386ff]">
                  <Sparkles size={16} />
                </div>

                <div>

                  <p className="text-xs font-bold">
                    Téléprompteur
                  </p>

                  <p className="text-[9px] text-white/30">
                    {wpm} mots/minute
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowSettings(
                    (previous) =>
                      !previous
                  )
                }
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                  showSettings
                    ? "bg-[#7041e8]"
                    : "bg-white/5 text-white/50"
                }`}
              >
                <Settings2 size={16} />
              </button>

            </div>

            {/* SETTINGS */}

            {showSettings && (

              <div className="absolute left-3 right-3 top-[76px] z-30 rounded-2xl border border-white/10 bg-[#27242c] p-4 shadow-2xl">

                {/* WPM */}

                <div>

                  <div className="mb-3 flex items-center justify-between">

                    <span className="text-[10px] font-semibold text-white/50">
                      Vitesse de lecture
                    </span>

                    <span className="text-xs font-bold text-[#a386ff]">
                      {wpm} WPM
                    </span>

                  </div>

                  <div className="grid grid-cols-5 gap-1">

                    {WPM_VALUES.map(
                      (value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            setWpm(value)
                          }
                          className={`rounded-lg py-2 text-[9px] font-bold transition ${
                            wpm === value
                              ? "bg-[#7041e8] text-white"
                              : "bg-white/5 text-white/40 hover:bg-white/10"
                          }`}
                        >
                          {value}
                        </button>
                      )
                    )}

                  </div>

                </div>

                {/* FONT */}

                <div className="mt-5">

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-[10px] font-semibold text-white/50">
                      Taille du texte
                    </span>

                    <span className="text-xs font-bold text-[#a386ff]">
                      {fontSize}px
                    </span>

                  </div>

                  <input
                    type="range"
                    min="22"
                    max="52"
                    step="2"
                    value={fontSize}
                    onChange={(event) =>
                      setFontSize(
                        Number(
                          event.target.value
                        )
                      )
                    }
                    className="w-full accent-[#7041e8]"
                  />

                </div>

              </div>

            )}

            {/* =================================================
                TEXTE
            ================================================= */}

            <div
              ref={teleprompterRef}
              className="relative flex-1 overflow-y-auto px-6"
              style={{
                scrollbarWidth: "none",
              }}
            >

              {/* ZONE CENTRALE */}

              <div className="pointer-events-none absolute left-0 right-0 top-1/2 z-10 -translate-y-1/2">

                <div className="relative">

                  <div className="h-px bg-[#8d64ff]/30" />

                  <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8d64ff]" />

                  <div className="h-px bg-[#8d64ff]/30" />

                </div>

              </div>

              {/* FADE TOP */}

              <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 h-28 bg-gradient-to-b from-[#18161c] to-transparent" />

              {/* FADE BOTTOM */}

              <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-28 bg-gradient-to-t from-[#18161c] to-transparent" />

              {/* CONTENU */}

              <div
                className="relative pb-[60vh] pt-[45vh] text-center font-medium leading-[1.6] text-white/90"
                style={{
                  fontSize: `${fontSize}px`,
                }}
              >

                {script.content
                  .split(/\n+/)
                  .filter(
                    (line) =>
                      line.trim().length > 0
                  )
                  .map(
                    (line, index) => (
                      <p
                        key={index}
                        className="mx-auto mb-8 max-w-[600px]"
                      >
                        {line}
                      </p>
                    )
                  )}

              </div>

            </div>

            {/* =================================================
                CONTROLS
            ================================================= */}

            <div className="border-t border-white/10 p-3">

              <div className="flex items-center justify-between gap-2">

                <button
                  type="button"
                  onClick={resetTeleprompter}
                  className="flex h-10 items-center gap-2 rounded-xl bg-white/5 px-3 text-[10px] font-semibold text-white/50 transition hover:bg-white/10 hover:text-white"
                >
                  <RotateCcw size={13} />

                  <span className="hidden sm:inline">
                    Début
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (
                      teleprompterPlaying
                    ) {
                      pauseTeleprompter();
                    } else {
                      startTeleprompter();
                    }
                  }}
                  className="flex h-10 items-center gap-2 rounded-xl bg-[#7041e8] px-5 text-[10px] font-bold shadow-lg shadow-[#7041e8]/20 transition hover:bg-[#6034d7]"
                >
                  {teleprompterPlaying ? (
                    <>
                      <Pause size={13} />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play
                        size={13}
                        fill="currentColor"
                      />
                      Lire
                    </>
                  )}
                </button>

                <div className="flex h-10 items-center gap-2 rounded-xl bg-white/5 px-3">

                  <Zap
                    size={13}
                    className="text-[#a386ff]"
                  />

                  <span className="text-[10px] font-bold text-white/50">
                    {wpm}
                  </span>

                </div>

              </div>

            </div>

          </section>

        </div>

        {/* =================================================
            FOOTER INFO
        ================================================= */}

        <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-[#18161c] px-4 py-3">

          <div className="flex items-center gap-2">

            <Timer
              size={14}
              className="text-[#8d64ff]"
            />

            <span className="text-[10px] text-white/40">
              Durée{" "}
              <span className="font-bold text-white/70">
                {formatTime(
                  elapsedTime
                )}
              </span>
            </span>

          </div>

          <div className="text-[10px] text-white/30">

            {wpm} mots/min

            <span className="mx-2">
              •
            </span>

            {fontSize}px

          </div>

        </div>

      </main>

      {/* =====================================================
          PREVIEW
      ===================================================== */}

      {status === "finished" &&
        recordedUrl && (

          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">

            <div className="w-full max-w-3xl overflow-hidden rounded-[28px] border border-white/10 bg-[#1a181e] shadow-2xl">

              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">

                <div>

                  <p className="text-sm font-bold">
                    Enregistrement terminé
                  </p>

                  <p className="mt-1 text-[10px] text-white/30">
                    {formatTime(
                      elapsedTime
                    )}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={restartRecording}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                >
                  <X size={16} />
                </button>

              </div>

              <video
                src={recordedUrl}
                controls
                autoPlay
                className="aspect-video w-full bg-black"
              />

              <div className="flex flex-col gap-2 p-4 sm:flex-row">

                <button
                  type="button"
                  onClick={restartRecording}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-xs font-semibold text-white/60 hover:bg-white/10 hover:text-white"
                >
                  <RotateCcw size={14} />
                  Recommencer
                </button>

                <button
                  type="button"
                  onClick={downloadVideo}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 text-xs font-semibold text-white/70 hover:bg-white/15 hover:text-white"
                >
                  Télécharger
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/recordings"
                    )
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#7041e8] px-4 py-3 text-xs font-bold shadow-lg shadow-[#7041e8]/20 hover:bg-[#6034d7]"
                >
                  <Check size={14} />
                  Mes vidéos
                </button>

              </div>

            </div>

          </div>
        )}

    </div>
  );
}