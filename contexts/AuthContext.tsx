"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

type AuthContextType = {
  session: Session | null;
  profile: any;
  workspace: any;
  loading: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  profile: null,
  workspace: null,
  loading: true,
  refreshProfile: async () => {},
});

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function refreshProfile() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setProfile(null);
      setWorkspace(null);
      return;
    }

    const profileData = await getProfile(session.user.id);

    setProfile(profileData);
    setWorkspace(profileData.workspace);
  }

  useEffect(() => {
    async function initialize() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);

      if (session) {
        await refreshProfile();
      }

      setLoading(false);
    }

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);

        if (session) {
          await refreshProfile();
        } else {
          setProfile(null);
          setWorkspace(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        workspace,
        loading,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
