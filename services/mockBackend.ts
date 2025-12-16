import { ProcessingTask, TaskStatus, VideoFile, VideoContainer, ResolutionProfile } from '../types';

/**
 * MOCK BACKEND SERVICE
 * 
 * This service simulates:
 * 1. A Database (using localStorage)
 * 2. An Async Worker (updating task progress over time)
 * 3. Network Latency (using setTimeout in Promises)
 */

const STORAGE_KEY_VIDEOS = 'avp_videos';
const STORAGE_KEY_TASKS = 'avp_tasks';

// Helpers for LocalStorage
const getStoredVideos = (): VideoFile[] => {
  const stored = localStorage.getItem(STORAGE_KEY_VIDEOS);
  return stored ? JSON.parse(stored) : [];
};

const getStoredTasks = (): ProcessingTask[] => {
  const stored = localStorage.getItem(STORAGE_KEY_TASKS);
  return stored ? JSON.parse(stored) : [];
};

const saveVideos = (videos: VideoFile[]) => localStorage.setItem(STORAGE_KEY_VIDEOS, JSON.stringify(videos));
const saveTasks = (tasks: ProcessingTask[]) => localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));

// --- "Worker" Logic (The magic that makes it async) ---
// This function updates the state of tasks based on time to simulate processing.
// In a real app, this runs on a server. Here, we run it on read to simulate state progression.
const processBackgroundTasks = () => {
  const tasks = getStoredTasks();
  const now = Date.now();
  let changed = false;

  const updatedTasks = tasks.map(task => {
    // 1. Transition QUEUED -> PROCESSING
    if (task.status === TaskStatus.QUEUED) {
      // Simulate 2 seconds queue time
      if (now - task.createdAt > 2000) {
        changed = true;
        return { ...task, status: TaskStatus.PROCESSING, startedAt: now, progress: 0 };
      }
    }

    // 2. Update PROCESSING progress
    if (task.status === TaskStatus.PROCESSING && task.startedAt) {
      const elapsed = now - task.startedAt;
      
      // Different speeds for different profiles to show independence
      const durationMap = {
        [ResolutionProfile.P1_480p]: 5000,  // 5 seconds
        [ResolutionProfile.P2_720p]: 8000,  // 8 seconds
        [ResolutionProfile.P3_1080p]: 12000 // 12 seconds
      };
      
      const targetDuration = durationMap[task.profile] || 5000;
      const calculatedProgress = Math.min(100, Math.floor((elapsed / targetDuration) * 100));

      // Simulate a random failure for demonstration purposes (approx 5% chance if not already failed)
      // Only fail if we are halfway through to show "partial work" loss
      if (calculatedProgress > 50 && calculatedProgress < 60 && Math.random() < 0.005) {
         changed = true;
         return { 
           ...task, 
           status: TaskStatus.FAILED, 
           error: 'Transcoding engine crashed: Out of memory', 
           completedAt: now 
         };
      }

      if (calculatedProgress >= 100) {
        changed = true;
        return {
          ...task,
          status: TaskStatus.COMPLETED,
          progress: 100,
          completedAt: now,
          outputUrl: `https://picsum.photos/seed/${task.id}/800/600` // Mock output
        };
      } else if (calculatedProgress !== task.progress) {
        changed = true;
        return { ...task, progress: calculatedProgress };
      }
    }

    return task;
  });

  if (changed) {
    saveTasks(updatedTasks);
  }
};

// --- Public API Methods ---

export const uploadVideoFile = async (file: File): Promise<VideoFile> => {
  // Simulate upload network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  const newVideo: VideoFile = {
    id: crypto.randomUUID(),
    filename: file.name,
    sizeBytes: file.size,
    uploadTimestamp: Date.now(),
  };

  const videos = getStoredVideos();
  saveVideos([newVideo, ...videos]);
  return newVideo;
};

export const createProcessingTask = async (
  videoId: string, 
  container: VideoContainer, 
  profile: ResolutionProfile
): Promise<ProcessingTask> => {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 300));

  const newTask: ProcessingTask = {
    id: crypto.randomUUID(),
    videoId,
    container,
    profile,
    status: TaskStatus.QUEUED, // Initial State
    progress: 0,
    createdAt: Date.now(),
  };

  const tasks = getStoredTasks();
  saveTasks([...tasks, newTask]);
  return newTask;
};

export const fetchDashboardData = async (): Promise<{ videos: VideoFile[], tasks: ProcessingTask[] }> => {
  // "Tick" the worker every time we fetch to update state
  processBackgroundTasks();
  
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 200));

  return {
    videos: getStoredVideos(),
    tasks: getStoredTasks(),
  };
};

export const retryTask = async (taskId: string): Promise<void> => {
    const tasks = getStoredTasks();
    const updatedTasks = tasks.map(t => {
        if (t.id === taskId) {
            return {
                ...t,
                status: TaskStatus.QUEUED,
                progress: 0,
                createdAt: Date.now(), // Reset clock
                startedAt: undefined,
                error: undefined
            };
        }
        return t;
    });
    saveTasks(updatedTasks);
    await new Promise(resolve => setTimeout(resolve, 200));
};

export const clearAllData = async () => {
    localStorage.removeItem(STORAGE_KEY_VIDEOS);
    localStorage.removeItem(STORAGE_KEY_TASKS);
    await new Promise(resolve => setTimeout(resolve, 500));
}