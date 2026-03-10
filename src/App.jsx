import { useState, useEffect, useRef } from "react";
import crystalBall from "./assets/Crystall_Ball_Samira.svg";
import "./index.css";

const fortunes = {
  gameplay: ["The build shall not crash today 🎮", "QA will find no critical bugs ⚔️"],
  office: ["Every email will receive a reply today 📧", "All documents will arrive on time 📄"],
  production: ["There shall be no crunch today ⏳", "The milestone will be delivered on time 🚀"],
  directors: ["Your vision will inspire the whole team 🎬", "Meetings will run smoothly without conflicts 📝"],
  animation: ["Your animation will look flawless ✨", "The team will love your keyframes 🖌️"],
  "3d character art": ["Your character models will impress everyone 🧍‍♂️", "Textures and rigs work perfectly 🎨"],
  enviro: ["Your environments will immerse players 🌲", "Lighting will shine beautifully today 💡"],
  qa: ["All tests will pass without blocking bugs ✅", "No critical bugs shall appear today 🛠️"],
  "tech art": ["Shaders and rigs will behave correctly 🎛️", "Optimization will go smoothly 💻"],
  quest: ["Your quest design will delight players 🗺️", "No logic issues will appear in the quest flow 🧩"],
  vfx: ["Your particle effects will dazzle ✨", "Explosions will look epic 💥"],
  code: ["Your commits will merge without conflicts 🔀", "Your algorithms will run perfectly ⚙️"],
  finance: ["Budgets will balance perfectly 💰", "Invoices and reports will be on time 🗂️"],
  hr: ["Team morale will improve today 😊", "Everyone will communicate clearly 🤝"],
  IT: ["All systems will run without downtime 💻", "No network issues will appear 🌐"],
  writers: ["Your storylines will impress everyone ✍️", "Dialogue flows perfectly today 🗣️"],
  "concept art": ["Your concept sketches inspire the team 🎨", "Designs will be approved on the first try ✅"],
  cinematics: ["Your cinematic shots will look cinematic 🎥", "All sequences render smoothly 🎞️"],
};

export default function App() {
  const [showStart, setShowStart] = useState(true);
  const [department, setDepartment] = useState(null);
  const [showBall, setShowBall] = useState(false);
  const [portalActive, setPortalActive] = useState(false);
  const [floatActive, setFloatActive] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [showFortune, setShowFortune] = useState(false);
  const [fortuneText, setFortuneText] = useState("");
  const [fadeOut, setFadeOut] = useState(false);

  const canvasRef = useRef(null);
  const explosionsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 100 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 3 + 2,
      dx: Math.random() - 0.5,
      dy: Math.random() - 0.5,
    }));

    let animationId;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,60,60,0.8)";
        ctx.shadowColor = "red";
        ctx.shadowBlur = 10;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      explosionsRef.current.forEach((expl, idx) => {
        expl.forEach((p) => {
          p.x += p.dx;
          p.y += p.dy;
          p.alpha -= 0.02;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,0,0,${p.alpha})`;
          ctx.fill();
        });

        if (expl.every((p) => p.alpha <= 0)) {
          explosionsRef.current.splice(idx, 1);
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleDepartment = (dept) => {
    setDepartment(dept);
    setShowStart(false);
    setPortalActive(true);
    setShowFortune(false);

    setTimeout(() => {
      setPortalActive(false);
      setShowBall(true);
      setFloatActive(true);
    }, 1000);
  };

  const generateFortune = () => {
    const list = fortunes[department];
    const randomIndex = Math.floor(Math.random() * list.length);
    setFortuneText(list[randomIndex]);
    setShowFortune(true);

    const explosionParticles = Array.from({ length: 100 }).map(() => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      radius: Math.random() * 4 + 2,
      dx: (Math.random() - 0.5) * 12,
      dy: (Math.random() - 0.5) * 12,
      alpha: 1,
    }));

    explosionsRef.current.push(explosionParticles);
  };

  const handleBallClick = () => {
    if (showFortune) return; // blokada kolejnych kliknięć

    setPulse(true);
    setTimeout(() => setPulse(false), 600);

    generateFortune();
  };

  const shareSlack = async () => {
    const text = `🔮 My fate from the Crystal Ball: "${fortuneText}"`;

    try {
      await navigator.clipboard.writeText(text);
      alert("Fortune copied! Paste it into Slack ✨");
    } catch {
      alert("Could not copy text.");
    }
  };

  const goBack = () => {
    setFadeOut(true);

    setTimeout(() => {
      setShowBall(false);
      setShowFortune(false);
      setDepartment(null);
      setShowStart(true);
      setFadeOut(false);
    }, 500); // czas animacji fade
  };

  return (
    <div className="App">
      <canvas ref={canvasRef} className="particle-canvas" />

      <div className="overlay">
        {showStart && (
          <div className="start-screen fade-in">
            <h1>Welcome, weary traveler…</h1>

            <p>
              You seek answers from the Crystal Ball of Samira.
              <br />
              Reveal your guild, and fate shall unfold.
            </p>

            <div className="guild-cards">
              {Object.keys(fortunes).map((dept) => {
                const displayName =
                  dept === "3d character art" ? "CHARACTERS" : dept.toUpperCase();

                return (
                  <div
                    key={dept}
                    className="guild-card"
                    onClick={() => handleDepartment(dept)}
                  >
                    {displayName}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {portalActive && <div className="magic-portal"></div>}

        {showBall && (
          <div
            className={`float-wrapper ${floatActive ? "float-active" : ""} ${fadeOut ? "fade-out" : ""}`}
          >
            <div className="ball-wrapper">
              <img
                src={crystalBall}
                alt="Crystal Ball"
                className={`crystal-ball ${pulse ? "pulse" : ""} ${showFortune ? "used" : ""} fade-in`}
                onClick={handleBallClick}
              />
            </div>

            {showFortune && (
              <>
                <div className="fortune-card fade-in">
                  <p>{fortuneText}</p>
                </div>

                <div className="fortune-actions fade-in">
                  <button onClick={shareSlack}>SHARE ON SLACK</button>
                  <button onClick={goBack}>CHOOSE ANOTHER GUILD</button>
                </div>
              </>
            )}

            {!showFortune && (
              <div className="fortune-card info-box fade-in">
                <p>Click on the crystal ball to reveal your fate</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}