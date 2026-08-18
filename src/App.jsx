import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { GameHeader } from "./components/GameHeader";
import { Card } from "./components/Card";
import { WinMessage } from "./components/WinMessage";

// Banques d'emojis par thème
const THEMES = {
  fruits: ["🍎", "🍌", "🍇", "🍊", "🍓", "🥝", "🍑", "🍒", "🍍", "🥑", "🍉", "🫐", "🍋", "🍐", "🍏", "🥭", "🥥", "🍈"],
  animals: ["🐶", "🐱", "🦊", "🦁", "🐼", "🐨", "🐸", "🐵", "🐯", "🐻", "🐰", "🐙", "🐬", "🦄", "🦉", "🦋", "🐝", "🐞"],
  food: ["🍕", "🍔", "🍟", "🌭", "🍿", "🍩", "🍦", "🌮", "🍣", "🥟", "🥨", "🥞", "🧇", "🧀", "🍪", "🎂", "🧁", "🍫"],
  flags: ["🇹🇳", "🇫🇷", "🇵🇸", "🇧🇷", "🇯🇵", "🇨🇦", "🇩🇪", "🇮🇹", "🇪🇸", "🇬🇧", "🇺🇸", "🇦🇷", "🇲🇦", "🇩🇿", "🇨🇭", "🇦🇺", "🇰🇷", "🇪🇬"]
};

// Configuration des difficultés
const DIFFICULTIES = {
  easy: { pairs: 6, columns: 4 },
  medium: { pairs: 8, columns: 4 },
  hard: { pairs: 12, columns: 6 },
  expert: { pairs: 18, columns: 6 },
};

const playSound = (type) => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === "flip") {
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } else if (type === "match") {
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } else if (type === "win") {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (i + 1) * 0.1);
      o.start(ctx.currentTime + i * 0.1);
      o.stop(ctx.currentTime + (i + 1) * 0.1);
    });
  }
};

function App() {
  const [difficulty, setDifficulty] = useState("medium");
  const [theme, setTheme] = useState("fruits");
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const timerRef = useRef(null);
  const targetPairs = DIFFICULTIES[difficulty].pairs;

  const shuffleCards = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeGame = () => {
    clearInterval(timerRef.current);

    // Sélectionner les symboles selon la difficulté et le thème
    const availableEmojis = THEMES[theme].slice(0, targetPairs);
    const deck = [...availableEmojis, ...availableEmojis];
    const shuffledValues = shuffleCards(deck);

    const initialCards = shuffledValues.map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(initialCards);
    setFlippedCards([]);
    setScore(0);
    setMoves(0);
    setTimer(0);
    setIsGameActive(false);
    setIsProcessing(false);
  };

  // Recommencer une partie lors du changement de réglages
  useEffect(() => {
    initializeGame();
    return () => clearInterval(timerRef.current);
  }, [difficulty, theme]);

  // Gestion du chrono et confettis de victoire
  useEffect(() => {
    if (isGameActive && score < targetPairs) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else if (score === targetPairs && targetPairs > 0) {
      clearInterval(timerRef.current);
      playSound("win");
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
    return () => clearInterval(timerRef.current);
  }, [isGameActive, score, targetPairs]);

  const handleCardClick = (clickedCard) => {
    if (
      isProcessing ||
      clickedCard.isFlipped ||
      clickedCard.isMatched ||
      flippedCards.length === 2
    ) {
      return;
    }

    if (!isGameActive) setIsGameActive(true);

    playSound("flip");

    const updatedCards = cards.map((card) =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );

    const newFlippedCards = [...flippedCards, clickedCard];
    setCards(updatedCards);
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);
      setIsProcessing(true);

      const [firstCard, secondCard] = newFlippedCards;

      if (firstCard.value === secondCard.value) {
        setTimeout(() => playSound("match"), 300);
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.value === firstCard.value ? { ...card, isMatched: true } : card
          )
        );
        setScore((prev) => prev + 1);
        setFlippedCards([]);
        setIsProcessing(false);
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
          setIsProcessing(false);
        }, 1000);
      }
    }
  };

  const isGameWon = score === targetPairs;

  return (
    <div className="app">
      <GameHeader
        score={score}
        moves={moves}
        timer={timer}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        theme={theme}
        setTheme={setTheme}
        onReset={initializeGame}
      />

      {isGameWon && <WinMessage moves={moves} />}

      <div
        className="cards-grid"
        style={{
          gridTemplateColumns: `repeat(${DIFFICULTIES[difficulty].columns}, 1fr)`,
        }}
      >
        {cards.map((card) => (
          <Card key={card.id} card={card} onClick={handleCardClick} />
        ))}
      </div>
    </div>
  );
}

export default App;