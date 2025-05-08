import "./index.css";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import logo from "./logo.svg";
import reactLogo from "./react.svg";
import React from "react";

// Dynamic imports for the mock components
const Mock1 = React.lazy(() => import('./mock'));
const Mock2 = React.lazy(() => import('./mock2'));
const Mock3 = React.lazy(() => import('./mock3'));

export function App() {
  const [currentView, setCurrentView] = useState<'home' | 'mock1' | 'mock2' | 'mock3'>('home');

  // Header with back button
  const Header = ({ title }: { title: string }) => (
    <div className="h-12 bg-background/95 backdrop-blur-sm border-b flex items-center px-4 sticky top-0 z-50">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setCurrentView('home')}
        className="mr-2 h-8 w-8"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-sm font-medium opacity-70">{title}</h1>
    </div>
  );

  // Render the selected view
  if (currentView === 'mock1') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Mock App 1" />
        <React.Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
          <Mock1 />
        </React.Suspense>
      </div>
    );
  }

  if (currentView === 'mock2') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Mock App 2" />
        <React.Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
          <Mock2 />
        </React.Suspense>
      </div>
    );
  }

  if (currentView === 'mock3') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header title="Mock App 3" />
        <React.Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
          <Mock3 />
        </React.Suspense>
      </div>
    );
  }

  // Home view
  return (
    <div className="container mx-auto p-8 text-center relative z-10">
      <div className="flex justify-center items-center gap-8 mb-8">
        <img
          src={logo}
          alt="Bun Logo"
          className="h-36 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#646cffaa] scale-120"
        />
        <img
          src={reactLogo}
          alt="React Logo"
          className="h-36 p-6 transition-all duration-300 hover:drop-shadow-[0_0_2em_#61dafbaa] [animation:spin_20s_linear_infinite]"
        />
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-muted mb-8">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Mock App Navigator</CardTitle>
          <CardDescription>Select which mock app you'd like to view</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            onClick={() => setCurrentView('mock1')}
            className="px-8 py-6 text-lg"
          >
            Mock App 1
          </Button>
          <Button 
            size="lg"
            onClick={() => setCurrentView('mock2')}
            variant="secondary"
            className="px-8 py-6 text-lg"
          >
            Mock App 2
          </Button>
          <Button 
            size="lg"
            onClick={() => setCurrentView('mock3')}
            variant="outline"
            className="px-8 py-6 text-lg"
          >
            Mock App 3
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
