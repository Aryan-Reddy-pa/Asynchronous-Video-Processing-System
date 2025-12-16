import React from 'react';
import { ProcessingTask, TaskStatus, ResolutionProfile, VideoContainer, PROFILE_DETAILS } from '../types';
import StatusBadge from './StatusBadge';
import { Download, RefreshCw, AlertTriangle } from 'lucide-react';
import { retryTask } from '../services/mockBackend';

interface TaskListProps {
  tasks: ProcessingTask[];
  onRetry: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onRetry }) => {
  const handleRetry = async (taskId: string) => {
    await retryTask(taskId);
    onRetry();
  };

  if (tasks.length === 0) {
    return <div className="text-gray-400 text-sm italic p-4">No tasks initiated for this video.</div>;
  }

  return (
    <div className="divide-y divide-gray-100">
      {tasks.map(task => (
        <div key={task.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
          
          {/* Info Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <span className="font-semibold text-gray-700 text-sm">
                {task.container} &middot; {task.profile}
              </span>
              <StatusBadge status={task.status} />
            </div>
            <div className="text-xs text-gray-500">
              Target: {PROFILE_DETAILS[task.profile]}
            </div>
            
            {/* Progress Bar for Processing */}
            {task.status === TaskStatus.PROCESSING && (
              <div className="mt-2 max-w-xs">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-blue-600 mt-1 font-medium">{task.progress}% Complete</p>
              </div>
            )}

            {/* Error Message */}
            {task.status === TaskStatus.FAILED && task.error && (
              <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Error: {task.error}
              </div>
            )}
          </div>

          {/* Action Section */}
          <div className="flex items-center gap-3 ml-4">
             {task.status === TaskStatus.COMPLETED && (
               <a 
                 href={task.outputUrl} 
                 target="_blank" 
                 rel="noreferrer"
                 className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 px-3 py-1.5 rounded-md transition-colors"
               >
                 <Download className="w-3.5 h-3.5" />
                 Download
               </a>
             )}

             {task.status === TaskStatus.FAILED && (
               <button
                 onClick={() => handleRetry(task.id)}
                 className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-400 px-3 py-1.5 rounded-md transition-colors"
               >
                 <RefreshCw className="w-3.5 h-3.5" />
                 Retry
               </button>
             )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;