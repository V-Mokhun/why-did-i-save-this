import { useStorage } from "./use-storage";

const HAS_SEEN_ONBOARDING_KEY = "has_seen_onboarding";

export const useOnboarding = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useStorage<boolean>(
    HAS_SEEN_ONBOARDING_KEY,
    false
  );

  const markOnboardingAsSeen = () => {
    setHasSeenOnboarding(true);
  };

  return {
    hasSeenOnboarding,
    markOnboardingAsSeen,
  };
}; 
