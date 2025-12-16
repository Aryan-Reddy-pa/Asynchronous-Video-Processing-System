import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ProcessingTask, TaskStatus } from '../types';

interface DashboardStatsProps {
  tasks: ProcessingTask[];
}

const COLORS = {
  [TaskStatus.QUEUED]: '#FCD34D',    // Yellow-300
  [TaskStatus.PROCESSING]: '#60A5FA', // Blue-400
  [TaskStatus.COMPLETED]: '#34D399',  // Green-400
  [TaskStatus.FAILED]: '#F87171'      // Red-400
};

const DashboardStats: React.FC<DashboardStatsProps> = ({ tasks }) => {
  const data = [
    { name: 'Queued', value: tasks.filter(t => t.status === TaskStatus.QUEUED).length, color: COLORS[TaskStatus.QUEUED] },
    { name: 'Processing', value: tasks.filter(t => t.status === TaskStatus.PROCESSING).length, color: COLORS[TaskStatus.PROCESSING] },
    { name: 'Completed', value: tasks.filter(t => t.status === TaskStatus.COMPLETED).length, color: COLORS[TaskStatus.COMPLETED] },
    { name: 'Failed', value: tasks.filter(t => t.status === TaskStatus.FAILED).length, color: COLORS[TaskStatus.FAILED] },
  ].filter(item => item.value > 0);

  if (tasks.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full">
      <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-4">System Status</h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-center text-xs text-gray-400">
        Total Tasks: <span className="font-bold text-gray-700">{tasks.length}</span>
      </div>
    </div>
  );
};

export default DashboardStats;