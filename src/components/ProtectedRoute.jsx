import React from "react";
import { Route, Redirect } from "wouter";
import { getAuth } from "../services/authStorage";

export default function ProtectedRoute({ path, component: Component, requireRole }) {
    return (
        <Route path={path}>
            {(params) => {
                const auth = getauth();
                if (!auth) return <Redirect to="/login" />
                if (requireRole && auth.role !== requireRole) {
                    <Redirect to="/" />;
                }
                return <Component {...params} auth={auth} />;
            }}
        </Route>
    );
}