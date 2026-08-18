export const GameHeader = ({
  score,
  moves,
  timer,
  difficulty,
  setDifficulty,
  theme,
  setTheme,
  onReset,
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="game-header">
      <h1>🎮 Memory Card Game</h1>

      <div className="controls">
        <div className="control-group">
          <label>Difficulté :</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Facile (6 paires)</option>
            <option value="medium">Moyen (8 paires)</option>
            <option value="hard">Difficile (12 paires)</option>
            <option value="expert">Expert (18 paires)</option>
          </select>
        </div>

        <div className="control-group">
          <label>Thème :</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="fruits">🍎 Fruits</option>
            <option value="animals">🐱 Animaux</option>
            <option value="food">🍕 Nourriture</option>
            <option value="flags">🏳️‍🌈 Drapeaux</option>
          </select>
        </div>
      </div>

      <div className="stats">
        <div className="stat-item">
          <span className="stat-label">Score:</span> <span className="stat-value">{score}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Moves:</span> <span className="stat-value">{moves}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Time:</span> <span className="stat-value">{formatTime(timer)}</span>
        </div>
      </div>

      <button className="reset-btn" onClick={onReset}>
        New Game
      </button>
    </div>
  );
};