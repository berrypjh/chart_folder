import { releaseVersion, releaseChangelog, releasePublish } from 'nx/release';

const main = async () => {
  const isFirstRelease = process.argv.includes('--first-release');

  const { workspaceVersion, projectsVersionData, releaseGraph } = await releaseVersion({
    firstRelease: isFirstRelease,
  });

  await releaseChangelog({
    versionData: projectsVersionData,
    version: workspaceVersion,
    releaseGraph,
    firstRelease: isFirstRelease,
  });

  const publishResult = await releasePublish({
    releaseGraph,
    registry: 'https://registry.npmjs.org/',
    access: 'public',
    firstRelease: isFirstRelease,
  });

  const allOk = Object.values(publishResult).every((result) => result.code === 0);

  process.exit(allOk ? 0 : 1);
};

main().catch((error) => {
  console.error('예상치 못한 오류 발생 (npm 배포):', error);
  process.exit(1);
});
