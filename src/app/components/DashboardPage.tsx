import { transcribeAudio, analyzeTranscript } from "../../services/fraud";
import { useState, useEffect, useRef } from 'react';
import { Shield, Lock, TriangleAlert, CircleAlert, ShieldAlert, Clock } from 'lucide-react';
import { CallPanel } from './CallPanel';
import { TranscriptionPanel } from './TranscriptionPanel';
import { RiskMeter } from './RiskMeter';
import { AlertOverlay } from './AlertOverlay';
import { PostCallSummary } from './PostCallSummary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface DashboardPageProps {
  elderMode?: boolean;
  onBackToHome?: () => void;
}

interface Message {
  id: number;
  speaker: 'caller' | 'user';
  text: string;
  timestamp: string;
  hasScamPhrases: boolean;
  scamPhrases?: string[];
}

export function DashboardPage({ elderMode, onBackToHome }: DashboardPageProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [riskLevel, setRiskLevel] = useState(0);
  const [analysis, setAnalysis] = useState<any>(null);
  const [detectedPattern, setDetectedPattern] = useState("Unknown");
  const [threatLevel, setThreatLevel] = useState("Low");
  const [redFlags, setRedFlags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [activeTab, setActiveTab] = useState('live');
  const [messages, setMessages] = useState<Message[]>([]);

  // Keep a mutable reference of current messages for the polling interval closure
  const messagesRef = useRef<Message[]>([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Handle call timer progression
  useEffect(() => {
    if (!isCallActive) return;

    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isCallActive]);

  // Real-time backend live-monitoring hook (runs every 5 seconds during active call if messages exist)
  useEffect(() => {
    if (!isCallActive || messages.length === 0) return;

    const timer = setInterval(() => {
      analyzeCurrentTranscript(messagesRef.current);
    }, 5000);

    return () => clearInterval(timer);
  }, [messages.length, isCallActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAcceptCall = () => {
    setIsCallActive(true);
    setCallDuration(0);
    setRiskLevel(0);
    setMessages([]);
    setDetectedPattern("Waiting for analysis...");
    setThreatLevel("Low");
    setRedFlags([]);
    setAnalysis(null);
  };

  const analyzeCurrentTranscript = async (currentMessages: Message[]) => {
    if (currentMessages.length === 0) return;

    try {
      setLoading(true);
      const transcript = currentMessages
        .map((msg) => `${msg.speaker}: ${msg.text}`)
        .join("\n");

      const result = await analyzeTranscript(transcript);
      console.log("Analysis Result:", result);
      setAnalysis(result);

      if (result.risk_score !== undefined)
        setRiskLevel(result.risk_score);

      if (result.detected_pattern)
        setDetectedPattern(result.detected_pattern);

      if (result.threat_level)
        setThreatLevel(result.threat_level);

      if (result.red_flags)
        setRedFlags(result.red_flags);

      if (result.risk_score >= 70)
        setShowAlert(true);

    } catch (err) {
      console.error("Analysis engine failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAudioUpload = async (file: File) => {
    try {
      setLoading(true);
      const response = await transcribeAudio(file);
      const transcript = response.transcription;

      const incomingMessages: Message[] = [
        {
          id: 1,
          speaker: "caller",
          text: transcript,
          timestamp: "00:05",
          hasScamPhrases: false
        }
      ];

      setMessages(incomingMessages);
      
      // Instantly invoke analysis without waiting for the 5-second interval loop
      await analyzeCurrentTranscript(incomingMessages);

    } catch (err) {
      console.error("Audio transaction failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setShowAlert(false);
    setActiveTab('summary');
    
    // Clean states ready for the next collection sequence
    setMessages([]);
    setRiskLevel(0);
    setDetectedPattern("Unknown");
    setThreatLevel("Low");
    setRedFlags([]);
  };

  const handleMuteCaller = () => {
    console.log('Caller muted');
  };

  const handleDismissAlert = () => {
    setShowAlert(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef5f7] via-[#ffe3ec] to-[#ffd4e3]">
      {/* TOP BAR - SYSTEM STATUS */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#ff9eb7]/20 shadow-sm">
        <div className="container mx-auto px-6 py-4 pt-20 flex items-center justify-between bg-[rgba(0,0,0,0)]">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-3 group cursor-pointer transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#ff9eb7]/50 focus:ring-offset-2 rounded-xl px-3 py-2 -ml-3"
            aria-label="Return to Home page"
          >
            <Shield className={`${elderMode ? 'w-10 h-10' : 'w-8 h-8'} text-[#ff9eb7] transition-transform duration-300 group-hover:rotate-12`} />
            <span className={`${elderMode ? 'text-2xl' : 'text-xl'} font-bold text-[#5a2e3e] group-hover:text-[#ff9eb7] transition-colors duration-300 relative`}>
              FraudShield AI
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ff9eb7] group-hover:w-full transition-all duration-300" />
            </span>
          </button>

          <div className="flex items-center gap-2 px-4 py-2 bg-[#6ee7b7]/20 border border-[#6ee7b7]/40 rounded-full shadow-sm">
            <div className="w-3 h-3 bg-[#6ee7b7] rounded-full animate-pulse shadow-lg shadow-[#6ee7b7]/50" />
            <span className={`${elderMode ? 'text-lg' : 'text-sm'} text-[#059669] font-semibold`}>
              AI Monitoring Active
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[#8b6574]">
            <Lock className={`${elderMode ? 'w-6 h-6' : 'w-5 h-5'}`} />
            <span className={`${elderMode ? 'text-lg' : 'text-sm'}`}>
              On-device processing • No call storage
            </span>
          </div>
        </div>
      </header>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-white/60 border border-[#ff9eb7]/20 shadow-sm rounded-xl">
            <TabsTrigger
              value="live"
              className={`${elderMode ? 'text-lg py-4' : 'text-base py-3'} data-[state=active]:bg-[#ff9eb7] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg`}
            >
              Live Protection
            </TabsTrigger>
            <TabsTrigger
              value="summary"
              className={`${elderMode ? 'text-lg py-4' : 'text-base py-3'} data-[state=active]:bg-[#ff9eb7] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg`}
            >
              Call Summary
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT PANEL - LIVE TRANSCRIPTION */}
              <div className="lg:col-span-1 h-[600px]">
                <TranscriptionPanel messages={messages} elderMode={elderMode || false} />
              </div>

              {/* CENTER PANEL - MAIN CALL PANEL */}
              <div className="lg:col-span-1 flex items-center justify-center">
                <div className="w-full">
                  <CallPanel
                    isActive={isCallActive}
                    onAccept={handleAcceptCall}
                    onEnd={handleEndCall}
                    callDuration={callDuration}
                    elderMode={elderMode || false}
                    onAudioUpload={handleAudioUpload}
                  />
                </div>
              </div>

              {/* RIGHT PANEL - SCAM INTELLIGENCE */}
              <div className="lg:col-span-1 h-[600px]">
                <RiskMeter
                  riskLevel={riskLevel}
                  detectedPattern={detectedPattern}
                  threatLevel={threatLevel}
                  tags={redFlags}
                  elderMode={elderMode || false}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="summary">
            <PostCallSummary
              callDuration={formatTime(callDuration)}
              maxRiskLevel={riskLevel}
              timeline={
                analysis?.timeline ?? [
                  {
                    time: "00:10",
                    riskLevel: riskLevel,
                    event: "Transcript analyzed",
                    severity: "medium"
                  }
                ]
              }
              redFlags={
                redFlags.map(flag => ({
                  icon: <TriangleAlert className="w-5 h-5 text-red-400" />,
                  title: flag,
                  description: flag
                }))
              }
              elderMode={elderMode || false}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* ALERT OVERLAY */}
      <AlertOverlay
        isVisible={showAlert && isCallActive}
        onEndCall={handleEndCall}
        onMute={handleMuteCaller}
        onDismiss={handleDismissAlert}
        elderMode={elderMode || false}
      />
    </div>
  );
}