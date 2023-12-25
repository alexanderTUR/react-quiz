import { useQuiz } from "../contexts/QuizContext";

export const StartScreen = () => {
  const { questions, dispatch } = useQuiz();
  const numberOfQuestions = questions.length;
  return (
    <div className="start">
      <h2>Welcome to The React Quiz!</h2>
      <h3>{numberOfQuestions} questions to test your React knowledge!</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "START" })}
      >
        Let's start
      </button>
    </div>
  );
};
