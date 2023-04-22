import React, { useEffect, useRef } from "react";
import { DownArrow } from "../AppIcons";
import { MultiSelect } from "../types/types";

export function MultiSelectField({
  currentAnswer,
  currentQuestion,
  setCurrentAnswerCB,
}: {
  currentAnswer: string | string[];
  currentQuestion: MultiSelect;
  setCurrentAnswerCB: (options: string[]) => void;
}) {
  const optionDiv = useRef<HTMLDivElement>(null);
  const addOption = (option: string) => {
    if (Array.isArray(currentAnswer)) {
      if (!currentAnswer.includes(option))
        setCurrentAnswerCB([...currentAnswer, option]);
      else setCurrentAnswerCB(currentAnswer.filter((ans) => ans !== option));
    }
  };

  useEffect(() => {
    setCurrentAnswerCB([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isOptionSelected = (option: string) => {
    if (Array.isArray(currentAnswer)) {
      return currentAnswer.includes(option);
    }
  };

  const areAllOptionsSelected = () => {
    return (
      currentQuestion.kind === "multiselect" &&
      Array.isArray(currentAnswer) &&
      JSON.stringify(currentAnswer.sort()) ===
        JSON.stringify(currentQuestion.options.map((opt) => opt.option).sort())
    );
  };

  return (
    <div className="rounded-md border block flex-1 min-w-0 w-full text-sm p-2.5 bg-gray-100 border-gray-600 placeholder-gray-400 focus:ring-gray-500 focus:border-gray-500">
      <button
        className="w-full flex justify-between"
        onClick={() =>
          optionDiv.current?.classList.contains("hidden")
            ? optionDiv.current?.classList.remove("hidden")
            : optionDiv.current?.classList.add("hidden")
        }
      >
        <span>Select multiple options</span>
        <DownArrow className={"w-5 h-5"} />
      </button>
      <div
        id={`q-${currentQuestion.id}`}
        className="py-2 hidden flex flex-col gap-2"
        ref={optionDiv}
      >
        <button
          onClick={() =>
            !areAllOptionsSelected()
              ? setCurrentAnswerCB(
                  currentQuestion.options.map((option) => option.option)
                )
              : setCurrentAnswerCB([])
          }
          className={`text-start border-2 font-semibold rounded-md px-2 py-1 ${
            areAllOptionsSelected()
              ? "border-green-500 text-green-500"
              : "border-black"
          }`}
        >
          {areAllOptionsSelected() ? "Deselect all" : "Select all"}
        </button>
        {currentQuestion.options.map((option) => (
          <div
            key={option.id}
            onClick={() => addOption(option.option)}
            className={`cursor-pointer border-2 font-semibold rounded-md px-2 py-1 ${
              isOptionSelected(option.option)
                ? "text-green-500 border-green-500"
                : "border-gray-600"
            }`}
          >
            <label>{option.option}</label>
          </div>
        ))}
      </div>
    </div>
  );
}