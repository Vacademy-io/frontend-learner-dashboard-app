/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { useTrackingStore } from "@/stores/study-library/youtube-video-tracking-store";
import { getEpochTimeInMillis } from "./utils";
import { convertTimeToSeconds } from "@/utils/study-library/tracking/convertTimeToSeconds";
import { formatVideoTime } from "@/utils/study-library/tracking/formatVideoTime";
import { calculateNetDuration } from "@/utils/study-library/tracking/calculateNetDuration";
import { useVideoSync } from "@/hooks/study-library/useVideoSync";
import YouTube, {
  type YouTubeEvent,
  type YouTubeProps,
} from "react-youtube";
import {
  ArrowsOut,
  FastForward,
  Pause,
  Play,
  Rewind,
  Gauge,
  ArrowsIn,
} from "@phosphor-icons/react";
import { Preferences } from "@capacitor/preferences";
import { Capacitor } from "@capacitor/core";
import { StatusBar } from "@capacitor/status-bar";
import { useContentStore } from "@/stores/study-library/chapter-sidebar-store";
import VideoQuestionOverlay from "./video-question-overlay";
import { useMediaRefsStore } from "@/stores/mediaRefsStore";

// --- Helper to detect iOS ---
const isIOS = () => {
  if (typeof window === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (window as any).Capacitor?.getPlatform?.() === "ios"
  );
};

// --- Constants ---
const BRIDGE_URL = "https://neerajhariyale.github.io/player.html/player.html";

enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5,
}

// --- Interfaces ---
interface YouTubePlayerProps {
  videoId: string;
  videoTitle?: string;
  onTimeUpdate?: (currentTime: number) => void;
  ms?: number;
  questions?: Array<{
    id: string;
    question_time_in_millis: number;
    text_data: { content: string };
    parent_rich_text?: { content: string };
    options: Array<{ id: string; text: { content: string } }>;
    can_skip?: boolean;
    question_type?: string;
    auto_evaluation_json?: string;
  }>;
  allowPlayPause?: boolean;
  allowRewind?: boolean;
  isLiveStream?: boolean;
  liveTimestamp?: number;
  liveClassStartTime?: string;
  enableConcentrationScore?: boolean;
}

