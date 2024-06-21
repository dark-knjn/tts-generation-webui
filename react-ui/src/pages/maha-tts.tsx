import React from "react";
import { Template } from "../components/Template";
import Head from "next/head";
import useLocalStorage from "../hooks/useLocalStorage";
import { AudioOutput } from "../components/AudioComponents";
import {
  MahaParams,
  MahaResult,
  useMahaParams,
  useMahaResult,
} from "../tabs/MahaParams";
import { HyperParameters } from "../components/HyperParameters";
import {
  extractTexts,
  getMax,
  incrementNonRandomSeed,
  initialHyperParams,
} from "../data/hyperParamsUtils";
import { useInterrupt } from "../hooks/useInterrupt";
import { manageProgress } from "../components/Progress";
import { parseFormChange } from "../data/parseFormChange";
import { barkFavorite } from "../functions/barkFavorite";
import { MahaInputs } from "../components/MahaInputs";
import { generateWithMaha } from "../functions/generateWithMaha";
import { GenerationHistorySimple } from "../components/GenerationHistory";

const initialHistory = []; // prevent infinite loop
const MahaPage = () => {
  const [data, setData] = useMahaResult();
  const [historyData, setHistoryData] = useLocalStorage<MahaResult[]>(
    "mahaHistory",
    initialHistory
  );
  const [mahaParams, setMahaParams] = useMahaParams();
  const [hyperParams, setHyperParams] = useLocalStorage<
    typeof initialHyperParams
  >("mahaHyperParams", initialHyperParams);

  const { interrupted, resetInterrupt, interrupt } = useInterrupt();
  const [progress, setProgress] = React.useState({ current: 0, max: 0 });

  function mahaWithProgress() {
    const texts = extractTexts(mahaParams.maha_tts_input, hyperParams);
    const { iterations } = hyperParams;

    return manageProgress(
      ({ incrementProgress }) =>
        mahaConsumer(
          mahaGenerator(texts, iterations, mahaParams),
          incrementProgress
        ),
      getMax(texts, iterations),
      setProgress
    );
  }

  async function* mahaGenerator(
    texts: string[],
    iterations: number,
    mahaParams: MahaParams
  ) {
    for (let iteration = 0; iteration < iterations; iteration++) {
      for (const text of texts) {
        if (interrupted.current) {
          return;
        }
        yield generateWithMaha({
          ...mahaParams,
          maha_tts_input: text,
          seed: incrementNonRandomSeed(mahaParams.seed, iteration),
        });
      }
    }
  }

  async function mahaConsumer(
    generator: AsyncGenerator<MahaResult, void, unknown>,
    callback: (result: MahaResult) => void
  ) {
    for await (const result of generator) {
      setData(result);
      setHistoryData((x) => [result, ...x]);
      callback(result);
    }
  }

  const maha = resetInterrupt(mahaWithProgress);
  const handleChange = parseFormChange(setMahaParams);

  const useSeed = (_url: string, data?: MahaResult) => {
    const seed = data?.metadata?.seed;
    if (!seed) return;
    setMahaParams({
      ...mahaParams,
      seed: Number(seed),
    });
  };

  const useParameters = (_url: string, data?: MahaResult) => {
    const params = data?.metadata;
    if (!params) return;
    setMahaParams({
      ...mahaParams,
      ...params,
      seed: Number(params.seed),
    });
  };

  const funcs = {
    favorite: barkFavorite,
    useSeed,
    useParameters,
  };
  return (
    <Template>
      <Head>
        <title>Maha - TTS Generation Webui</title>
      </Head>
      <div className="gap-y-4 p-4 flex w-full flex-col">
        <MahaInputs
          mahaParams={mahaParams}
          handleChange={handleChange}
          setMahaParams={setMahaParams}
          data={data}
        />

        <div className="flex flex-row gap-2">
          <AudioOutput
            audioOutput={data?.audio}
            label="Maha Output"
            funcs={funcs}
            metadata={data}
            filter={["sendToMaha"]}
          />
          <div className="flex flex-col gap-2">
            <HyperParameters
              params={hyperParams}
              setParams={setHyperParams}
              interrupt={interrupt}
              isInterrupted={interrupted.current}
              progress={progress.current}
              progressMax={progress.max}
            />

            <button
              className="border border-gray-300 p-2 rounded font-medium"
              onClick={maha}
            >
              Generate
            </button>
          </div>
        </div>

        <GenerationHistorySimple
          name="maha"
          setHistoryData={setHistoryData}
          historyData={historyData}
          funcs={funcs}
          nameKey={undefined}
          filter={["sendToMaha"]}
        />
      </div>
    </Template>
  );
};

export default MahaPage;
