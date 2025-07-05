import React, { useState, useEffect } from "react";

const App = () => {
  const [flickerText, setFlickerText] = useState(true);
  const [pacmanPosition, setPacmanPosition] = useState(0);
  const [pellets, setPellets] = useState([]);
  const [comingSoonFlicker, setComingSoonFlicker] = useState(true);
  const [pelletGeneration, setPelletGeneration] = useState(0);
  const [direction, setDirection] = useState("right");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const createFlicker = () => {
      const delay = Math.random() * 800 + 100;
      setTimeout(() => {
        setFlickerText((prev) => !prev);
        createFlicker();
      }, delay);
    };
    createFlicker();
  }, []);

  useEffect(() => {
    const createComingSoonFlicker = () => {
      const delay = Math.random() * 600 + 150;
      setTimeout(() => {
        setComingSoonFlicker((prev) => !prev);
        createComingSoonFlicker();
      }, delay);
    };
    createComingSoonFlicker();
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setPacmanPosition((prev) => {
          if (direction === "right") {
            if (prev >= (isMobile ? 110 : 105)) {
              setDirection("left");
              return isMobile ? 110 : 105;
            }
            return prev + (isMobile ? 1.2 : 1);
          } else {
            if (prev <= (isMobile ? -10 : -5)) {
              setDirection("right");
              return isMobile ? -10 : -5;
            }
            return prev - (isMobile ? 1.2 : 1);
          }
        });
      },
      isMobile ? 100 : 120
    );
    return () => clearInterval(interval);
  }, [direction, isMobile]);

  useEffect(() => {
    const initialPellets = [];
    const pelletCount = isMobile ? 10 : 15;
    const spacing = isMobile ? 8.5 : 6.5;
    for (let i = 0; i < pelletCount; i++) {
      initialPellets.push({
        id: `${pelletGeneration}-${i}`,
        x: (i + 0.5) * (100 / pelletCount),
        eaten: false,
        shouldDisappear: false,
      });
    }
    setPellets(initialPellets);
  }, [pelletGeneration, isMobile]);

  useEffect(() => {
    setPellets((prev) => {
      const updated = prev.map((pellet) => {
        const isEaten = () => {
          const tolerance = isMobile ? 2 : 1;
          if (direction === "right") {
            return (
              pellet.x >= pacmanPosition - tolerance &&
              pellet.x <= pacmanPosition
            );
          } else {
            return (
              pellet.x <= pacmanPosition + tolerance &&
              pellet.x >= pacmanPosition
            );
          }
        };

        if (isEaten() && !pellet.eaten) {
          return { ...pellet, eaten: true, shouldDisappear: true };
        }
        return pellet;
      });

      const allEaten = updated.every((p) => p.shouldDisappear);
      if (allEaten && updated.length > 0) {
        setTimeout(() => setPelletGeneration((prev) => prev + 1), 1000);
      }

      return updated;
    });
  }, [pacmanPosition, direction]);

  const sideTexts = [
    "PLANNING EVENT",
    "PREPARRING PRIZES",
    "HAVING LUNCH",
    "EVENT LOADING...",
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-5 bg-cathode-lines pointer-events-none" />

      <div className="absolute top-20 md:top-32 left-0 right-0 h-10 z-10">
        {pellets.map((pellet) => (
          <div
            key={pellet.id}
            className={`absolute ${
              isMobile ? "w-1.5 h-1.5" : "w-2 h-2"
            } bg-yellow-400 rounded-full ${
              pellet.shouldDisappear ? "hidden" : ""
            }`}
            style={{
              left: `${pellet.x}%`,
              top: "50%",
              transform: "translateY(-50%)",
              boxShadow: "0 0 8px rgba(255,255,0,0.6)",
            }}
          />
        ))}

        <div
          className={`absolute ${
            isMobile ? "w-5 h-5" : "w-6 h-6"
          } bg-yellow-400 rounded-full transition-all duration-150`}
          style={{
            left: `${pacmanPosition}%`,
            top: "50%",
            transform: `translateY(-50%) scaleX(${
              direction === "left" ? -1 : 1
            })`,
            clipPath:
              "polygon(100% 74%, 44% 48%, 100% 21%, 100% 0%, 0% 0%, 0% 100%, 100% 100%)",
            animation: "chomp 0.3s ease-in-out infinite alternate",
          }}
        />
      </div>

      {!isMobile && (
        <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-green-400 font-mono text-xs opacity-60 z-10">
          {sideTexts.map((text, i) => (
            <div
              key={i}
              className={`mb-6 transition-opacity duration-75 ${
                flickerText && i % 2 === 0 ? "opacity-100" : "opacity-20"
              }`}
              style={{
                textShadow: "0 0 8px rgba(0,255,0,0.5)",
                animation: `flicker ${1.5 + i * 0.2}s ease-in-out infinite`,
              }}
            >
              {text}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative z-10">
        <div className="mb-12 md:mb-16">
          <h1
            className="text-5xl md:text-7xl font-bold mb-4 md:mb-6"
            style={{
              color: "#00ffff",
              textShadow: "0 0 20px rgba(0, 255, 255, 1), 0 0 20px #00eeff",
              animation: "titleGlow 3s ease-in-out infinite alternate",
            }}
          >
            NEED FOR CODE
          </h1>
          <div
            className="text-3xl md:text-5xl font-bold"
            style={{
              color: "#00ffff",
              textShadow: "0 0 15px rgba(0,191,255,0.8)",
              animation: "float 4s ease-in-out infinite",
            }}
          >
            4.0
          </div>
        </div>

        <div className="space-y-4 md:space-y-8">
          <div
            className={`text-2xl md:text-4xl font-bold text-red-400 transition-opacity duration-75 ${
              comingSoonFlicker ? "opacity-100" : "opacity-30"
            }`}
            style={{
              textShadow: "0 0 25px rgba(255,0,0,0.7)",
              animation: "comingSoonFlicker 2s ease-in-out infinite",
            }}
          >
            COMING SOON
          </div>
          <div
            className="text-lg md:text-2xl text-cyan-300 opacity-90"
            style={{ animation: "typewriter 4s ease-in-out infinite" }}
          >
            The Ultimate Coding Experience
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes chomp {
          0% {
            clip-path: polygon(
              100% 74%,
              44% 48%,
              100% 21%,
              100% 0%,
              0% 0%,
              0% 100%,
              100% 100%
            );
          }
          100% {
            clip-path: polygon(
              100% 50%,
              44% 48%,
              100% 50%,
              100% 0%,
              0% 0%,
              0% 100%,
              100% 100%
            );
          }
        }
        @keyframes flicker {
          0%,
          100% {
            opacity: 0.6;
          }
          20% {
            opacity: 0.1;
          }
          25% {
            opacity: 0.8;
          }
          30% {
            opacity: 0.2;
          }
          35% {
            opacity: 0.9;
          }
          40% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.7;
          }
        }
        @keyframes comingSoonFlicker {
          0%,
          100% {
            opacity: 1;
          }
          10% {
            opacity: 0.2;
          }
          15% {
            opacity: 1;
          }
          20% {
            opacity: 0.3;
          }
          25% {
            opacity: 1;
          }
          30% {
            opacity: 0.1;
          }
          35% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        @keyframes titleGlow {
          0% {
            text-shadow: 0 0 20px rgba(0, 191, 255, 0.8),
              0 0 40px rgba(0, 191, 255, 0.5);
          }
          100% {
            text-shadow: 0 0 40px rgba(0, 191, 255, 1),
              0 0 80px rgba(0, 191, 255, 0.7);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes typewriter {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        .bg-cathode-lines {
          background-image: repeating-linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.1),
            rgba(255, 255, 255, 0.1) 1px,
            transparent 1px,
            transparent 10px
          );
        }
      `}</style>
    </div>
  );
};

export default App;
