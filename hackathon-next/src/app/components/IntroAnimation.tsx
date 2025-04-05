'use client';

import { useState, useEffect } from 'react';
import styles from '../intro-animation.module.scss';

interface AnimationStep {
  text: string;
  className: string;
}

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Animation steps with their text and class styles
  const steps: AnimationStep[] = [
    { text: "来たる", className: styles.comesForth },
    { text: "2025 Hackathon", className: styles.hackathonTitle },
    { text: "３ヶ月で世界を変える最小のプロダクト", className: styles.changeWorld },
    { text: "新しい打ち手を止めるな", className: styles.dontStop },
  ];

  
  // Handle animation sequence
  useEffect(() => {
    if (isCompleted) return;
    
    if (currentStep >= steps.length) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setIsCompleted(true);
        onComplete();
      }, 1500); // Wait for exit animation
      
      return () => clearTimeout(timer);
    }
    
    // Auto advance to next step
    const timer = setTimeout(() => {
      setIsExiting(true);
      
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsExiting(false);
      }, 1000); // Transition time between steps
      
    }, 2800); // Display each step for 2.8 seconds
    
    return () => clearTimeout(timer);
  }, [currentStep, steps.length, isCompleted, onComplete]);
  
  // Handle skip animation
  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsCompleted(true);
      onComplete();
    }, 800);
  };
  
  if (isCompleted) return null;
  
  return (
    <div className={styles.introContainer}>
      {/* Background effects - always visible */}
      <div className={styles.bgOverlay}></div>
      <div className={styles.particles}></div>
      <div className={styles.rays}></div>
      
      {/* Current text animation */}
      <div className={styles.textWrapper}>
        {currentStep < steps.length && (
          <div 
            key={currentStep}
            className={`${styles.textContainer} ${steps[currentStep].className} ${isExiting ? styles.textExit : styles.textEnter}`}
          >
            <h1 className={styles.noiseText} data-text={steps[currentStep].text}>
              {steps[currentStep].text}
            </h1>
          </div>
        )}
      </div>
      
     
    </div>
  );
};

export default IntroAnimation; 