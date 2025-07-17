import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Sparkles, Calculator } from 'lucide-react';

type AppState = 'initial' | 'calculating' | 'display';

interface TimeData {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface DialogMessage {
  id: number;
  text: string;
  position: { x: number; y: number };
  visible: boolean;
}

const Index = () => {
  const [state, setState] = useState<AppState>('initial');
  const [timeData, setTimeData] = useState<TimeData>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [dialogMessages, setDialogMessages] = useState<DialogMessage[]>([]);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  const startTime = new Date('2024-07-16T17:00:00');

  const dialogTexts = [
    "So many memories! 💕",
    "All the love! 💖",
    "Here's to more time together! 🥰",
    "You are my person! 💝",
    "Every moment counts! ⏰",
    "Together forever! 💑",
    "Our beautiful journey! 🌟",
    "Making memories! 📸",
    "Love you more each day! 💗",
    "My favorite person! 🥺"
  ];

  // Generate sparkles
  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3
      }));
      setSparkles(newSparkles);
    };

    generateSparkles();
    const interval = setInterval(generateSparkles, 5000);
    return () => clearInterval(interval);
  }, []);

  // Calculate time difference
  const calculateTimeDifference = () => {
    const now = new Date();
    const diffMs = now.getTime() - startTime.getTime();
    
    const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((diffMs % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((diffMs % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    return { years, months, days, hours, minutes, seconds };
  };

  // Update time every second
  useEffect(() => {
    if (state === 'display') {
      const interval = setInterval(() => {
        setTimeData(calculateTimeDifference());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state]);

  // Show dialog messages
  useEffect(() => {
    if (state === 'display') {
      const showDialog = () => {
        const newDialog: DialogMessage = {
          id: Date.now(),
          text: dialogTexts[Math.floor(Math.random() * dialogTexts.length)],
          position: {
            x: Math.random() * 60 + 20, // 20-80% of screen width
            y: Math.random() * 40 + 30  // 30-70% of screen height
          },
          visible: true
        };

        setDialogMessages(prev => [...prev, newDialog]);

        // Remove dialog after 3 seconds
        setTimeout(() => {
          setDialogMessages(prev => 
            prev.map(msg => 
              msg.id === newDialog.id ? { ...msg, visible: false } : msg
            )
          );
        }, 3000);

        // Remove from array after animation
        setTimeout(() => {
          setDialogMessages(prev => prev.filter(msg => msg.id !== newDialog.id));
        }, 3800);
      };

      const interval = setInterval(showDialog, 4000);
      return () => clearInterval(interval);
    }
  }, [state]);

  const handleStart = () => {
    setState('calculating');
    
    // Simulate calculation time
    setTimeout(() => {
      setTimeData(calculateTimeDifference());
      setState('display');
    }, 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Sparkles */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle animate-sparkle-float"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animationDelay: `${sparkle.delay}s`
          }}
        />
      ))}

      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        {/* Initial Question Screen */}
        {state === 'initial' && (
          <Card className="card-container max-w-md w-full animate-slide-up">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <Heart className="mx-auto w-16 h-16 text-primary mb-4" />
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Times Together
                </h1>
                <p className="text-muted-foreground text-lg">
                  Want to see how long we've been together?
                </p>
              </div>
              
              <Button
                onClick={handleStart}
                className="cute-button px-8 py-3 text-lg rounded-full"
              >
                Of course! 💕
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Calculating Screen */}
        {state === 'calculating' && (
          <Card className="card-container max-w-md w-full animate-slide-up">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <Calculator className="mx-auto w-16 h-16 text-primary mb-4 animate-pulse-soft" />
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Calculating...
                </h2>
                <p className="text-muted-foreground">
                  Counting all our precious moments together
                </p>
              </div>
              
              <div className="flex justify-center">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Time Display Screen */}
        {state === 'display' && (
          <Card className="card-container max-w-2xl w-full animate-slide-up">
            <CardContent className="p-8 text-center">
              <div className="mb-8">
                <Sparkles className="mx-auto w-12 h-12 text-accent mb-4" />
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Time We've Spent Together
                </h2>
                <p className="text-muted-foreground">
                  Since 5:00 PM, July 16th, 2024
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-secondary rounded-lg p-4">
                  <div className="time-display text-2xl md:text-3xl font-bold">
                    {timeData.years}
                  </div>
                  <div className="text-sm text-muted-foreground">Years</div>
                </div>
                <div className="bg-secondary rounded-lg p-4">
                  <div className="time-display text-2xl md:text-3xl font-bold">
                    {timeData.months}
                  </div>
                  <div className="text-sm text-muted-foreground">Months</div>
                </div>
                <div className="bg-secondary rounded-lg p-4">
                  <div className="time-display text-2xl md:text-3xl font-bold">
                    {timeData.days}
                  </div>
                  <div className="text-sm text-muted-foreground">Days</div>
                </div>
                <div className="bg-secondary rounded-lg p-4">
                  <div className="time-display text-2xl md:text-3xl font-bold">
                    {timeData.hours}
                  </div>
                  <div className="text-sm text-muted-foreground">Hours</div>
                </div>
                <div className="bg-secondary rounded-lg p-4">
                  <div className="time-display text-2xl md:text-3xl font-bold">
                    {timeData.minutes}
                  </div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
                <div className="bg-secondary rounded-lg p-4">
                  <div className="time-display text-2xl md:text-3xl font-bold">
                    {timeData.seconds}
                  </div>
                  <div className="text-sm text-muted-foreground">Seconds</div>
                </div>
              </div>

              <p className="text-muted-foreground text-sm">
                ✨ And counting every precious moment ✨
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog Messages */}
      {dialogMessages.map((dialog) => (
        <div
          key={dialog.id}
          className={`dialog-box fixed p-3 rounded-lg text-sm font-medium text-foreground transition-all duration-800 ${
            dialog.visible ? 'animate-dialog-appear' : 'animate-dialog-disappear'
          }`}
          style={{
            left: `${dialog.position.x}%`,
            top: `${dialog.position.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {dialog.text}
        </div>
      ))}
    </div>
  );
};

export default Index;
