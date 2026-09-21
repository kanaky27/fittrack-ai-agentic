import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import { Trash2, Plus, Activity } from 'lucide-react';

export default function ActivityLogs() {
    const { user, allActivityLogs, setAllActivityLogs } = useContext(AppContext);
    const [todaysLogs, setTodaysLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', duration: '', calories: '' });

    const todayDate = new Date().toISOString().split('T')[0];
    const calorieBurnGoal = user?.dailyCalorieBurn || 400;
    const caloriesBurned = todaysLogs.reduce((sum, item) => sum + Number(item.calories), 0);

    useEffect(() => {
        setTodaysLogs(allActivityLogs.filter(log => log.createdAt?.split('T')[0] === todayDate));
    }, [allActivityLogs, todayDate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.duration || !formData.calories) return;
        setLoading(true);
        try {
            const data = {
                ...formData,
                calories: Number(formData.calories),
                date: new Date().toISOString().split('T')[0],
                user: user?.id
            };
            const res = await api.post('/activities', { data }, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            setAllActivityLogs([res.data.data, ...allActivityLogs]);
            setFormData({ name: '', duration: '', calories: '' });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (documentId: string) => {
        try {
            await api.delete(`/activities/${documentId}`, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            setAllActivityLogs(allActivityLogs.filter(log => log.documentId !== documentId));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-6 h-6 text-emerald-500" />
                    Activity Logs
                </h1>
                <p className="text-slate-500 mt-1">Track your daily exercises and calories burned.</p>
            </div>

            <div className="page-content-grid">
                <div className="space-y-6">
                    <Card>
                        <h2 className="text-lg font-bold mb-4">Add Activity Entry</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Activity Name</label>
                                <input required type="text" className="login-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Running" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Duration (min)</label>
                                    <input required type="number" className="login-input" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="30" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Calories Burned</label>
                                    <input required type="number" className="login-input" value={formData.calories} onChange={e => setFormData({...formData, calories: e.target.value})} placeholder="kcal" />
                                </div>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full">
                                <Plus className="w-4 h-4" /> {loading ? 'Adding...' : 'Add Activity'}
                            </Button>
                        </form>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <h2 className="text-lg font-bold mb-4">Today's Summary</h2>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-500">Burned</span>
                            <span className="font-medium text-slate-900">{caloriesBurned} / {calorieBurnGoal} kcal</span>
                        </div>
                        <ProgressBar value={caloriesBurned} max={calorieBurnGoal} />
                    </Card>

                    <Card>
                        <h2 className="text-lg font-bold mb-4">Today's Logs</h2>
                        <div className="space-y-3">
                            {todaysLogs.length === 0 ? (
                                <p className="text-center py-6 text-slate-500 text-sm">No activity logged today.</p>
                            ) : (
                                todaysLogs.map(log => (
                                    <div key={log.documentId || log.id} className="activity-entry-item">
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-700 dark:text-slate-200 capitalize">{log.name}</p>
                                            <p className="text-xs text-slate-400">{log.duration} min</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{log.calories} kcal burned</span>
                                            <button onClick={() => handleDelete(log.documentId)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
