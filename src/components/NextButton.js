export const NextButton = ({
  dispatch,
  answer,
  questionIndex,
  numberOfQuestions,
}) => {
  if (answer === null) return null;
  if (questionIndex < numberOfQuestions - 1)
    return (
      <button className="btn btn-ui" onClick={() => dispatch({ type: "NEXT" })}>
        Next
      </button>
    );
  if (questionIndex === numberOfQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "FINISH" })}
      >
        Finish
      </button>
    );
};
