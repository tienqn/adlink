import { createContext, useState } from 'react';
import { getAccessTokenFromLS, getProfileFromLS } from '@/services/auth.service.ts';

// interface AppContextInterface {
//   isAuthenticated: boolean;
//   setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
//   profile: User | null;
//   setProfile: React.Dispatch<React.SetStateAction<User | null>>;

//   reset: () => void;
// }

export const getInitialAppContext: () => () => ({
  isAuthenticated: Boolean(getAccessTokenFromLS()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLS(),
  setProfile: () => null,
  reset: () => null,
});

const initialAppContext = getInitialAppContext();

export const AppContext = createContext(initialAppContext);

export const AppProvider = ({
  children,
  defaultValue = initialAppContext,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(defaultValue.isAuthenticated);
  const [profile, setProfile] = useState(defaultValue.profile);

  const reset = () => {
    setIsAuthenticated(false);
    setProfile(null);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
