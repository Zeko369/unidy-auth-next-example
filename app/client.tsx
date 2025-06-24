"use client";

import { useEffect, useRef, useState } from "react";
import { UnidyAuth } from "@unidy.io/auth";

import "../node_modules/@unidy.io/auth/dist/esm/unidy-login";

const useUnidyAuth = () => {
  const [state, setState] = useState<{
    isAuthenticated: boolean;
    user: any;
  }>({ isAuthenticated: false, user: null });

  const [client] = useState(() => {
    return new UnidyAuth().init("https://qa2.staging.unidy.de", {
      clientId: "IrWEdcAhN1yCpd3eInn1tndCCuAHp8QQpWpbcLoq_G8",
      scope: "openid profile email",
      redirectUrl: "http://localhost:3000/",
      onAuth: (token: string) => {
        setState({
          isAuthenticated: true,
          user: client.userTokenData(),
        });
      },
    });
  });

  const ref = useRef(false);
  useEffect(() => {
    if (!ref.current) {
      client.mountComponent();
      client.isAuthenticated().then((res) => {
        setState({
          isAuthenticated: res,
          user: client.userTokenData(),
        });
      });

      ref.current = true;
    }
  }, [client]);

  return {
    client,
    state,
    logout: () => {
      client.logout().then(() => {
        setState({ isAuthenticated: false, user: null });
      });
    },
  };
};

export default function Client({ cookie }: { cookie: string }) {
  const { client, state, logout } = useUnidyAuth(cookie);

  return (
    <div>
      <h1 className="text-2xl font-bold">Unidy Auth</h1>

      {state.isLoading && <div>Loading...</div>}

      {!state.isAuthenticated && (
        <button id="fcsp-login-btn" onClick={() => client.auth()}>
          Login
        </button>
      )}

      <div>Authenticated: {state.isAuthenticated ? "true" : "false"}</div>
      <div>User: {JSON.stringify(state.user)}</div>

      {state.isAuthenticated && (
        <button id="fcsp-logout-btn" onClick={logout}>
          Logout
        </button>
      )}
    </div>
  );
}
