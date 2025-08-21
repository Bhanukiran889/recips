const StarRating = ({ value, max = 5 }) => {
  return (
    <div className="flex">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < value ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
