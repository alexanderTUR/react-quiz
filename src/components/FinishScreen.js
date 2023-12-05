export const FinishScreen = ({ points, maxPoints, highscore, dispatch }) => {
  const percentage = (points / maxPoints) * 100;
  let emoji;
  switch (true) {
    case percentage === 100:
      emoji = "🥳";
      break;
    case percentage >= 80:
      emoji = "😀";
      break;
    case percentage >= 60:
      emoji = "🙂";
      break;
    case percentage >= 40:
      emoji = "😐";
      break;
    case percentage >= 20:
      emoji = "😕";
      break;
    default:
      emoji = "😭";
  }
  return (
    <>
      <p className="result">
        <span>{emoji}</span>You scored <strong>{points}</strong> out of{" "}
        {maxPoints} ({Math.ceil(percentage)}%)
      </p>
      <p className="highscore">(Highscore: {highscore} points)</p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "RESTART" })}
      >
        Restart quiz
      </button>
    </>
  );
};
