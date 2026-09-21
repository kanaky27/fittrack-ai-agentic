import React, { useState, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import { Trash2, Plus, Camera, Loader2, Apple } from 'lucide-react';

export default function FoodLogs() {
    const { user, allFoodLogs, setAllFoodLogs } = useContext(AppContext);
    const [todaysLogs, setTodaysLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', calories: '', mealType: 'snack' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const todayDate = new Date().toISOString().split('T')[0];
    const calorieLimit = user?.dailyCalorieIntake || 2000;
    const caloriesConsumed = todaysLogs.reduce((sum, item) => sum + Number(item.calories), 0);

    useEffect(() => {
        setTodaysLogs(allFoodLogs.filter(log => log.createdAt?.split('T')[0] === todayDate));
    }, [allFoodLogs, todayDate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.calories) return;
        setLoading(true);
        try {
            const data = {
                ...formData,
                calories: Number(formData.calories),
                date: new Date().toISOString().split('T')[0],
                user: user?.id
            };
            const res = await api.post('/meals', { data }, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            setAllFoodLogs([res.data.data, ...allFoodLogs]);
            setFormData({ name: '', calories: '', mealType: 'snack' });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (documentId: string) => {
        try {
            await api.delete(`/meals/${documentId}`, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            setAllFoodLogs(allFoodLogs.filter(log => log.documentId !== documentId));
        } catch (error) {
            console.error(error);
        }
    };

    const compressImage = async (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    
                    // Compress to JPEG 70% quality
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(dataUrl.split(',')[1]);
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const startTime = Date.now();
        setAiLoading(true);
        try {
                        const base64Data = await compressImage(file);
            
                        const aiStartTime = Date.now();
            const res = await api.post('/analyze-food', { imageBase64: base64Data }, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            
            const parsed = res.data.data;
            if (!parsed || !parsed.name || parsed.calories === undefined) {
                throw new Error("Invalid response format from backend.");
            }

            setFormData({
                name: parsed.name,
                calories: parsed.calories.toString(),
                mealType: 'snack'
            });
            
        } catch (error: any) {
            console.error("Food analysis error:", error);
            alert("The AI service is temporarily unavailable. Please try again.");
        } finally {
            setAiLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Apple className="w-6 h-6 text-emerald-500" />
                    Food Logs
                </h1>
                <p className="text-slate-500 mt-1">Track your daily calorie intake and nutrition.</p>
            </div>

            <div className="page-content-grid">
                <div className="space-y-6">
                    <Card>
                        <h2 className="text-lg font-bold mb-4">Add Food Entry</h2>
                        
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={aiLoading}
                            className="w-full mb-4 p-4 border-2 border-dashed border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors"
                        >
                            {aiLoading ? <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" /> : <Camera className="w-6 h-6 text-emerald-600" />}
                            <span className="text-sm font-medium text-emerald-700">
                                {aiLoading ? 'Analyzing food with AI...' : 'Scan food with AI'}
                            </span>
                        </button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Food Name</label>
                                <input required type="text" className="login-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Avocado Toast" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Calories</label>
                                    <input required type="number" className="login-input" value={formData.calories} onChange={e => setFormData({...formData, calories: e.target.value})} placeholder="kcal" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Meal Type</label>
                                    <select className="login-input" value={formData.mealType} onChange={e => setFormData({...formData, mealType: e.target.value})}>
                                        <option value="breakfast">Breakfast</option>
                                        <option value="lunch">Lunch</option>
                                        <option value="dinner">Dinner</option>
                                        <option value="snack">Snack</option>
                                    </select>
                                </div>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full">
                                <Plus className="w-4 h-4" /> {loading ? 'Adding...' : 'Add Entry'}
                            </Button>
                        </form>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <h2 className="text-lg font-bold mb-4">Today's Summary</h2>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-500">Consumed</span>
                            <span className="font-medium text-slate-900">{caloriesConsumed} / {calorieLimit} kcal</span>
                        </div>
                        <ProgressBar value={caloriesConsumed} max={calorieLimit} />
                    </Card>

                    <Card>
                        <h2 className="text-lg font-bold mb-4">Today's Logs</h2>
                        <div className="space-y-3">
                            {todaysLogs.length === 0 ? (
                                <p className="text-center py-6 text-slate-500 text-sm">No food logged today.</p>
                            ) : (
                                todaysLogs.map(log => (
                                    <div key={log.documentId || log.id} className="food-entry-item">
                                        <div className="flex-1">
                                            <p className="font-medium text-slate-700 dark:text-slate-200 capitalize">{log.name}</p>
                                            <p className="text-xs text-slate-400 capitalize">{log.mealType || 'snack'}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{log.calories} kcal</span>
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
