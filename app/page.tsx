"use client";

import { useState, useEffect } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState(0);

  // Generate password on initial load and when options change
  useEffect(() => {
    generatePassword();
  }, [length, includeUppercase, includeNumbers, includeSymbols]);

  // Calculate password strength
  useEffect(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    setStrength(score);
  }, [password]);

  const generatePassword = () => {
    let charset = "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }

    setPassword(newPassword);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrengthLabel = () => {
    if (strength <= 1) return "Fraca";
    if (strength <= 3) return "Média";
    return "Forte";
  };

  const getStrengthColor = () => {
    if (strength <= 1) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-xl py-3 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Gerador de Senhas</CardTitle>
          <CardDescription>
            Crie uma senha forte e segura, de forma simples.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <div className="flex h-16 items-center justify-between rounded-md bg-gray-100 p-4">
              <p className="text-lg font-medium break-all">{password}</p>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                className="h-8 w-8"
                aria-label="Copy password"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-medium">Força:</span>
              <div className="flex h-2 flex-1 gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-full w-full rounded-full ${
                      i < strength ? getStrengthColor() : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{getStrengthLabel()}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="length">Tamanho da senha: {length}</Label>
              </div>
              <Slider
                id="length"
                min={6}
                max={30}
                step={1}
                value={[length]}
                onValueChange={(value) => setLength(value[0])}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="numbers">Incluir números</Label>
              <Switch
                id="numbers"
                checked={includeNumbers}
                onCheckedChange={setIncludeNumbers}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="uppercase">Incluir caracteres maiúsculos</Label>
                <Switch
                  id="uppercase"
                  checked={includeUppercase}
                  onCheckedChange={setIncludeUppercase}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="symbols">Incluir caracteres especiais</Label>
                <Switch
                  id="symbols"
                  checked={includeSymbols}
                  onCheckedChange={setIncludeSymbols}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={generatePassword}
            className="w-full gap-2 bg-indigo-800 hover:bg-indigo-900"
          >
            <RefreshCw className="h-4 w-4" />
            Gerar Nova Senha
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
