import * as fs from 'fs/promises';
import * as path from 'path';
import * as core from '@actions/core';
import * as github from '@actions/github';
import { badgen } from 'badgen';

/*
  - use core to get summary input
  - use path to resolve summary input path
  - use fs to read the summary and JSON.parse to deserialize
  - get the total lines covered from summary data
  - persist percentage with core.setOutput *OR* write to file *OR* just make the badge in here
*/

const main = async () => {
  const summary = core.getInput('summary');
  const summaryPath = path.resolve(summary);
  const summaryContent = await fs.readFile(summaryPath, { encoding: 'utf8' });
  const coverage = JSON.parse(summaryContent);

  const lines = coverage.total.lines.pct;

  let statusColor = 'red';
  if (lines >= 70) statusColor = 'orange'
  if (lines >= 80) statusColor = 'yellow'
  if (lines >= 90) statusColor = 'green'

  const svgString = badgen({
    label: 'Coverage',
    status: `${lines}%`,
    color: statusColor,
  });

  await fs.writeFile('./coverage.svg', svgString);
};

main().catch((err) => core.setFailed(`Action failed with error ${err}`));
