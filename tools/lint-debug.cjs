const path = require('path');
const eslintPath = path.resolve(__dirname, '..', 'backend', 'node_modules', 'eslint');
const { ESLint } = require(eslintPath);

(async () => {
  try {
    const eslint = new ESLint({
      cwd: path.resolve(__dirname, '..', 'backend'),
      useEslintrc: true,
      ignore: false,
    });

    const results = await eslint.lintFiles(['src/application/dto/application.dto.ts']);
      // Also print resolved config for the file to diagnose "no matching configuration".
      const config = await eslint.calculateConfigForFile('src/application/dto/application.dto.ts');
      console.log('resolvedConfigKeys:', Object.keys(config).sort());
      console.log(JSON.stringify(results, null, 2));
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    process.exitCode = 2;
  }
})();
