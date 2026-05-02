import { useMemo, useState, useEffect } from 'react';
import { QUIZ } from '../data/electionData.js';
import confetti from 'canvas-confetti';

function Quiz() {
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState(Array(QUIZ.length).fill(undefined));
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    if (quizFinished) {
      const scorePercentage = Math.round((quizScore / QUIZ.length) * 100);
      if (scorePercentage >= 60) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#1b3a6b', '#7EA8E8', '#ffffff']
        });
      }
    }
  }, [quizFinished]);

  const quizScore = useMemo(() => {
    return quizAnswers.reduce((acc, ans, idx) => {
      return ans === QUIZ[idx].ans ? acc + 1 : acc;
    }, 0);
  }, [quizAnswers]);

  const handleAnswer = (optionIndex) => {
    if (quizFinished || quizAnswers[quizIndex] !== undefined) return;
    setQuizAnswers((prev) => {
      const next = [...prev];
      next[quizIndex] = optionIndex;
      return next;
    });
  };

  const navigateQuiz = (direction) => {
    if (direction > 0 && quizIndex === QUIZ.length - 1) {
      setQuizFinished(true);
      return;
    }
    setQuizIndex((prev) => Math.max(0, Math.min(QUIZ.length - 1, prev + direction)));
  };

  const restartQuiz = () => {
    setQuizFinished(false);
    setQuizIndex(0);
    setQuizAnswers(Array(QUIZ.length).fill(undefined));
  };

  const currentQuiz = QUIZ[quizIndex];
  const selectedAnswer = quizAnswers[quizIndex];
  const isAnswered = selectedAnswer !== undefined;

  return (
    <section className="panel active" aria-labelledby="quizTitle">
      <h2 id="quizTitle" className="sr-only">Knowledge Quiz</h2>
      
      {!quizFinished ? (
        <div id="quizMain">
          <div className="quiz-prog-wrap">
            <div className="quiz-prog-bar" role="progressbar" aria-label="Quiz Progress">
              {QUIZ.map((_, index) => (
                <div 
                  key={index} 
                  className={`qseg ${index < quizIndex ? 'done' : index === quizIndex ? 'active' : ''}`} 
                />
              ))}
            </div>
            <div className="quiz-progress-labels">
              <span>Score: {quizScore} / {quizAnswers.filter(a => a !== undefined).length}</span>
              <span>Question {quizIndex + 1} of {QUIZ.length}</span>
            </div>
          </div>

          <article className="q-card">
            <div className="q-num">Question {quizIndex + 1}</div>
            <h3 className="q-text">{currentQuiz.q}</h3>
            <div className="options">
              {currentQuiz.opts.map((opt, index) => {
                const isCorrect = currentQuiz.ans === index;
                const isSelected = selectedAnswer === index;
                let classes = 'opt-btn';
                if (isAnswered) {
                  if (isCorrect) classes += ' correct';
                  else if (isSelected) classes += ' wrong';
                }
                return (
                  <button 
                    key={opt} 
                    type="button" 
                    className={classes} 
                    onClick={() => handleAnswer(index)} 
                    disabled={isAnswered}
                    aria-label={`${opt} ${isAnswered && isCorrect ? '(Correct)' : isAnswered && isSelected ? '(Wrong)' : ''}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            
            {isAnswered && (
              <div className="q-explain" aria-live="polite">
                <p><strong>{selectedAnswer === currentQuiz.ans ? 'Correct!' : 'Incorrect.'}</strong></p>
                <p>{currentQuiz.exp}</p>
              </div>
            )}
          </article>

          <div className="quiz-nav">
            <button 
              className="qnav-btn" 
              type="button" 
              onClick={() => navigateQuiz(-1)} 
              disabled={quizIndex === 0}
            >
              ← Back
            </button>
            <button 
              className="qnav-btn primary" 
              type="button" 
              onClick={() => navigateQuiz(1)} 
              disabled={!isAnswered}
            >
              {quizIndex === QUIZ.length - 1 ? 'Finish' : 'Next →'}
            </button>
          </div>
        </div>
      ) : (
        <article className="score-screen">
          <div className="score-big">{quizScore}</div>
          <div className="score-label">out of {QUIZ.length}</div>
          <div className="score-msg">
            {Math.round((quizScore / QUIZ.length) * 100) >= 80
              ? 'Excellent! You know your elections well.'
              : Math.round((quizScore / QUIZ.length) * 100) >= 60
              ? 'Good job! Keep learning about Indian democracy.'
              : 'Keep practicing — every citizen should know how elections work!'}
          </div>
          <button className="qnav-btn primary" type="button" onClick={restartQuiz}>
            Retake Quiz
          </button>
        </article>
      )}
    </section>
  );
}

export default Quiz;
