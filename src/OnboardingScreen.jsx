import { useState, useEffect } from 'react';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaPinterest,
  FaYoutube,
  FaTiktok,
  FaSnapchatGhost,
  FaDiscord,
  FaReddit
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const OnboardingScreen = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // Social media icons data with random positions
  const socialIcons = [
    { icon: <FaFacebook className="text-blue-600" />, size: 24 },
    { icon: <FaTwitter className="text-blue-400" />, size: 22 },
    { icon: <FaInstagram className="text-pink-600" />, size: 26 },
    { icon: <FaLinkedin className="text-blue-700" />, size: 24 },
    { icon: <FaPinterest className="text-red-600" />, size: 22 },
    { icon: <FaYoutube className="text-red-600" />, size: 28 },
    { icon: <FaTiktok className="text-black" />, size: 20 },
    { icon: <FaSnapchatGhost className="text-yellow-400" />, size: 24 },
    { icon: <FaDiscord className="text-indigo-600" />, size: 26 },
    { icon: <FaReddit className="text-orange-600" />, size: 24 }
  ];

  // Random positions for social icons
  const getRandomPosition = () => ({
    top: `${Math.random() * 80 + 10}%`,
    left: `${Math.random() * 80 + 10}%`,
    rotate: Math.random() * 60 - 30
  });

  const steps = [
    {
      title: "Welcome to Our Community",
      description: "Join thousands of users connecting through amazing events"
    },
    {
      title: "Discover Exciting Events",
      description: "Find everything from tech meetups to music festivals"
    },
    {
      title: "Connect With Friends",
      description: "See what events your friends are attending and join them"
    }
  ];

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => onComplete(), 500);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSkip();
    }
  };

  // Auto-advance every 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, rgba(255,105,180,0.9) 0%, rgba(255,20,147,0.9) 100%)'
      }}
    >
      {/* Floating Social Media Icons */}
      {socialIcons.map((social, index) => {
        const position = getRandomPosition();
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: index * 0.1, duration: 1 }}
            className="absolute opacity-30 hover:opacity-100 transition-opacity duration-300"
            style={{
              top: position.top,
              left: position.left,
              transform: `rotate(${position.rotate}deg)`
            }}
          >
            <div className={`text-${social.size}px`}>
              {social.icon}
            </div>
          </motion.div>
        );
      })}

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center text-center">
        {/* Company Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="mb-8"
        >
          <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-xl">
            <div className="text-4xl font-bold text-pink-600">Your Logo</div>
          </div>
        </motion.div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-4">
            {steps[currentStep].title}
          </h1>
          <p className="text-white/90 text-lg">
            {steps[currentStep].description}
          </p>
        </motion.div>

        {/* Progress Dots */}
        <div className="flex space-x-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentStep ? 'bg-white w-6' : 'bg-white/50'}`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex w-full space-x-4">
          <button
            onClick={handleSkip}
            className="flex-1 py-3 px-6 rounded-full bg-white/20 text-white font-medium hover:bg-white/30 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            className="flex-1 py-3 px-6 rounded-full bg-white text-pink-600 font-medium hover:bg-white/90 transition-colors"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <p className="text-white/70 text-sm">
          Already have an account? <span className="text-white font-medium cursor-pointer">Sign In</span>
        </p>
      </div>
    </motion.div>
  );
};

export default OnboardingScreen;