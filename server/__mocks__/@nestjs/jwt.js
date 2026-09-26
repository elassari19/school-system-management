const JwtModule = {
  registerAsync: jest.fn().mockReturnValue({
    module: class {},
    providers: [],
    exports: [],
  }),
};

const JwtService = jest.fn().mockImplementation(() => ({
  sign: jest.fn(),
  verify: jest.fn(),
  decode: jest.fn(),
}));

module.exports = {
  JwtModule,
  JwtService,
};