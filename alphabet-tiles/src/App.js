import React, { useState } from "react";

const App = () => {
  const [outputString, setOutputString] = useState("");

  const handleClick = (letter) => {
    setOutputString((prevString) => {
      const newString = prevString + letter;
      const lastThree = newString.slice(-3);

      if (
        lastThree.charAt(0) === lastThree.charAt(1) &&
        lastThree.charAt(1) === lastThree.charAt(2)
      ) {
        return newString.slice(0, -3) + "_";
      }

      const consecutiveCount = newString.split(letter).length - 1;
      if (consecutiveCount > 3) {
        return newString.slice(-1);
      }

      return newString;
    });
  };

  const tiles = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  ); // Generate letters A-Z

  return (
    <div className="py-10 px-20 h-screen ">
      <div className="grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 gap-2">
        {tiles.map((letter) => (
          <button
            key={letter}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
            onClick={() => handleClick(letter)}
          >
            {letter}
          </button>
        ))}
      </div>
      <div className=" mt-10">
        <span className="font-bold">Output: </span>
        <span id="outputString" className="ml-2">
          {outputString}
        </span>
      </div>
    </div>
  );
};

export default App;
