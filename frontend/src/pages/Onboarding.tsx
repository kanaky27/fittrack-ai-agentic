import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import api from '../api';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function Onboarding() {
    const { user, fetchUser, setOnboardingCompleted } = useContext(AppContext);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        age: 25,
        weight: 70,
        height: 175,
        goal: 'maintain',
        dailyCalorieIntake: 2000,
        dailyCalorieBurn: 400
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleComplete = async () => {
        setLoading(true);
        try {
            await api.put(`/users/${user?.id}`, formData, {
                headers: { Authorization: `Bearer ${user?.token}` }
            });
            await fetchUser(user?.token!);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="onboarding-container p-6 flex items-center justify-center">
            <div className="onboarding-wrapper">
                <Card className="max-w-xl mx-auto">
                    <h2 className="text-2xl font-bold mb-2">Welcome to FitTrack AI</h2>
                    <p className="text-slate-500 mb-6">Let's set up your profile to personalize your experience.</p>
                    
                    {step === 1 && (
                        <div className="space-y-4">
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
                            <Button onClick={() => setStep(2)} className="w-full">Next Step</Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">What is your primary goal?</label>
                                <div className="space-y-2">
                                    {['lose', 'maintain', 'gain'].map(g => (
                                        <div 
                                            key={g} 
                                            onClick={() => setFormData({...formData, goal: g})}
                                            className={`onboarding-option-btn ${formData.goal === g ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : ''}`}
                                        >
                                            <span className="capitalize">{g} Weight</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">Back</Button>
                                <Button onClick={() => setStep(3)} className="flex-1">Next</Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Daily Calorie Target (kcal)</label>
                                <input type="number" name="dailyCalorieIntake" value={formData.dailyCalorieIntake} onChange={handleChange} className="login-input" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Daily Activity Goal (kcal)</label>
                                <input type="number" name="dailyCalorieBurn" value={formData.dailyCalorieBurn} onChange={handleChange} className="login-input" />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">Back</Button>
                                <Button onClick={handleComplete} disabled={loading} className="flex-1">
                                    {loading ? 'Saving...' : 'Complete Profile'}
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </main>
    );
}
