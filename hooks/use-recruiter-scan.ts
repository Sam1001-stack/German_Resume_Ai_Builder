"use client";

import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { getSocketServerUrl } from "@/lib/socket";

export interface ScanProgressState {
  status: string;
  total: number;
  processed: number;
  failed: number;
  message?: string;
  currentFile?: string;
}

export function useRecruiterScan(jobId: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const [progress, setProgress] = useState<ScanProgressState | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const socket = io(getSocketServerUrl(), {
      path: "/socket.io",
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.emit("join-job", jobId);

    socket.on("scan:progress", (payload: ScanProgressState) => {
      setProgress(payload);
      setIsComplete(false);
      setError(null);
    });

    socket.on("scan:complete", () => {
      setIsComplete(true);
      setProgress((p) => (p ? { ...p, status: "completed" } : null));
    });

    socket.on("scan:error", (payload: { message: string }) => {
      setError(payload.message);
    });

    return () => {
      socket.emit("leave-job", jobId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [jobId]);

  const reset = () => {
    setProgress(null);
    setIsComplete(false);
    setError(null);
  };

  return { progress, isComplete, error, reset };
}
