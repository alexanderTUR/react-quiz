import Header from "./components/Header";
import { Main } from "./components/Main";
import { useEffect, useReducer } from "react";
import Loader from "./components/Loader";
import Error from "./components/Error";
import { StartScreen } from "./components/StartScreen";
import { Question } from "./components/Question";

const initialState = {
  questions: [],
  //loading, error, ready, active, finished
  status: "loading",
  questionIndex: 0,
  answer: null,
  points: 0,
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
    default:
      return state;
  }
};

function App() {
  const [{ questions, status, questionIndex, answer }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  const numberOfQuestions = questions.length;

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
          <Question
            question={questions[questionIndex]}
            dispatch={dispatch}
            answer={answer}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
