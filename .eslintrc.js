module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: 'airbnb-base',
  rules: {
    'max-len': ['error', {
      'code': 140
    }],
    'no-console': ['off'],
  },
};
