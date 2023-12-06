import { useEffect, useReducer } from "react";

import { Header } from "./components/Header";
import { Main } from "./components/Main";
import { Footer } from "./components/Footer";
import { Loader } from "./components/Loader";
import { Error } from "./components/Error";
import { StartScreen } from "./components/StartScreen";
import { Question } from "./components/Question";
import { NextButton } from "./components/NextButton";
import { Progress } from "./components/Progress";
import { FinishScreen } from "./components/FinishScreen";
import { Timer } from "./components/Timer";

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

function App() {
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
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen
            numberOfQuestions={numberOfQuestions}
            dispatch={dispatch}
          />
        )}
        {status === "active" && (
          <>
            <Progress
              questionIndex={questionIndex}
              numberOfQuestions={numberOfQuestions}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Question
              question={questions[questionIndex]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                questionIndex={questionIndex}
                numberOfQuestions={numberOfQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
