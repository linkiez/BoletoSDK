import { CnabError, GenerationError, ParseError, ValidationError } from '@errors';

describe('CnabError', () => {
  it('should create error with message only', () => {
    const error = new CnabError('Test error');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CnabError);
    expect(error.message).toBe('Test error');
    expect(error.name).toBe('CnabError');
    expect(error.code).toBeUndefined();
    expect(error.context).toBeUndefined();
  });

  it('should create error with code', () => {
    const error = new CnabError('Test error', 'TEST_CODE');

    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_CODE');
  });

  it('should create error with context', () => {
    const context = { field: 'test', value: 123 };
    const error = new CnabError('Test error', 'TEST_CODE', context);

    expect(error.message).toBe('Test error');
    expect(error.code).toBe('TEST_CODE');
    expect(error.context).toEqual(context);
  });

  it('should have proper stack trace', () => {
    const error = new CnabError('Test error');

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('CnabError');
  });
});

describe('ParseError', () => {
  it('should create error with line number', () => {
    const error = new ParseError('Invalid line', 5);

    expect(error).toBeInstanceOf(CnabError);
    expect(error).toBeInstanceOf(ParseError);
    expect(error.message).toBe('Invalid line');
    expect(error.name).toBe('ParseError');
    expect(error.code).toBe('PARSE_ERROR');
    expect(error.line).toBe(5);
  });

  it('should include line in context', () => {
    const error = new ParseError('Invalid line', 10, { expected: 240, actual: 239 });

    expect(error.line).toBe(10);
    expect(error.context).toEqual({
      expected: 240,
      actual: 239,
      line: 10,
    });
  });

  it('should work without line number', () => {
    const error = new ParseError('General parse error');

    expect(error.line).toBeUndefined();
    expect(error.context).toEqual({ line: undefined });
  });
});

describe('ValidationError', () => {
  it('should create error with validation issues', () => {
    const issues = [
      { path: ['taxId'], message: 'Invalid CPF', code: 'invalid_cpf' },
      { path: ['amount'], message: 'Must be positive', code: 'invalid_amount' },
    ];
    const error = new ValidationError('Validation failed', issues);

    expect(error).toBeInstanceOf(CnabError);
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.message).toBe('Validation failed');
    expect(error.name).toBe('ValidationError');
    expect(error.code).toBe('VALIDATION_ERROR');
    expect(error.issues).toEqual(issues);
  });

  it('should work without issues', () => {
    const error = new ValidationError('General validation error');

    expect(error.issues).toBeUndefined();
  });

  it('should include issues in context', () => {
    const issues = [{ path: ['test'], message: 'Error', code: 'test_error' }];
    const error = new ValidationError('Test', issues);

    expect(error.context).toEqual({ issues });
  });
});

describe('GenerationError', () => {
  it('should create error with field name', () => {
    const error = new GenerationError('Missing field', 'dueDate');

    expect(error).toBeInstanceOf(CnabError);
    expect(error).toBeInstanceOf(GenerationError);
    expect(error.message).toBe('Missing field');
    expect(error.name).toBe('GenerationError');
    expect(error.code).toBe('GENERATION_ERROR');
    expect(error.field).toBe('dueDate');
  });

  it('should include field in context', () => {
    const error = new GenerationError('Invalid value', 'amount', { value: -10 });

    expect(error.field).toBe('amount');
    expect(error.context).toEqual({
      value: -10,
      field: 'amount',
    });
  });

  it('should work without field name', () => {
    const error = new GenerationError('General generation error');

    expect(error.field).toBeUndefined();
    expect(error.context).toEqual({ field: undefined });
  });
});
