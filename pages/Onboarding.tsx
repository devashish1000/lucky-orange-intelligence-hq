
import React, { useState } from 'react';
import { useAuth } from '../App';
import { Sparkles, HeartPulse, Zap, ChevronRight, ChevronLeft, Loader2, X, Heart } from 'lucide-react';

const steps = [
  {
    icon: <Sparkles className="text-white" size={40} />,
    title: "HQ Terminal",
    description: "Your growth command center. Powered by Discovery AI to synthesize behavior into fiscal strategies."
  },
  {
    icon: <Heart className="text-white" size={40} />,
    title: "Pulse Monitoring",
    description: "Monitor churn signals in real-time. Sentinel identifies accounts with usage anomalies instantly."
  },
  {
    icon: <Zap className="text-white" size={40} />,
    title: "Deployment",
    description: "Initialize expansion campaigns and win-back sequences with a single tactical click."
  }
];

const Onboarding: React.FC = () => {
  const { completeOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);

  const handleNext = () => {
    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(10);
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsLaunching(true);
      setTimeout(completeOnboarding, 1500);
    }
  };

  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-[var(--ios-bg)] flex flex-col items-center justify-center p-10 text-center safe-top safe-bottom">
      <button 
        onClick={() => completeOnboarding()}
        className="fixed top-12 right-10 headline text-[#007AFF] tap-feedback"
      >Skip</button>

      <div key={currentStep} className="animate-in fade-in slide-in-from-right-12 duration-500 w-full flex flex-col items-center">
        <div className="w-20 h-20 bg-gradient-to-b from-[#FF9500] to-[#FF6B00] rounded-[20px] flex items-center justify-center mb-10 shadow-xl shadow-[#FF9500]/30 transition-all">
          {step.icon}
        </div>
        
        <div className="space-y-4 mb-16">
          <h1 className="title-large">{step.title}</h1>
          <p className="body-text text-[rgba(60,60,67,0.6)] px-4 leading-relaxed">{step.description}</p>
        </div>

        <div className="w-full max-w-[280px] space-y-10">
          <div className="flex justify-center gap-2">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-[#FF9500]' : 'w-1.5 bg-[rgba(120,120,128,0.2)]'}`}
              />
            ))}
          </div>

          <button 
            onClick={handleNext}
            disabled={isLaunching}
            className="w-full primary-button tap-feedback flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLaunching ? <Loader2 size={24} className="animate-spin" /> : currentStep === steps.length - 1 ? "Get Started" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
