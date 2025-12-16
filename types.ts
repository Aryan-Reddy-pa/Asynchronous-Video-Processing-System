export enum TaskStatus {
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum VideoContainer {
  MP4 = 'MP4',
  WEBM = 'WebM',
}

export enum ResolutionProfile {
  P1_480p = '480p',
  P2_720p = '720p',
  P3_1080p = '1080p',
}

export interface VideoFile {
  id: string;
  filename: string;
  sizeBytes: number;
  uploadTimestamp: number;
}

export interface ProcessingTask {
  id: string;
  videoId: string;
  container: VideoContainer;
  profile: ResolutionProfile;
  status: TaskStatus;
  progress: number; // 0 to 100
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  error?: string;
  outputUrl?: string;
}

// Helper to display resolution details
export const PROFILE_DETAILS: Record<ResolutionProfile, string> = {
  [ResolutionProfile.P1_480p]: '480p (~1 Mbps)',
  [ResolutionProfile.P2_720p]: '720p (~2.5 Mbps)',
  [ResolutionProfile.P3_1080p]: '1080p (~5 Mbps)',
};

export const CONTAINER_DETAILS: Record<VideoContainer, string> = {
  [VideoContainer.MP4]: 'H.264 / AAC',
  [VideoContainer.WEBM]: 'VP9 / Opus',
};