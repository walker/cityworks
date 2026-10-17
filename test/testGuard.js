const shouldRunBefore = (suiteName) => {
  const argv = process.argv.slice(2);
  const patterns = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '-g' || arg === '--grep') {
      const nextArg = argv[i + 1] || '';
      if (nextArg) patterns.push(nextArg);
    } else if (arg.startsWith('--grep=')) {
      patterns.push(arg.split('=').slice(1).join('='));
    }
  }

  const grepValue = patterns.join(' ').toLowerCase();
  if (!grepValue) return true;

  return grepValue.includes(String(suiteName || '').toLowerCase());
};

module.exports = { shouldRunBefore };
