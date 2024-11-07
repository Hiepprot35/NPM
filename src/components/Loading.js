
export const IsLoading = ({ className, text }) => {
  return (
    <div className={`Loading_container center flex-col ${className}`}>
      <div className="loader bg-text"></div>
      <div className="loading04 p-10">
        {text.split(" ").map((word, index) => (
          <span key={index} className="word-span">
            {word}{" "}
          </span>
        ))}
      </div>
    </div>
  );
};
