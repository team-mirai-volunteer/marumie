// Jest test setup
// テスト実行中はconsole.errorを無効化
global.console = {
  ...console,
  error: jest.fn(),
};