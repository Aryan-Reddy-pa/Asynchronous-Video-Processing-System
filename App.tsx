import React, { useEffect, useState, useCallback } from 'react';
import { VideoFile, ProcessingTask } from './types';
import * as api from './services/mockBackend';
import VideoUploader from './components/VideoUploader';
import TaskList from './components/TaskList';
import DashboardStats from './components/DashboardStats';
import { Activity, Server, Trash2 } from 'lucide-react';

function App() {
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [tasks, setTasks] = useState<ProcessingTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Poll for updates every 1 second to simulate real-time socket/polling
  // This satisfies "The frontend must reflect backend state over time"
  const fetchData = useCallback(async () => {
    try {
      const data = await api.fetchDashboardData();
      // Sort videos by upload time descending
      setVideos(data.videos.sort((a, b) => b.uploadTimestamp - a.uploadTimestamp));
      setTasks(data.tasks);
    } catch (e) {
      console.error("Failed to fetch dashboard data", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 1000); // Polling loop
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleReset = async () => {
    if(window.confirm("Are you sure you want to clear all data?")) {
        await api.clearAllData();
        fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">AsyncVideoPro</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                <Server className="w-3 h-3" />
                <span>Worker Status: </span>
                <span className="text-green-600 font-medium animate-pulse">Active</span>
             </div>
             <button onClick={handleReset} className="text-gray-400 hover:text-red-500 transition-colors" title="Clear All Data">
                <Trash2 className="w-4 h-4" />
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro / Instructions */}
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-gray-500 mt-1">Upload videos and track asynchronous transcoding tasks.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Upload & Video List */}
            <div className="lg:col-span-2 space-y-8">
                <VideoUploader onUploadComplete={fetchData} />

                {/* Video List */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        Recent Uploads
                        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">{videos.length}</span>
                    </h3>
                    
                    {loading ? (
                        <div className="text-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="mt-2 text-sm text-gray-500">Connecting to system...</p>
                        </div>
                    ) : videos.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 border-dashed p-10 text-center">
                            <p className="text-gray-400">No videos uploaded yet.</p>
                        </div>
                    ) : (
                        videos.map(video => {
                            const videoTasks = tasks.filter(t => t.videoId === video.id);
                            return (
                                <div key={video.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 truncate">{video.filename}</h4>
                                            <div className="text-xs text-gray-500 mt-0.5 flex gap-3">
                                                <span>{(video.sizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
                                                <span>&bull;</span>
                                                <span>{new Date(video.uploadTimestamp).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm">
                                            ID: {video.id.slice(0, 8)}...
                                        </div>
                                    </div>
                                    <TaskList tasks={videoTasks} onRetry={fetchData} />
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Right Column: Stats & Info */}
            <div className="space-y-6">
                <DashboardStats tasks={tasks} />
                
                <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl">
                    <h4 className="text-indigo-900 font-semibold mb-2 text-sm">Architecture Note</h4>
                    <p className="text-xs text-indigo-800 leading-relaxed mb-2">
                        This demo runs entirely in your browser. 
                    </p>
                    <ul className="list-disc list-inside text-xs text-indigo-700 space-y-1">
                        <li><strong>Frontend:</strong> React + Tailwind</li>
                        <li><strong>Backend Simulation:</strong> A mock service intercepts requests and uses <code>localStorage</code> for persistence.</li>
                        <li><strong>Async Worker:</strong> A background loop runs on every poll tick to update task progress, simulating codec latency.</li>
                    </ul>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}

export default App;