import React from 'react';

interface WizardProgressProps { currentStep: number; totalSteps: number }
const labels = ['Story type', 'Book theme', 'Details'];

export const WizardProgress: React.FC<WizardProgressProps> = ({ currentStep, totalSteps }) => (
  <div className="border-b border-[var(--color-rule)] bg-[var(--color-paper-2)]">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-2 px-5 py-5 sm:px-8">
      <span className="story-label mr-auto text-primary">Create your book</span>
      <ol className="flex items-center gap-2 sm:gap-5" aria-label="Book creation progress">
        {labels.slice(0, totalSteps).map((label, index) => <li key={label} className={`flex items-center gap-2 text-xs font-semibold sm:text-sm ${currentStep === index + 1 ? 'text-primary' : 'text-slate-500'}`} aria-current={currentStep === index + 1 ? 'step' : undefined}><span className={`flex h-7 w-7 items-center justify-center rounded-full border ${currentStep >= index + 1 ? 'border-primary bg-primary text-[var(--color-paper)]' : 'border-[var(--color-rule)]'}`}>{index + 1}</span><span className="hidden whitespace-nowrap sm:inline">{label}</span></li>)}
      </ol>
    </div>
  </div>
);
