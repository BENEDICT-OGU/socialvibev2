// src/components/OnboardingWrapper.jsx
import { useState, useEffect } from 'react';
import OnboardingScreen from './OnboardingScreen';

const OnboardingWrapper = ({ children }) => {
  const [showOnboarding, setShowOnboarding] = useState(null);

  useEffect(() => {
    // Check if onboarding has been completed
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    // Check if user is logged in (replace with your auth logic)
    const isLoggedIn = localStorage.getItem('authToken'); // or your auth state
    
    // Only show onboarding if:
    // 1. User isn't logged in AND
    // 2. Onboarding hasn't been completed
    setShowOnboarding(!isLoggedIn && !onboardingCompleted);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    setShowOnboarding(false);
  };

  if (showOnboarding === null) {
    // Still checking auth state
    return null; // or a loading spinner
  }

  return (
    <>
      {showOnboarding ? (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      ) : (
        children
      )}
    </>
  );
};

export default OnboardingWrapper;