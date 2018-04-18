class Exception extends Error {
  constructor(exception) {
    super();

    this.message = exception.message;
    this.details = exception.details || [];
  }
}

module.exports = Exception;