export const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const YouTubePlayerComp = forwardRef<any, YouTubePlayerProps>(({
  videoId,
  onTimeUpdate,
  ms = 0,
  questions = [],
  allowPlayPause = true,
  allowRewind = true,
  isLiveStream = false,
  liveTimestamp = 0,
  enableConcentrationScore = true,
}, ref) => {
  // --- Stores & Hooks ---
  const { activeItem } = useContentStore();
  const addActivity = useTrackingStore((state) => state.addActivity);
  const { syncVideoTrackingData } = useVideoSync();
  const setCurrentYoutubeTime = useMediaRefsStore((state) => state.setCurrentYoutubeTime);
  const setCurrentYoutubeVideoLength = useMediaRefsStore((state) => state.setCurrentYoutubeVideoLength);

  // --- Refs ---
  const activityId = useRef(uuidv4());
  const currentTimestamps = useRef<Array<{ id: string; start_time: string; end_time: string; start: number; end: number; }>>([]);
  const videoStartTime = useRef<number>(0);
  const videoEndTime = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentStartTimeRef = useRef("");
  const timestampDurationRef = useRef(0);
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentStartTimeInEpochRef = useRef<number>(0);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const concentrationScoreId = useRef(uuidv4());
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const verificationTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // iOS Bridge Refs
  const iosIframeRef = useRef<HTMLIFrameElement>(null);
  const iosCurrentTimeRef = useRef<number>(0);

  // --- State ---
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isFirstPlay, setIsFirstPlay] = useState(true);
  const [isPlayed, setIsPlayed] = useState(allowPlayPause ? false : true);
  const [player, setPlayer] = useState<any | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [minutesInput, setMinutesInput] = useState("");
  const [secondsInput, setSecondsInput] = useState("");
  
  // Fullscreen States
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState(false);
  
  const [showControls, setShowControls] = useState(true);
  
  // Speed & Seek Animation
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [showSeekAnimation, setShowSeekAnimation] = useState<{ side: "left" | "right"; show: boolean }>({ side: "left", show: false });
  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  // Questions & Metrics
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [showQuestion, setShowQuestion] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, any>>({});
  
  // Verification
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCountdown, setVerificationCountdown] = useState(59);
  const [verificationNumbers, setVerificationNumbers] = useState<number[]>([]);
  const [lastVerificationTime, setLastVerificationTime] = useState(0);
  
  // Concentration Metrics
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [pauseCount, setPauseCount] = useState(0);
  const [wrongAnswerCount, setWrongAnswerCount] = useState(0);
  const [missedAnswerCount, setMissedAnswerCount] = useState(0);
  const [answerTimesInSeconds, setAnswerTimesInSeconds] = useState<number[]>([]);
  const [concentrationScore, setConcentrationScore] = useState(100);
  const [wasPausedByTabSwitch, setWasPausedByTabSwitch] = useState(false);
  
  // Live Stream
  const [isBehindLive, setIsBehindLive] = useState(false);

  // --- Helpers ---
  const safeGetNumber = async (value: any): Promise<number> => {
    if (value === undefined || value === null) return 0;
    if (typeof value === "number") return value;
    if (value instanceof Promise) {
      try {
        const resolved = await value;
        return typeof resolved === "number" ? resolved : 0;
      } catch { return 0; }
    }
    return 0;
  };

  const safePlayerOperation = async (operation: () => void, name = "op"): Promise<boolean> => {
    if (!player || !playerReady) return false;
    try { operation(); return true; } 
    catch (error) { console.error(`Error ${name}:`, error); return false; }
  };

  // --- Imperative Handle ---
  useImperativeHandle(ref, () => ({
    playVideo: () => { setIsPlayed(true); safePlayerOperation(() => player?.playVideo()); },
    pauseVideo: () => { setIsPlayed(false); safePlayerOperation(() => player?.pauseVideo()); },
    getCurrentTime: () => currentTime,
    getDuration: () => duration,
    seekTo: (seconds: number, allowSeekAhead: boolean) => {
      safePlayerOperation(() => player?.seekTo(seconds, allowSeekAhead));
      setCurrentTime(seconds);
    },
  }));

  // ==========================================
  // 🔥 iOS BRIDGE LOGIC
  // ==========================================
  useEffect(() => {
    if (!isIOS() || !videoId) return;

    const handleBridgeMessage = (event: MessageEvent) => {
      try {
        if (typeof event.data !== 'string') return;
        const data = JSON.parse(event.data);

        if (data.type === 'READY') {
          setDuration(data.payload.duration);
          // Fake Player Proxy for Bridge
          const bridgePlayer = {
            playVideo: () => iosIframeRef.current?.contentWindow?.postMessage(JSON.stringify({ command: 'play' }), '*'),
            pauseVideo: () => iosIframeRef.current?.contentWindow?.postMessage(JSON.stringify({ command: 'pause' }), '*'),
            seekTo: (seconds: number) => iosIframeRef.current?.contentWindow?.postMessage(JSON.stringify({ command: 'seekTo', seconds }), '*'),
            setVolume: (vol: number) => iosIframeRef.current?.contentWindow?.postMessage(JSON.stringify({ command: 'setVolume', volume: vol }), '*'),
            setPlaybackRate: (rate: number) => iosIframeRef.current?.contentWindow?.postMessage(JSON.stringify({ command: 'setPlaybackRate', rate }), '*'),
            getDuration: () => data.payload.duration,
            getCurrentTime: () => iosCurrentTimeRef.current,
            unMute: () => { },
            getIframe: () => iosIframeRef.current,
            getPlayerState: () => 1
          };
          setPlayer(bridgePlayer);
          setPlayerReady(true);
        }
        if (data.type === 'TIME_UPDATE') {
          iosCurrentTimeRef.current = data.payload.currentTime;
        }
        if (data.type === 'STATE_CHANGE') {
          const eventData = { data: data.payload.data, target: player };
          onStateChange(eventData as any);
        }
      } catch (e) { }
    };

    window.addEventListener('message', handleBridgeMessage);
    return () => window.removeEventListener('message', handleBridgeMessage);
  }, [videoId]);

  // --- Memos ---
  const memoizedQuestions = useMemo(() => questions, [JSON.stringify(questions)]);
  const timeToQuestionMap = useMemo(() => {
    if (memoizedQuestions && memoizedQuestions.length > 0) {
      return memoizedQuestions.map((q) => ({ time: q.question_time_in_millis, question: q }));
    }
    return [];
  }, [memoizedQuestions]);

  // --- Effects ---
  useEffect(() => { setCurrentYoutubeTime(currentTime); }, [currentTime]);
  useEffect(() => { setAnsweredQuestions({}); }, [memoizedQuestions, videoId]);

  // --- Logic Functions ---
  const checkForQuestions = useCallback(async () => {
    if (!timeToQuestionMap.length || !player) return;
    try {
      const currentTimeVal = await safeGetNumber(player.getCurrentTime());
      if (typeof currentTimeVal !== "number" || isNaN(currentTimeVal)) return;
      const currentTimeMs = currentTimeVal * 1000;

      const questionToShow = timeToQuestionMap.find(({ time, question }) => {
        if (answeredQuestions && answeredQuestions[question.id]?.answered) return false;
        return Math.abs(currentTimeMs - time) < 500;
      });

      if (questionToShow && !showQuestion) {
        player.pauseVideo();
        setIsPlayed(false);
        stopProgressTracking();
        stopTimer();
        setCurrentQuestion(questionToShow.question);
        setShowQuestion(true);
      }
    } catch (error) { console.error(error); }
  }, [timeToQuestionMap, showQuestion, answeredQuestions, player]);

  const handleQuestionSubmit = async (selectedOption: string | string[]) => {
    if (!currentQuestion) return { success: false };
    setAnsweredQuestions((prev) => ({
      ...prev,
      [currentQuestion.id]: { answered: true, selectedOptions: selectedOption, isCorrect: true, timestamp: Date.now() },
    }));
    return { success: true, isCorrect: true, explanation: "Correct!" };
  };

  const handleQuestionClose = () => {
    if (currentQuestion && currentQuestion.can_skip) {
      setAnsweredQuestions((prev) => ({
        ...prev,
        [currentQuestion.id]: { answered: true, selectedOptions: [], isCorrect: false, timestamp: Date.now() },
      }));
    }
    setShowQuestion(false);
    setCurrentQuestion(null);
    if (player) { player.playVideo(); setIsPlayed(true); }
  };

  // --- Concentration Logic ---
  useEffect(() => {
    if (!enableConcentrationScore) return;
    const loadSavedData = async () => {
      try {
        const { value } = await Preferences.get({ key: "video_concentration_metrics" });
        if (value) {
          const data = JSON.parse(value);
          setTabSwitchCount(data.tabSwitchCount || 0);
          setWrongAnswerCount(data.wrongAnswerCount || 0);
          setMissedAnswerCount(data.missedAnswerCount || 0);
          setPauseCount(data.pauseCount || 0);
          setAnswerTimesInSeconds(data.answerTimesInSeconds || []);
          setConcentrationScore(data.concentrationScore || 100);
        }
        const { value: vTime } = await Preferences.get({ key: "verification_time" });
        if (vTime) setLastVerificationTime(Number.parseInt(vTime, 10));
      } catch (e) { }
    };
    loadSavedData();
  }, [enableConcentrationScore]);

  useEffect(() => {
    if (!enableConcentrationScore) return;
    const score = Math.max(0, 100 - (tabSwitchCount * 10) - (wrongAnswerCount * 5) - (missedAnswerCount * 20) - (pauseCount * 5));
    setConcentrationScore(score);
    Preferences.set({ key: "video_concentration_metrics", value: JSON.stringify({ tabSwitchCount, wrongAnswerCount, missedAnswerCount, pauseCount, answerTimesInSeconds, concentrationScore: score }) });
  }, [tabSwitchCount, wrongAnswerCount, missedAnswerCount, pauseCount, enableConcentrationScore]);

  // --- Verification Logic ---
  const generateVerificationNumbers = useCallback(() => {
    const correct = Math.floor(Math.random() * 100);
    let n1 = correct, n2 = correct;
    while (n1 === correct) n1 = Math.floor(Math.random() * 100);
    while (n2 === correct || n2 === n1) n2 = Math.floor(Math.random() * 100);
    setVerificationNumbers([n1, correct, n2]);
  }, []);

  const startVerificationTimer = useCallback(() => {
    if (verificationTimerRef.current) clearInterval(verificationTimerRef.current);
    setVerificationCountdown(59);
    verificationTimerRef.current = setInterval(() => {
      setVerificationCountdown((prev) => {
        if (prev <= 1) {
          if (player) { player.pauseVideo(); setIsPlayed(false); }
          setMissedAnswerCount((p) => p + 1);
          if (verificationTimerRef.current) clearInterval(verificationTimerRef.current);
          setShowVerification(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [player]);

  const handleVerificationClick = (index: number) => {
    if (verificationTimerRef.current) clearInterval(verificationTimerRef.current);
    setAnswerTimesInSeconds([...answerTimesInSeconds, 59 - verificationCountdown]);
    if (index === 1) {
      const now = Math.floor(Date.now() / 1000);
      setLastVerificationTime(now);
      Preferences.set({ key: "verification_time", value: now.toString() });
      setShowVerification(false);
    } else {
      setWrongAnswerCount((p) => p + 1);
      if (player) { player.pauseVideo(); setIsPlayed(false); }
      setShowVerification(false);
    }
  };

  useEffect(() => {
    if (enableConcentrationScore && isPlayed && elapsedTime > 0 && elapsedTime % 180 === 0) {
      setShowVerification(true); generateVerificationNumbers(); startVerificationTimer();
    }
  }, [elapsedTime, isPlayed, enableConcentrationScore]);

  // --- Timing & Tracking ---
  const startTimer = useCallback(() => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setElapsedTime((p) => p + 1); timestampDurationRef.current += 1;
      }, 1000);
    }
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  const startProgressTracking = useCallback(() => {
    if (!progressIntervalRef.current) {
      progressIntervalRef.current = setInterval(async () => {
        if (player) {
          try {
            const time = await safeGetNumber(player.getCurrentTime());
            setCurrentTime(time);
            checkForQuestions();
            if (onTimeUpdate) onTimeUpdate(time);
          } catch (e) { }
        }
      }, 250);
    }
  }, [player, onTimeUpdate, checkForQuestions]);

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) { clearInterval(progressIntervalRef.current); progressIntervalRef.current = null; }
  }, []);

  const canNavigateToTime = useCallback((targetTimeSeconds: number) => {
    const targetMs = targetTimeSeconds * 1000;
    const prevQs = timeToQuestionMap.filter(({ time }) => time <= targetMs);
    return !prevQs.some(({ question }) => !question.can_skip && !answeredQuestions[question.id]?.answered);
  }, [timeToQuestionMap, answeredQuestions]);

  // --- Event Handlers ---
  const handleQuestionMarkerClick = useCallback((qData: any) => {
    if (!canNavigateToTime(qData.question_time_in_millis / 1000)) return;
    setCurrentQuestion(qData); setShowQuestion(true);
    if (player) { player.pauseVideo(); setIsPlayed(false); stopProgressTracking(); stopTimer(); }
  }, [canNavigateToTime, player]);

  // Visibility Change (Tab Switching)
  useEffect(() => {
    if (!enableConcentrationScore) return;
    const handleVisibility = () => {
      if (document.hidden) {
        setTabSwitchCount((p) => p + 1);
        if (player && isPlayed) { player.pauseVideo(); setIsPlayed(false); setWasPausedByTabSwitch(true); }
        if (showVerification) { setShowVerification(false); if (verificationTimerRef.current) clearInterval(verificationTimerRef.current); }
      } else {
        if (player && wasPausedByTabSwitch && !allowPlayPause) {
          setTimeout(() => { player.playVideo(); setIsPlayed(true); setWasPausedByTabSwitch(false); }, 500);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [player, isPlayed, wasPausedByTabSwitch, enableConcentrationScore]);

  // Video Duration
  useEffect(() => {
    if (player) {
      safeGetNumber(player.getDuration()).then(d => { setDuration(d); setCurrentYoutubeVideoLength(d); });
    }
  }, [player]);

  // Tracking Interval
  useEffect(() => {
    const endTime = videoEndTime.current || getEpochTimeInMillis();
    const netDuration = calculateNetDuration(currentTimestamps.current);
    const activity = {
      id: activeItem?.id || "",
      activity_id: activityId.current,
      source: "VIDEO" as const,
      source_id: videoId,
      start_time: videoStartTime.current,
      end_time: endTime,
      duration: elapsedTime.toString(),
      timestamps: currentTimestamps.current,
      percentage_watched: ((netDuration / duration) * 100).toFixed(2),
      sync_status: "STALE" as const,
      current_start_time: currentStartTimeRef.current,
      current_start_time_in_epoch: currentStartTimeInEpochRef.current,
      ...(enableConcentrationScore && {
        concentration_score: {
          id: concentrationScoreId.current,
          concentration_score: concentrationScore,
          tab_switch_count: tabSwitchCount,
          pause_count: missedAnswerCount,
          wrong_answer_count: wrongAnswerCount,
          missed_answer_count: missedAnswerCount,
          answer_times_in_seconds: answerTimesInSeconds,
        },
      }),
      new_activity: true,
    };
    addActivity(activity, true);
  }, [elapsedTime, duration, videoId, tabSwitchCount, concentrationScore]);

  // --- Player Controls ---
  const togglePause = async () => { if (allowPlayPause) { setIsPlayed(false); await safePlayerOperation(() => player?.pauseVideo()); } };
  const togglePlay = async () => { setIsPlayed(true); await safePlayerOperation(() => { try { player?.unMute(); } catch (e) { } player?.playVideo(); }); };
  const forcePause = async () => { player?.pauseVideo(); setIsPlayed(false); stopProgressTracking(); stopTimer(); };
  
  const onPlayerReady: YouTubeProps["onReady"] = async (e) => {
    setPlayer(e.target); setPlayerReady(true);
    setDuration(await safeGetNumber(e.target.getDuration()));
  };

  const onStateChange = async (event: YouTubeEvent) => {
    if (!player && !event.target) return;
    const target = player || event.target;
    try { setCurrentTime(await safeGetNumber(target.getCurrentTime())); } catch (e) { }

    if (event.data === PlayerState.PLAYING) {
      startTimer(); startProgressTracking(); setIsPlayed(true);
      if (isFirstPlay) { syncVideoTrackingData(); setIsFirstPlay(false); updateIntervalRef.current = setInterval(() => syncVideoTrackingData(), 60000); }
      currentStartTimeRef.current = formatVideoTime(currentTime);
      currentStartTimeInEpochRef.current = convertTimeToSeconds(currentStartTimeRef.current) * 1000;
    } else if (event.data === PlayerState.PAUSED || event.data === PlayerState.ENDED) {
      stopTimer(); stopProgressTracking(); videoEndTime.current = getEpochTimeInMillis();
      const endTimeSeconds = convertTimeToSeconds(currentStartTimeRef.current) + timestampDurationRef.current;
      const endTimeStamp = formatVideoTime(endTimeSeconds);
      currentTimestamps.current.push({
        id: uuidv4(), start_time: currentStartTimeRef.current, end_time: endTimeStamp,
        start: convertTimeToSeconds(currentStartTimeRef.current) * 1000,
        end: endTimeSeconds * 1000,
      });
      currentStartTimeRef.current = formatVideoTime(currentTime);
      timestampDurationRef.current = 0;
      setIsPlayed(false);
    }
  };

  const seekToTimestamp = async (seconds: number) => {
    if (!player || !playerReady || !allowRewind || !canNavigateToTime(seconds)) return;
    const dur = await safeGetNumber(player.getDuration());
    const final = Math.min(Math.max(seconds, 0), dur);
    if (await safePlayerOperation(() => player.seekTo(final, true))) setCurrentTime(final);
  };

  const handleProgressBarClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!player || !duration || !allowRewind) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const seekTime = ((e.clientX - rect.left) / rect.width) * duration;
    seekToTimestamp(seekTime);
  };

  const handleDoubleClick = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!player || !playerReady || !allowRewind) return;
    const isRight = (e.clientX - e.currentTarget.getBoundingClientRect().left) > e.currentTarget.clientWidth / 2;
    const curr = await safeGetNumber(player.getCurrentTime());
    const newTime = isRight ? curr + 10 : curr - 10;
    if (isRight && !canNavigateToTime(newTime)) { setShowSeekAnimation({ side: "right", show: false }); return; }
    if (await safePlayerOperation(() => player.seekTo(newTime, true))) {
      setCurrentTime(newTime);
      setShowSeekAnimation({ side: isRight ? "right" : "left", show: true });
      setTimeout(() => setShowSeekAnimation({ side: isRight ? "right" : "left", show: false }), 1000);
    }
  }, [player, canNavigateToTime, allowRewind]);

  // ==========================================
  // 🔥 UNIFIED CONTROLS HANDLER (IMPROVED)
  // ==========================================
  const handleInteraction = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    // 4 seconds timeout before hiding again
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 4000);
  };

  const handleContainerClick = (e: React.MouseEvent | React.TouchEvent) => {
    // Ignore clicks on buttons/inputs
    if ((e.target as HTMLElement).closest('button, input, .control-bar, .speed-menu')) return;
    
    if (!showControls) {
      // If controls are hidden, JUST show them (don't toggle play/pause)
      handleInteraction();
    } else {
      // If controls are visible, toggle play/pause AND keep controls visible for a bit
      isPlayed ? togglePause() : togglePlay();
      handleInteraction();
    }
  };

  // ==========================================
  // 🔥 ROBUST FULLSCREEN TOGGLE
  // ==========================================
  const toggleFullscreen = async () => {
    // Force controls to show when entering fullscreen
    handleInteraction();

    // 1. If currently in Pseudo mode (CSS), exit it
    if (isPseudoFullscreen) {
      setIsPseudoFullscreen(false);
      try {
        if (Capacitor.isNativePlatform()) await StatusBar.show();
      } catch (e) {}
      return;
    }

    // 2. If currently in Native mode, exit it
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
      return;
    }

    // 3. Try to Enter Native Fullscreen
    try {
      // Don't try native on iOS (it fails or shows warnings)
      if (playerContainerRef.current && !isIOS()) {
        await playerContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        throw new Error("iOS or Preference");
      }
    } catch (error) {
      // 4. Fallback: Force CSS Pseudo Fullscreen
      console.log("Native fullscreen failed, using Pseudo mode");
      setIsPseudoFullscreen(true);
      try {
        if (Capacitor.isNativePlatform()) await StatusBar.hide();
      } catch (e) {}
    }
  };

  const changePlaybackSpeed = (speed: number) => {
    if (!allowRewind || !player) return;
    try { player.setPlaybackRate(speed); setPlaybackSpeed(speed); setShowSpeedOptions(false); } catch (e) { }
  };

  const goToLive = async () => {
    if (!player || !isLiveStream || liveTimestamp <= 0) return;
    if (await safePlayerOperation(() => player.seekTo(liveTimestamp, true))) {
      setCurrentTime(liveTimestamp); setIsBehindLive(false);
    }
  };

  // --- Render ---
  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden flex flex-col items-center gap-4">

      {/* Verification Overlay */}
      {showVerification && !isFullscreen && enableConcentrationScore && (
        <div className="w-full mb-2 animate-in fade-in slide-in-from-top duration-300 z-50">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-lg overflow-hidden">
            <div className="p-3">
              <p className="text-xs text-neutral-600 mb-2">
                Click <span className="text-primary-500 font-bold">{verificationNumbers[1]}</span> within <span className="text-primary-500 font-bold">{verificationCountdown}</span>s.
              </p>
              <div className="flex justify-center space-x-2">
                {verificationNumbers.map((num, idx) => (
                  <button key={idx} onClick={() => handleVerificationClick(idx)} className="px-2 py-1 rounded-lg text-xs font-medium bg-white border hover:bg-gray-50">{num}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        ref={playerContainerRef}
        className={`
          transition-all duration-300 ease-in-out
          ${isPseudoFullscreen 
            ? "fixed inset-0 z-[99999] w-screen h-screen bg-black flex items-center justify-center" 
            : "relative aspect-video w-full max-w-[100vw] rounded-lg isolate bg-black relative"
          }
        `}
        // 🔥 IMPROVED INTERACTION HANDLERS
        onClick={handleContainerClick}
        onTouchStart={handleInteraction} // For instant mobile response
        onMouseMove={handleInteraction}  // For desktop mouse movement
        onDoubleClick={handleDoubleClick}
      >
        {/* VIDEO LAYER */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden bg-black">
          {isIOS() ? (
            <iframe
              ref={iosIframeRef}
              src={`${BRIDGE_URL}?videoId=${videoId}`}
              className="w-full h-full border-0 scale-[1.35] origin-center"
              scrolling="no"
              allow="autoplay; encrypted-media; fullscreen"
              referrerPolicy="origin"
            />
          ) : (
            <div className="w-full h-full scale-[1.35] origin-center">
              <YouTube
                videoId={videoId}
                opts={{
                  height: "100%", width: "100%",
                  playerVars: {
                    autoplay: allowPlayPause ? 0 : 1, playsinline: 1, enablejsapi: 1, modestbranding: 1, rel: 0,
                    controls: 0, fs: 0, disablekb: 1, widget_referrer: typeof window !== 'undefined' ? window.location.origin : '',
                  },
                }}
                onReady={onPlayerReady}
                className="h-full w-full"
                onStateChange={onStateChange}
              />
            </div>
          )}
        </div>

        {/* CONTROLS OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none z-10 transition-opacity duration-300" style={{ opacity: showControls || !isPlayed ? 1 : 0 }} />

        {/* BIG PLAY BUTTON */}
        {!isPlayed && !showVerification && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="bg-black/40 backdrop-blur-sm p-4 rounded-full border border-white/20 animate-in fade-in zoom-in duration-200">
              <Play size={32} weight="fill" className="text-white" />
            </div>
          </div>
        )}

        {/* SEEK ANIMATION */}
        {showSeekAnimation.show && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className={`flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 text-white ${showSeekAnimation.side === "right" ? "flex-row" : "flex-row-reverse"}`}>
              <div className="flex gap-1">
                <FastForward size={20} weight="fill" className={showSeekAnimation.side === "right" ? "" : "rotate-180"} />
                <FastForward size={20} weight="fill" className={showSeekAnimation.side === "right" ? "" : "rotate-180"} />
              </div>
              <span className="text-sm font-medium">10s</span>
            </div>
          </div>
        )}

        {/* QUESTION MODAL */}
        {showQuestion && (
          <div className="absolute inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <VideoQuestionOverlay
              question={currentQuestion}
              onSubmit={handleQuestionSubmit}
              onClose={handleQuestionClose}
              onPause={forcePause}
              previousAnswer={currentQuestion ? answeredQuestions[currentQuestion.id]?.selectedOptions : undefined}
            />
          </div>
        )}

        {/* CONTROL BAR */}
        <div 
          className={`control-bar absolute bottom-2 left-0 right-0 z-[100] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] transition-all duration-300 pointer-events-auto ${
            showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          {/* Background Gradient for visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-[-1] pointer-events-none h-[150%]" />
          
          <div className="flex flex-col gap-2 relative z-10">
            {/* Progress Bar */}
            <div className="relative w-full h-1 bg-white/30 rounded-full cursor-pointer hover:h-1.5 transition-all group/progress" onClick={handleProgressBarClick}>
              <div className="h-full bg-primary-500 rounded-full relative" style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover/progress:scale-100 transition-transform shadow-sm" />
              </div>
              {timeToQuestionMap.map(({ time, question }) => (
                <div key={question.id} className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-black/20 bg-yellow-500" style={{ left: `${(time / 1000 / duration) * 100}%` }} onClick={(e) => { e.stopPropagation(); handleQuestionMarkerClick(question) }} />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-4">
                <button onClick={(e) => { e.stopPropagation(); isPlayed ? togglePause() : togglePlay(); }} className="text-white hover:text-primary-400">
                  {isPlayed ? <Pause size={24} weight="fill" /> : <Play size={24} weight="fill" />}
                </button>
                {allowRewind && (
                  <button onClick={(e) => { e.stopPropagation(); seekToTimestamp(currentTime - 10); }} className="text-white hover:text-primary-400 transition-colors">
                    <Rewind size={24} weight="fill" />
                  </button>
                )}
                <span className="text-xs text-white/90 font-mono">{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <button onClick={(e) => { e.stopPropagation(); if (allowRewind) setShowSpeedOptions(!showSpeedOptions); }} className="text-white hover:text-primary-400 flex items-center gap-1">
                    <Gauge size={20} weight="fill" /><span className="text-xs font-bold">{playbackSpeed}x</span>
                  </button>
                  {showSpeedOptions && (
                    <div className="speed-menu absolute bottom-full right-0 mb-2 bg-black/90 border border-white/10 rounded-lg overflow-hidden flex flex-col min-w-[80px] max-h-40 overflow-y-auto z-50">
                      {speedOptions.map(speed => (
                        <button key={speed} onClick={(e) => { e.stopPropagation(); changePlaybackSpeed(speed); }} className={`px-3 py-2 text-xs text-left w-full hover:bg-white/20 ${playbackSpeed === speed ? "text-primary-400 font-bold" : "text-white"}`}>{speed}x</button>
                      ))}
                    </div>
                  )}
                </div>
                {isLiveStream && isBehindLive && (<button onClick={goToLive} className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium"><div className="w-2 h-2 bg-white rounded-full"></div>LIVE</button>)}
                
                {/* Fullscreen Button */}
                <button onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }} className="text-white hover:text-primary-400">
                  {isFullscreen || isPseudoFullscreen ? <ArrowsIn size={20} weight="fill" /> : <ArrowsOut size={20} weight="fill" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

YouTubePlayerComp.displayName = "YouTubePlayerComp";

// --- WRAPPER COMPONENT ---
const YouTubePlayerWrapper = forwardRef<any, YouTubePlayerProps>(
  (props, ref) => {
    const internalRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      playVideo: () => internalRef.current?.playVideo(),
      pauseVideo: () => internalRef.current?.pauseVideo(),
      getCurrentTime: () => internalRef.current?.getCurrentTime(),
      getDuration: () => internalRef.current?.getDuration(),
      seekTo: (seconds: number, allowSeekAhead: boolean) =>
        internalRef.current?.seekTo(seconds, allowSeekAhead),
    }));

    return <YouTubePlayerComp {...props} ref={internalRef} />;
  }
);

YouTubePlayerWrapper.displayName = "YouTubePlayerWrapper";

export default YouTubePlayerWrapper;