// const fs = require('fs/promises');
// const path = require('path');

import * as fs from 'fs/promises';
import * as path from 'path';
import * as core from '@actions/core';

const main = async () => {
  const threshold = core.getInput('threshold');

  const filePath = path.resolve('./coverage/coverage-summary.json');
  const contents = await fs.readFile(filePath, { encoding: 'utf8' });
  const jsonSummary = JSON.parse(contents);

  const totalLinesCoverage = jsonSummary.total.lines.pct;
  if (Number(totalLinesCoverage) < Number(threshold)) {
    core.setFailed(`Line coverage below ${threshold}% threshold`);
  }
  await core.summary
    .addRaw(`${totalLinesCoverage}% of lines covered :white_check_mark:`)
    .write({ overwrite: true });
};

main().catch((err) => core.setFailed(`Action failed with error ${err}`));
