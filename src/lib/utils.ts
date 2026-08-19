export type Nullable<T> = T | null | undefined;

export interface BeforeInstallPromptEvent extends Event {
  // these are also included on the event, but
  // readonly platforms: string[];
  // readonly userChoice: Promise<{
  //   outcome: 'accepted' | 'dismissed';
  //   platform: string;
  // }>;
  prompt(): Promise<void>;
}

export const MULT_MATH = '*';
export const PLUS_MATH = '+';
export const MULT = '×';
export const PLUS = '+';

const THREE_DART_MAX = 180;
const IMPOSSIBLE_THREE_DART_SCORES = [163, 166, 169, 172, 173, 175, 176, 178, 179];

export const LEGS_STRIKE = '❌';
export const LEGS_ELIMINATION = '💀';
export const LEGS_SCORE = '✅';
export const LEGS_ACTIVE_INDICATOR = '⭐';

export const SHANGHAI_ACTIVE_INDICATOR = '⭐';

export const ROULETTE_ACTIVE_INDICATOR = '⭐';

export const runningInStandalone = (): boolean => {
  // see https://developer.mozilla.org/en-US/docs/Web/API/Navigator for notes on
  // Navigator.standalone property: "Available on Apple's iOS Safari only." at time of writing
  // NB: casting because the TS compiler reasonably doesn't see this as standard
  const navigator = window.navigator as typeof window.navigator & { standalone: boolean };
  const navigatorStandalone = !!navigator.standalone;

  // test dom doesn't seem to include the window.matchMedia methood, so this needs to be mocked in
  // the test suite; the display-mode query isn't supported by firefox specifically at time of
  // writing per:
  // https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/display-mode
  const { matchMedia } = window;
  const mediaQueryStandalone = matchMedia('(display-mode: standalone)').matches;

  return [navigatorStandalone, mediaQueryStandalone].some(Boolean);
};

export const runningOnIOS = (): boolean => {
  return !!window.navigator.userAgent.match(/iPhone|iPod|iPad/);
};

export const hasBeforeInstallPromptEvent = (): boolean => {
  const castWindow = window as typeof window & { BeforeInstallPromptEvent: unknown };
  return !!castWindow.BeforeInstallPromptEvent;
};

export const formatEvalString = (evalString: string) => {
  const tokens = evalString.match(/\d+|\+|\*/g) || [];
  const result = [];
  let i = 0;

  while (i < tokens.length) {
    // look ahead for multiplication operator
    if (tokens[i + 1] === MULT_MATH) {
      // look for multiplicand and parenthesize
      if (tokens[i + 2] ?? null) {
        result.push('(' + tokens[i] + MULT + tokens[i + 2] + ')');
        i += 3;
        // otherwise push friendly operator
      } else {
        result.push(tokens[i] + MULT);
        i += 2;
      }
      // addition is easy - just push the operator
    } else if (tokens[i] === PLUS_MATH) {
      result.push(` ${PLUS} `);
      i++;
      // otherwise just push the number
    } else {
      result.push(tokens[i]);
      i++;
    }
  }
  return result.join('');
};

export const roundNumber = (value: number, places: number = 0): number =>
  // @ts-expect-error doing some base-10 exponential/scientific notation magick here
  +(Math.round(value + 'e+' + places) + 'e-' + places);

export const validateLegsScore = (score: number) => {
  return score < THREE_DART_MAX && !IMPOSSIBLE_THREE_DART_SCORES.includes(score);
};
