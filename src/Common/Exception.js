class Exception extends Error {
  constructor({ message, details }) {
    super();

    this.message = message;
    this.details = details || [];
  }
}

module.exports = Exception;
