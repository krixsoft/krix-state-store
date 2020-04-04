/* eslint-disable @typescript-eslint/explicit-function-return-type */
const LinfraArbiter = require(`@linfra/arbiter`);

async function prepareLinfraArbiter () {
  const arbiter = LinfraArbiter.LernaArbiter.create();
  await arbiter.setLernaRepositories([
    `.`,
  ]);
  return arbiter;
}

exports[`pkg:linfra:build`] = async function prodLinfraBuild (done) {
  const arbiter = await prepareLinfraArbiter();

  await arbiter.buildLinfraModules({
    concurrencyConfig: {
      buildLevel: 2,
    },
    commandConfig: {
      buildCommand: 'npm run pkg:build',
    },
  });
};

exports[`dev:linfra:build`] = async function linfraBuild (done) {
  const arbiter = await prepareLinfraArbiter();

  await arbiter.buildLinfraModules({
    concurrencyConfig: {
      buildLevel: 2,
    },
  });
};
