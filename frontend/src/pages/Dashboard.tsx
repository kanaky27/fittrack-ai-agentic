import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import { Flame, Activity, Target } from 'lucide-react';

export default function Dashboard() {
  const { user, allFoodLogs, allActivityLogs } = useContext(AppContext);

  const todayDate = new Date().toISOString().split('T')[0];
  const todaysFood = allFoodLogs.filter(log => log.createdAt?.split('T')[0] === todayDate);
  const todaysActivity = allActivityLogs.filter(log => log.createdAt?.split('T')[0] === todayDate);

  const caloriesConsumed = todaysFood.reduce((acc, curr) => acc + Number(curr.calories), 0);
  const calorieLimit = user?.dailyCalorieIntake || 2000;
  const calorieRemaining = calorieLimit - caloriesConsumed;

  const caloriesBurned = todaysActivity.reduce((acc, curr) => acc + Number(curr.calories), 0);
  const calorieBurnGoal = user?.dailyCalorieBurn || 400;
  
  const activeMinutes = todaysActivity.reduce((acc, curr) => acc + Number(curr.duration), 0);

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <p className="text-emerald-100 text-sm font-medium">Welcome back</p>
        <h1 className="text-2xl font-bold mt-1">Hi there! 👋 {user?.username}</h1>
        
        <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💡</span>
            <p className="text-white font-medium">Keep up the good work!</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <Card className="shadow-lg col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Calories Consumed</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{caloriesConsumed}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">Limit</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{calorieLimit}</p>
            </div>
          </div>
          
          <ProgressBar value={caloriesConsumed} max={calorieLimit} />
          
          <div className="mt-4 flex justify-between items-center">
            <div className={`px-3 py-1.5 rounded-lg ${calorieRemaining >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
              <span className="text-sm font-medium">
                {calorieRemaining >= 0 ? `${calorieRemaining} kcal remaining` : `${Math.abs(calorieRemaining)} kcal over`}
              </span>
            </div>
            <span className="text-sm text-slate-400">{Math.round((caloriesConsumed / calorieLimit) * 100)}%</span>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 my-4" />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Calories Burned</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{caloriesBurned}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">Goal</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{calorieBurnGoal}</p>
            </div>
          </div>
          
          <ProgressBar value={caloriesBurned} max={calorieBurnGoal} />
        </Card>

        <div className="dashboard-card-grid">
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-sm text-slate-500">Active</p>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{activeMinutes}</p>
            <p className="text-sm text-slate-400">minutes today</p>
          </Card>
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-sm text-slate-500">Goal</p>
            </div>
            <p className="text-2xl font-bold text-slate-800 dark:text-white capitalize">{user?.goal || 'maintain'} Weight</p>
            <p className="text-sm text-slate-400">current target</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
