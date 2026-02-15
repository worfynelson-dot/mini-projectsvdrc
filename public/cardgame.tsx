import { useState, useEffect } from 'react';
import { Card, CardContent } from '/components/ui/card';
import { Button } from '/components/ui/button';
import { Sparkles, Heart, Star, Zap, Trophy, Sun, Moon, Cloud, Timer, Award, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '/components/ui/select';

const icons = [
  { id: 1, Icon: Heart, color: 'text-red-500' },
  { id: 2, Icon: Star, color: 'text-yellow-500' },
  { id: 3, Icon: Zap, color: 'text-blue-500' },
  { id: 4, Icon: Trophy, color: 'text-amber-500' },
  { id: 5, Icon: Sun, color: 'text-orange-500' },
  { id: 6, Icon: Moon, color: 'text-purple-500' },
  { id: 7, Icon: Cloud, color: 'text-cyan-500' },
  { id: 8, Icon: Sparkles, color: 'text-pink-500' },
];

export default function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bestScore, setBestScore] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [soundOn, setSoundOn] = useState(true);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  useEffect(() => {
    let interval;
    if (isPlaying && !gameWon) {
      interval = setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gameWon]);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameWon(true);
      setIsPlaying(false);
      if (!bestScore || time < bestScore) {
        setBestScore(time);
      }
    }
  }, [matched, cards]);

  const getDifficultyCards = () => {
    if (difficulty === 'easy') return icons.slice(0, 4);
    if (difficulty === 'medium') return icons.slice(0, 6);
    return icons;
  };

  const initializeGame = () => {
    const selectedIcons = getDifficultyCards();
    const shuffledCards = [...selectedIcons, ...selectedIcons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ ...icon, uniqueId: index }));
    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
    setTime(0);
    setIsPlaying(false);
    setStreak(0);
  };

  const handleCardClick = (uniqueId) => {
    if (!isPlaying) setIsPlaying(true);
    
    if (flipped.length === 2 || flipped.includes(uniqueId) || matched.includes(uniqueId)) {
      return;
    }

    const newFlipped = [...flipped, uniqueId];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      const firstCard = cards.find(c => c.uniqueId === first);
      const secondCard = cards.find(c => c.uniqueId === second);

      if (firstCard.id === secondCard.id) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > highestStreak) {
          setHighestStreak(newStreak);
        }
        setTimeout(() => {
          setMatched([...matched, first, second]);
          setFlipped([]);
        }, 600);
      } else {
        setStreak(0);
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const isFlipped = (uniqueId) => flipped.includes(uniqueId) || matched.includes(uniqueId);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getGridCols = () => {
    if (difficulty === 'easy') return 'grid-cols-4';
    if (difficulty === 'medium') return 'grid-cols-4';
    return 'grid-cols-4';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-white mb-3 flex items-center justify-center gap-3 drop-shadow-lg">
            <Sparkles className="text-yellow-300 animate-pulse" size={40} />
            Memory Match Pro
            <Sparkles className="text-yellow-300 animate-pulse" size={40} />
          </h1>
          <p className="text-white text-lg drop-shadow">Match all pairs as fast as you can!</p>
        </div>

        {/* Stats Panel */}
        <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-xl p-6 mb-6 shadow-2xl border border-white border-opacity-30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white bg-opacity-30 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-2 text-white font-semibold mb-1">
                <RotateCcw size={18} />
                <span>Moves</span>
              </div>
              <div className="text-2xl font-bold text-white">{moves}</div>
            </div>
            
            <div className="bg-white bg-opacity-30 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-2 text-white font-semibold mb-1">
                <Timer size={18} />
                <span>Time</span>
              </div>
              <div className="text-2xl font-bold text-white">{formatTime(time)}</div>
            </div>
            
            <div className="bg-white bg-opacity-30 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-2 text-white font-semibold mb-1">
                <Zap size={18} />
                <span>Streak</span>
              </div>
              <div className="text-2xl font-bold text-yellow-300">{streak}🔥</div>
            </div>
            
            <div className="bg-white bg-opacity-30 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-2 text-white font-semibold mb-1">
                <Award size={18} />
                <span>Best</span>
              </div>
              <div className="text-2xl font-bold text-green-300">
                {bestScore ? formatTime(bestScore) : '--'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-white font-semibold">Difficulty:</span>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-32 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy (4)</SelectItem>
                  <SelectItem value="medium">Medium (6)</SelectItem>
                  <SelectItem value="hard">Hard (8)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => setSoundOn(!soundOn)} 
                variant="outline" 
                className="bg-white hover:bg-gray-100"
                size="icon"
              >
                {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </Button>
              
              <Button 
                onClick={initializeGame} 
                className="bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600 shadow-lg"
              >
                <RotateCcw className="mr-2" size={18} />
                New Game
              </Button>
            </div>
          </div>
        </div>

        {/* Win Message */}
        {gameWon && (
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-center p-6 rounded-xl mb-6 shadow-2xl animate-pulse border-4 border-yellow-300">
            <div className="text-4xl font-bold mb-2">🎉 Victory! 🎉</div>
            <div className="text-xl">
              Time: {formatTime(time)} | Moves: {moves} | Best Streak: {highestStreak}
            </div>
          </div>
        )}

        {/* Game Board */}
        <div className={`grid ${getGridCols()} gap-4`}>
          {cards.map((card) => {
            const { Icon } = card;
            const isCardFlipped = isFlipped(card.uniqueId);
            const isMatched = matched.includes(card.uniqueId);
            
            return (
              <Card
                key={card.uniqueId}
                onClick={() => handleCardClick(card.uniqueId)}
                className={`cursor-pointer transition-all duration-500 transform hover:scale-110 hover:rotate-3 shadow-xl ${
                  isCardFlipped 
                    ? 'bg-white rotate-y-180' 
                    : 'bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600'
                } ${isMatched ? 'opacity-60 scale-95' : ''} ${
                  flipped.includes(card.uniqueId) && !isMatched ? 'ring-4 ring-yellow-400' : ''
                }`}
              >
                <CardContent className="flex items-center justify-center h-28 p-0">
                  {isCardFlipped ? (
                    <Icon className={`${card.color} w-14 h-14 drop-shadow-lg`} strokeWidth={2.5} />
                  ) : (
                    <div className="text-white text-5xl font-bold drop-shadow-lg">?</div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* High Streak Badge */}
        {highestStreak >= 3 && (
          <div className="mt-6 text-center">
            <div className="inline-block bg-yellow-400 text-purple-900 px-6 py-3 rounded-full font-bold shadow-lg">
              🏆 Highest Streak: {highestStreak} matches!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
