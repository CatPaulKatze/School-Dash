"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Loader2, Key } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Page() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const router = useRouter();

    return (
        <div className="mx-auto mt-24 max-w-md">
            <Card className="z-50 rounded-md rounded-t-none max-w-md">
                <CardHeader>
                    <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="username"
                                placeholder="Maxifox123"
                                required
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                }}
                                value={username}
                            />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                            </div>

                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                autoComplete="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="remember"
                                defaultChecked
                                onClick={() => {
                                    setRememberMe(!rememberMe);
                                }}
                            />
                            <Label htmlFor="remember">Remember me</Label>
                        </div>



                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                            onClick={async () => {
                                await signIn.username(
                                    {
                                        username,
                                        password
                                    },
                                    {
                                        onRequest: () => {
                                            setLoading(true);
                                        },
                                        onResponse: () => {
                                            setLoading(false);
                                        },
                                        onSuccess: () => {
                                            router.push("/");
                                        }
                                    },
                                );
                            }}
                        >
                            {loading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <p> Login </p>
                            )}
                        </Button>

                        <Button
                            variant="secondary"
                            disabled={loading}
                            className="gap-2"
                            onClick={async () => {
                                await signIn.passkey(
                                    {
                                        fetchOptions: {
                                            onRequest: () => {
                                                setLoading(true);
                                            },
                                            onResponse: () => {
                                                setLoading(false);
                                            },
                                            onSuccess: () => {
                                                router.push("/");
                                            }
                                        }
                                    },
                                )
                            }}
                        >
                            <Key size={16} />
                            Sign-in with Passkey
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}