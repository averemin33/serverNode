class APIError extends Error {
  constructor(public state: number, public mess: string) {
    super();
    this.message = mess;
    this.state = state;
  }

  static badRequest(mess: string) {
    return new APIError(404, mess);
  }
}

export default APIError;
