import React from "react";
import { BarkGenerationParams } from "../tabs/BarkGenerationParams";
import { BarkResult } from "../tabs/BarkResult";
import { BarkVoice } from "./BarkVoice";
import { BarkSeed } from "./BarkSeed";
import { BurnInPrompt, BarkPrompt } from "./BarkPrompt";
import { TextTemperature, WaveformTemperature } from "./BarkTemperatureSlider";
import { OldGeneration, HistoryPromptSemantic } from "./BarkOldGeneration";
import {
  HistoryPromptVoiceSetting,
  PromptType,
  ForEachSubsequentGeneration,
} from "./BarkRadios";

export const BarkInputs = ({
  barkGenerationParams,
  setBarkVoiceGenerationParams,
  handleChange,
  data,
}: {
  barkGenerationParams: BarkGenerationParams;
  setBarkVoiceGenerationParams: (
    barkGenerationParams: BarkGenerationParams
  ) => void;
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => void;
  data: BarkResult | null;
}) => (
  <div className="flex flex-col space-y-2">
    <div className="space-y-2">
      <HistoryPromptVoiceSetting
        barkGenerationParams={barkGenerationParams}
        handleChange={handleChange}
      />
    </div>
    <div className="flex flex-row space-x-2">
      <div className="space-y-2 flex flex-col w-1/2">
        {barkGenerationParams.history_setting === "or Use a voice:" && (
          <BarkVoice
            barkGenerationParams={barkGenerationParams}
            handleChange={handleChange}
          />
        )}
        {barkGenerationParams.history_setting ===
          "or Use old generation as history:" && (
          <div className="flex flex-col border border-gray-300 p-2 rounded space-y-2">
            <OldGeneration
              barkGenerationParams={barkGenerationParams}
              handleChange={handleChange}
            />
            <HistoryPromptSemantic
              barkGenerationParams={barkGenerationParams}
              handleChange={handleChange}
            />
          </div>
        )}
      </div>
      <div className="space-y-2 w-1/2">
        <div className="flex flex-col space-y-2 border border-gray-300 p-2 rounded">
          <PromptType
            barkGenerationParams={barkGenerationParams}
            handleChange={handleChange}
          />
          <ForEachSubsequentGeneration
            barkGenerationParams={barkGenerationParams}
            handleChange={handleChange}
          />
          <TextTemperature
            barkGenerationParams={barkGenerationParams}
            handleChange={handleChange}
          />
          <WaveformTemperature
            barkGenerationParams={barkGenerationParams}
            handleChange={handleChange}
          />
        </div>
        <BarkSeed
          barkGenerationParams={barkGenerationParams}
          setBarkVoiceGenerationParams={setBarkVoiceGenerationParams}
          handleChange={handleChange}
          lastSeed={data?.json_text?.seed}
        />
      </div>
    </div>
    <BurnInPrompt
      barkGenerationParams={barkGenerationParams}
      handleChange={handleChange}
    />
    <BarkPrompt
      barkGenerationParams={barkGenerationParams}
      handleChange={handleChange}
    />
  </div>
);
