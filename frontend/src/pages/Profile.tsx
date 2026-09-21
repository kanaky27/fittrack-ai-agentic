import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../api';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { User, Weight, Ruler, Target, Flame, Activity } from 'lucide-react';

export default function Profile() {
    const { user, fetchUser } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        age: user?.age || 25,
        weight: user?.weight || 70,
        height: user?.height || 175,
        goal: user?.goal || 'maintain',
        dailyCalorieIntake: user?.dailyCalorieIntake || 2000,
        dailyCalorieBurn: user?.dailyCalorieBurn || 400
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/users/${user?.id}`, formData, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            await fetchUser(user?.token!);
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="w-6 h-6 text-emerald-500" />
                    Profile
                </h1>
                <p className="text-slate-500 mt-1">Manage your personal information and goals.</p>
            </div>

            <div className="profile-content">
                <Card>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Personal Info</h2>
                        <Button variant="secondary" onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? 'Cancel' : 'Edit'}
                        </Button>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Age</label>
                                <input type="number" name="age" value={formData.age} onChange={handleChange} className="login-input" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                                <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="login-input" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Height (cm)</label>
                                <input type="number" name="height" value={formData.height} onChange={handleChange} className="login-input" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Goal</label>
                                <select name="goal" value={formData.goal} onChange={handleChange} className="login-input">
                                    <option value="lose">Lose Weight</option>
                                    <option value="maintain">Maintain Weight</option>
                                    <option value="gain">Gain Weight</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Daily Calorie Intake (kcal)</label>
                                <input type="number" name="dailyCalorieIntake" value={formData.dailyCalorieIntake} onChange={handleChange} className="login-input" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Daily Activity Goal (kcal)</label>
                                <input type="number" name="dailyCalorieBurn" value={formData.dailyCalorieBurn} onChange={handleChange} className="login-input" />
                            </div>
                            <Button type="submit" disabled={loading} className="w-full mt-4">
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="profile-info-row">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><User size={20}/></div>
                                <div><p className="text-sm text-slate-500">Username</p><p className="font-medium">{user?.username}</p></div>
                            </div>
                            <div className="profile-info-row">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><User size={20}/></div>
                                <div><p className="text-sm text-slate-500">Age</p><p className="font-medium">{user?.age} years</p></div>
                            </div>
                            <div className="profile-info-row">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500"><Activity size={20}/></div>
                                <div><p className="text-sm text-slate-500">Weight</p><p className="font-medium">{user?.weight} kg</p></div>
                            </div>
                            <div className="profile-info-row">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500"><Ruler size={20}/></div>
                                <div><p className="text-sm text-slate-500">Height</p><p className="font-medium">{user?.height} cm</p></div>
                            </div>
                            <div className="profile-info-row">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-500"><Target size={20}/></div>
                                <div><p className="text-sm text-slate-500">Goal</p><p className="font-medium capitalize">{user?.goal} Weight</p></div>
                            </div>
                            <div className="profile-info-row">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500"><Flame size={20}/></div>
                                <div><p className="text-sm text-slate-500">Daily Intake Target</p><p className="font-medium">{user?.dailyCalorieIntake} kcal</p></div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
