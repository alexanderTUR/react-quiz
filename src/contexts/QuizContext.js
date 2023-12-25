import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();

const SECONDS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  //loading, error, ready, active, finished
  status: "loading",
  questionIndex: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "GET_QUESTIONS":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "START":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECONDS_PER_QUESTION,
      };
    case "ANSWER":
      const question = state.questions.at(state.questionIndex);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "NEXT":
      return {
        ...state,
        questionIndex: state.questionIndex + 1,
        answer: null,
      };
    case "FINISH":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "RESTART":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
      };
    case "RESET":
      return {
        ...state,
        score: 0,
        questionNumber: 0,
        showAnswers: false,
        currentQuestion: null,
      };
    case "ERROR":
      return {
        ...state,
        status: "error",
      };
    case "TICK":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    default:
      return state;
  }
};

export const QuizProvider = ({ children }) => {
  const [
    {
      questions,
      status,
      questionIndex,
      answer,
      points,
      highscore,
      secondsRemaining,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numberOfQuestions = questions.length;
  const maxPoints = questions.reduce(
    (acc, question) => acc + question.points,
    0,
  );
  const question = questions[questionIndex];

  useEffect(() => {
    fetch("http://localhost:3002/questions")
      .then((res) => res.json())
      .then((data) =>
        dispatch({
          type: "GET_QUESTIONS",
          payload: data,
        }),
      )
      .catch((err) =>
        dispatch({
          type: "ERROR",
        }),
      );
  }, []);

  return (
    <QuizContext.Provider
      value={{
        questions,
        question,
        numberOfQuestions,
        status,
        questionIndex,
        answer,
        points,
        maxPoints,
        highscore,
        secondsRemaining,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};
