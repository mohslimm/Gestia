"use client";

import React, { useState, useEffect } from "react";
import { Mic, MicOff, PhoneCall, PhoneOff, Sparkles, AlertTriangle, CheckCircle2, MessageSquare, Wrench, Shield, ArrowRight } from "lucide-react";

interface VoiceMessage {
  role: "concierge" | "user";
  time: string;
  text: string;
}

interface IncidentCard {
  residence: string;
  unit: string;
  tenant: string;
  issue: string;
  severity: "URGENT - P1" | "NORMAL - P2" | "INFO";
  craftsmanRequired: string;
  actionPlan: string;
}

export default function VoiceConciergePage() {
  const [isCalling, setIsCalling] = useState(false);
  const [statusText, setStatusText] = useState("Concierge Vocal IA en veille • Prêt pour appel locataire ou gérant");
  const [waveTick, setWaveTick] = useState(0);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  const [transcript, setTranscript] = useState<VoiceMessage[]>([
    {
      role: "concierge",
      time: "10:00",
      text: "Conciergerie Privée Gestia, bonjour. Je suis votre concierge vocal autonome. Comment puis-je vous assister aujourd'hui pour votre résidence ?"
    }
  ]);

  const [currentIncident, setCurrentIncident] = useState<IncidentCard>({
    residence: "Résidence Les Pins — Hydra",
    unit: "Appartement 402 (Étage 4)",
    tenant: "Karim Benzerga (0550 12 34 56)",
    issue: "Fuite d'eau abondante sous l'évier de la cuisine avec risque d'infiltration au 3ème étage.",
    severity: "URGENT - P1",
    craftsmanRequired: "Plomberie d'urgence (Artisan Référencé Gestia)",
    actionPlan: "Couper la vanne générale d'arrivée d'eau • Alerte SMS/WhatsApp envoyée à Plomberie Express Hydra • Notification du gestionnaire."
  });

  // Soundwave animation loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCalling) {
      interval = setInterval(() => {
        setWaveTick((prev) => prev + 0.25);
      }, 70);
    }
    return () => clearInterval(interval);
  }, [isCalling]);

  const speakText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR";
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startVoiceCall = () => {
    setIsCalling(true);
    setStatusText("Appel en direct • Reconnaissance vocale WebRTC active");

    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = "fr-FR";
        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setTranscript((prev) => [
            ...prev,
            { role: "user", time: new Date().toLocaleTimeString().slice(0, 5), text }
          ]);
          speakText("Bien reçu. J'analyse l'incident et je coordonne l'intervention immédiatement.");
        };
        recognition.start();
      } catch (e) {
        console.error(e);
      }
    } else {
      speakText("Conciergerie Gestia. Je vous écoute.");
    }
  };

  const endVoiceCall = () => {
    setIsCalling(false);
    setStatusText("Appel terminé • Ticket et alertes dispatchés");
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const loadScenario = (type: "degat" | "finance" | "relance") => {
    setIsCalling(true);
    setActiveScenario(type);
    setStatusText("Simulation d'échange en cours • Analyse par l'IA");

    if (type === "degat") {
      setTranscript([
        { role: "concierge", time: "10:02", text: "Conciergerie Gestia bonjour, veuillez nous indiquer votre résidence et l'objet de votre appel." },
        { role: "user", time: "10:03", text: "Bonjour, ici Karim Benzerga à la Résidence Les Pins, appartement 402. J'ai une fuite importante sous l'évier qui coule chez le voisin du dessous." },
        { role: "concierge", time: "10:04", text: "Incident critique classé P1. Fermez la vanne d'arrêt sous votre évier. L'artisan plomberie référencé d'Hydra a été mobilisé et arrive d'ici 30 minutes." }
      ]);
      setCurrentIncident({
        residence: "Résidence Les Pins — Hydra, Alger",
        unit: "Appartement 402 (Étage 4)",
        tenant: "Karim Benzerga (0550 12 34 56)",
        issue: "Rupture de flexible sous évier de cuisine avec écoulement continu chez le voisin du 302.",
        severity: "URGENT - P1",
        craftsmanRequired: "Plomberie d'urgence (SOS Dépannage Hydra)",
        actionPlan: "Coupure d'eau conservatoire ordonnée • Ticket d'intervention n°TK-2026-89 ouvert • Artisan dépêché avec confirmation WhatsApp."
      });
      speakText("Incident critique classifié. Intervention plomberie d'urgence déclenchée pour l'appartement 402.");
    } else if (type === "finance") {
      setTranscript([
        { role: "concierge", time: "10:05", text: "Espace Gestionnaire Gestia. Quelle synthèse financière souhaitez-vous consulter ?" },
        { role: "user", time: "10:06", text: "Fais-moi un point sur les encaissements des loyers du mois de mai pour le parc immobilier d'Alger." },
        { role: "concierge", time: "10:07", text: "Taux de recouvrement à 94%. 18 loyers perçus sur 19. Un seul retard de 65 000 DZD sur la Résidence El Biar, relance automatique WhatsApp programmée." }
      ]);
      setCurrentIncident({
        residence: "Ensemble du Parc Gestia — Alger Centre & Ouest",
        unit: "19 Unités Locatives Actives",
        tenant: "Synthèse Gestionnaire Privé",
        issue: "Bilan des encaissements : 18/19 baux à jour (94.7% de recouvrement). Solde impayé : 65 000 DZD.",
        severity: "NORMAL - P2",
        craftsmanRequired: "Service Comptabilité & Recouvrement Gestia",
        actionPlan: "Notification de relance polie j+5 transmise via WhatsApp • Rapprochement bancaire validé."
      });
      speakText("Bilan financier consolidé : 94 pour cent de recouvrement. Un seul impayé sous surveillance.");
    } else if (type === "relance") {
      setTranscript([
        { role: "concierge", time: "10:08", text: "Assistant Recouvrement Gestia. Quel dossier souhaitez-vous traiter ?" },
        { role: "user", time: "10:09", text: "Relance le locataire de l'appartement 12 à Sidi Yahia pour le loyer en retard." },
        { role: "concierge", time: "10:10", text: "Relance WhatsApp avec avis d'échéance et lien de paiement sécurisé transmise à M. Sofiane Mehdi." }
      ]);
      setCurrentIncident({
        residence: "Résidence Panorama — Sidi Yahia, Alger",
        unit: "Appartement 12 (Étage 2)",
        tenant: "Sofiane Mehdi (0661 88 99 00)",
        issue: "Loyer de mai en souffrance (80 000 DZD) depuis 6 jours sans justificatif de virement.",
        severity: "NORMAL - P2",
        craftsmanRequired: "Gestionnaire de Compte Gestia",
        actionPlan: "Avis d'échéance renvoyé avec QR code de virement instantané • Alerte SMS de confirmation."
      });
      speakText("Relance de loyer transmise par WhatsApp avec avis d'échéance joint.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-6 sm:p-8 text-white shadow-xl border border-amber-500/20">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-400 border border-amber-500/30 mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Stepping Stones Agency • Voice Concierge Suite
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Conciergerie Vocale Autonome Gestia</h1>
            <p className="mt-2 max-w-2xl text-sm font-light text-slate-300">
              Assistance vocale 24/7 pour locataires et gestionnaires : qualification instantanée des urgences techniques, dispatching automatique des artisans et pilotage financier par la voix.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Agent Vocal Actif
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Colonne Gauche : Station d'Appel (5 colonnes) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm text-center">
            {/* Visual Waveform Display */}
            <div className="relative mb-5 flex h-40 w-full flex-col items-center justify-center rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent"></div>
              
              <div className="flex items-center gap-1.5 h-16 z-10">
                {Array.from({ length: 18 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-150 ${
                      isCalling ? "bg-amber-400" : "bg-slate-700"
                    }`}
                    style={{
                      height: isCalling ? `${Math.sin(i * 0.5 + waveTick) * 35 + 40}%` : "12%"
                    }}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-slate-400 z-10">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                <span>{statusText}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="w-full">
              {!isCalling ? (
                <button
                  onClick={startVoiceCall}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>Démarrer un Appel Vocal Direct</span>
                </button>
              ) : (
                <button
                  onClick={endVoiceCall}
                  className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <PhoneOff className="h-4 w-4" />
                  <span>Terminer l'Appel & Dispatcher</span>
                </button>
              )}
            </div>

            {/* Scénarios Démo Présentation Client */}
            <div className="mt-6 border-t pt-5 text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
                Simuler des Cas Réels (Démo Closing Client) :
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => loadScenario("degat")}
                  className="w-full p-2.5 rounded-xl border bg-muted/30 hover:bg-amber-500/10 hover:border-amber-500/40 text-xs transition flex items-center justify-between text-left"
                >
                  <span className="font-medium">🚨 Dégât des Eaux Urgent (Appartement 402)</span>
                  <span className="text-amber-500 font-bold">Lancer →</span>
                </button>
                <button
                  onClick={() => loadScenario("finance")}
                  className="w-full p-2.5 rounded-xl border bg-muted/30 hover:bg-amber-500/10 hover:border-amber-500/40 text-xs transition flex items-center justify-between text-left"
                >
                  <span className="font-medium">📊 Bilan Financier & Encaissements Loyers</span>
                  <span className="text-amber-500 font-bold">Lancer →</span>
                </button>
                <button
                  onClick={() => loadScenario("relance")}
                  className="w-full p-2.5 rounded-xl border bg-muted/30 hover:bg-amber-500/10 hover:border-amber-500/40 text-xs transition flex items-center justify-between text-left"
                >
                  <span className="font-medium">📲 Relance de Loyer Automatisée (WhatsApp)</span>
                  <span className="text-amber-500 font-bold">Lancer →</span>
                </button>
              </div>
            </div>
          </div>

          {/* Transcript Box */}
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
              <span><MessageSquare className="inline h-3.5 w-3.5 mr-1 text-amber-500" /> Transcription Directe</span>
              <span className="font-mono text-[10px]">WebRTC Audio Feed</span>
            </h3>
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 text-xs">
              {transcript.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border leading-relaxed ${
                    msg.role === "concierge"
                      ? "bg-amber-500/10 border-amber-500/20 text-foreground"
                      : "bg-muted/40 border-border text-foreground"
                  }`}
                >
                  <div className="font-bold text-[10px] uppercase tracking-wider mb-1 flex items-center justify-between text-muted-foreground">
                    <span>{msg.role === "concierge" ? "👑 Concierge Vocal Gestia" : "👤 Interlocuteur"}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Colonne Droite : Fiche d'Incident & Dispatching (7 colonnes) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between border-b pb-4 mb-5">
              <div>
                <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest">Action Ticket Autonome</span>
                <h3 className="text-lg font-bold text-foreground">Fiche de Traitement & Coordination Technique</h3>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  currentIncident.severity === "URGENT - P1"
                    ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/30"
                }`}
              >
                {currentIncident.severity}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 text-xs">
              <div className="bg-muted/30 p-3 rounded-xl border">
                <span className="text-muted-foreground font-medium block mb-1">Résidence / Propriété</span>
                <span className="font-bold text-foreground">{currentIncident.residence}</span>
              </div>
              <div className="bg-muted/30 p-3 rounded-xl border">
                <span className="text-muted-foreground font-medium block mb-1">Unité / Lot</span>
                <span className="font-bold text-foreground">{currentIncident.unit}</span>
              </div>
              <div className="bg-muted/30 p-3 rounded-xl border">
                <span className="text-muted-foreground font-medium block mb-1">Locataire</span>
                <span className="font-bold text-foreground">{currentIncident.tenant}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-muted/20 rounded-xl border">
                <h4 className="font-bold text-foreground mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> Diagnostic de l'Incident
                </h4>
                <p className="text-muted-foreground leading-relaxed">{currentIncident.issue}</p>
              </div>

              <div className="p-4 bg-muted/20 rounded-xl border">
                <h4 className="font-bold text-foreground mb-1 flex items-center gap-1.5">
                  <Wrench className="h-4 w-4 text-slate-400" /> Artisan / Prestataire Requis
                </h4>
                <p className="text-foreground font-semibold">{currentIncident.craftsmanRequired}</p>
              </div>

              <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/20">
                <h4 className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-amber-500" /> Plan d'Action Déclenché par l'IA
                </h4>
                <p className="text-foreground leading-relaxed">{currentIncident.actionPlan}</p>
              </div>
            </div>

            {/* Boutons d'Action Automatique */}
            <div className="mt-6 pt-5 border-t flex flex-wrap gap-3">
              <button
                onClick={() => alert("✅ Ticket n°TK-2026-89 synchronisé dans la base Supabase de Gestia !")}
                className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-sm flex items-center justify-center gap-2 hover:opacity-90 transition"
              >
                <CheckCircle2 className="h-4 w-4 text-amber-400" />
                <span>Enregistrer le Ticket dans Gestia</span>
              </button>
              <button
                onClick={() => {
                  const url = `https://api.whatsapp.com/send?phone=213550123456&text=${encodeURIComponent(
                    `Gestia Conciergerie - Alerte Intervention :\n${currentIncident.residence}\n${currentIncident.unit}\nMotif : ${currentIncident.issue}\nArtisan dépêché immédiatement.`
                  )}`;
                  window.open(url, "_blank");
                }}
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition"
              >
                <span>Alerter l'Artisan (WhatsApp)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
