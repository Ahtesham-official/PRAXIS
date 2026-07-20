import React from 'react';
import { FaCheck } from "react-icons/fa6";
import { ImSpinner2 } from "react-icons/im";

export default function PipelineModal({ currentStep, pipelineSteps }) {
  const isLastStep = currentStep === pipelineSteps.length - 1;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.3)] p-8 border border-gray-100 flex flex-col items-center text-center animate-fade-in">
        <div className="relative mb-6 flex items-center justify-center">
          {isLastStep ? (
            <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white text-2xl shadow-lg animate-scale-up">
              <FaCheck />
            </div>
          ) : (
            <>
              <ImSpinner2 className="w-16 h-16 text-black animate-spin" />
              <div className="absolute w-3 h-3 bg-black rounded-full animate-ping" />
            </>
          )}
        </div>

        <h3 className="text-2xl font-extrabold text-black tracking-tight transition-all duration-300">
          {isLastStep ? "Initialization Ready" : "Ingesting Environment"}
        </h3>
        <p className="text-gray-500 text-sm mt-1 max-w-xs h-10">
          {pipelineSteps[currentStep]}
        </p>

        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-4 mb-6 border border-gray-200">
          <div 
            className="h-full bg-black rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / pipelineSteps.length) * 100}%` }}
          />
        </div>

        <div className="w-full bg-gray-900 text-left p-4 rounded-2xl border border-gray-800 font-mono text-xs space-y-1.5 shadow-inner">
          {pipelineSteps.slice(0, currentStep + 1).map((step, index) => (
            <div 
              key={index} 
              className={`flex items-center gap-2 tracking-wide transition-all ${
                index === currentStep ? 'text-white font-bold' : 'text-gray-500'
              }`}
            >
              <span>&gt;</span>
              <span>{index === pipelineSteps.length - 1 ? step : `${step.replace("...", "")} [OK]`}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}