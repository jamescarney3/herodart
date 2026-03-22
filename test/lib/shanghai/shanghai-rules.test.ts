import { describe, expect, it } from 'vitest';

import ShanghaiRules from '~/lib/shanghai/shanghai-rules';

describe('ShanghaiRules class', () => {
  it('instantiates', () => {
    const rules = new ShanghaiRules();
    expect(rules).toBeDefined();
  });
});
