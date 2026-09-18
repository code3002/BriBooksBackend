import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface WizardProgressProps {
    currentStep: number;
    totalSteps: number;
}

const steps = [
    { number: 1, label: 'Genre' },
    { number: 2, label: 'Theme' },
    { number: 3, label: 'Details' },
];

export const WizardProgress: React.FC<WizardProgressProps> = ({ currentStep, totalSteps }) => {
    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

    return (
        <div className="max-w-2xl mx-auto px-6 pt-8 pb-4">
            <div className="flex items-center justify-between relative">
                {/* Progress Line Background */}
                <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 rounded-full" />

                {/* Progress Line Fill */}
                <motion.div
                    className="absolute top-5 left-0 h-1 bg-primary rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                />

                {/* Step Indicators */}
                {steps.map((step) => (
                    <div key={step.number} className="relative z-10 flex flex-col items-center gap-2">
                        <motion.div
                            initial={false}
                            animate={{
                                scale: currentStep === step.number ? 1.1 : 1,
                            }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${currentStep >= step.number
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'bg-white text-slate-400 border-2 border-slate-200'
                                }`}
                        >
                            {currentStep > step.number ? (
                                <Check className="h-5 w-5" />
                            ) : (
                                step.number
                            )}
                        </motion.div>
                        <span
                            className={`text-xs font-medium ${currentStep >= step.number ? 'text-slate-900' : 'text-slate-500'
                                }`}
                        >
                            {step.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
