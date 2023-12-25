import { useQuiz } from "../contexts/QuizContext";

export const Progress = () => {
  const { numberOfQuestions, questionIndex, points, maxPoints, answer } =
    useQuiz();
  return (
    <header className="progress">
      <progress
        max={numberOfQuestions}
        value={questionIndex + Number(answer !== null)}
      ></progress>
      <p>
        Question <strong>{questionIndex + 1}</strong> / {numberOfQuestions}
      </p>
      <p>
        <strong>{points}</strong> / {maxPoints} points
      </p>
    </header>
  );
};
