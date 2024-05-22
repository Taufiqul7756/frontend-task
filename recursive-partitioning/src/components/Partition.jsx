import React, { useState, useRef, useEffect } from "react";
import { getRandomColor } from "./RandomColor";

const PartitionTest = ({
  color = getRandomColor(),
  hasSplitParent = false,
}) => {
  const [isSplit, setIsSplit] = useState(false);
  const [isVertical, setIsVertical] = useState(true);
  const [size, setSize] = useState(50);
  const [childPartitions, setChildPartitions] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [hasSplit, setHasSplit] = useState(hasSplitParent);
  const containerRef = useRef(null);

  const handleSplit = (vertical) => {
    setIsSplit(true);
    setIsVertical(vertical);
    setHasSplit(true);
    const newChild1 = { id: Date.now(), color };
    const newChild2 = { id: newChild1.id + 1, color: getRandomColor() };
    setChildPartitions([newChild1, newChild2]);
  };

  const handleRemove = () => {
    setIsVisible(false);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      let newSize;
      if (isVertical) {
        newSize = ((e.clientX - rect.left) / rect.width) * 100;
      } else {
        newSize = ((e.clientY - rect.top) / rect.height) * 100;
      }

      // Snap to nearest 1/4, 1/2, 3/4
      const snapPoints = [25, 50, 75];
      const closestSnapPoint = snapPoints.reduce((prev, curr) => {
        return Math.abs(curr - newSize) < Math.abs(prev - newSize)
          ? curr
          : prev;
      }, 0);

      if (Math.abs(newSize - closestSnapPoint) < 5) {
        newSize = closestSnapPoint;
      }

      setSize(newSize);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`flex relative border ${isVisible ? "block" : "hidden"}`}
      ref={containerRef}
      style={{
        backgroundColor: color,
        flex: `${size} ${size} auto`,
      }}
    >
      {!isSplit ? (
        <div className="w-full flex justify-center items-center gap-2">
          <button
            className="hover:bg-green-700 px-4 py-1 bg-green-500 rounded font-bold text-white"
            onClick={() => handleSplit(true)}
          >
            V
          </button>
          <button
            className="hover:bg-blue-700 px-4 py-1 bg-blue-500 font-bold rounded text-white"
            onClick={() => handleSplit(false)}
          >
            H
          </button>
          {hasSplit && (
            <button
              className="hover:bg-red-700 px-4 py-1 bg-red-500 rounded font-bold text-white"
              onClick={handleRemove}
            >
              -
            </button>
          )}
        </div>
      ) : (
        <div
          className={`flex w-full h-full ${
            isVertical ? "flex-row" : "flex-col"
          }`}
        >
          {childPartitions.map((child, index) => (
            <React.Fragment key={child.id}>
              <PartitionTest color={child.color} hasSplitParent={hasSplit} />
              {index === 0 && (
                <div
                  className={`bg-black opacity-50 z-10 relative ${
                    isVertical
                      ? "w-1 cursor-col-resize"
                      : "h-1 cursor-row-resize"
                  }`}
                  onMouseDown={handleMouseDown}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartitionTest;
