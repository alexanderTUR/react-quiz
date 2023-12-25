import { Options } from "./Options";
import { useQuiz } from "../contexts/QuizContext";

export const Question = () => {
  const { question } = useQuiz();
  return (
    <div>
      <h4> {question.question}</h4>
      <Options />
    </div>
  );
};
