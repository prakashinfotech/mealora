sealed class ApiException implements Exception {
  const ApiException(this.message);
  final String message;

  @override
  String toString() => message;
}

class NetworkException extends ApiException {
  const NetworkException([super.message = 'No internet connection. Please try again.']);
}

class TimeoutException extends ApiException {
  const TimeoutException([super.message = 'Request timed out. Please try again.']);
}

class UnauthorizedException extends ApiException {
  const UnauthorizedException([super.message = 'Please sign in to continue.']);
}

class ForbiddenException extends ApiException {
  const ForbiddenException([super.message = 'You don\'t have permission to do this.']);
}

class NotFoundException extends ApiException {
  const NotFoundException([super.message = 'The requested resource was not found.']);
}

class ValidationException extends ApiException {
  const ValidationException(super.message);
}

class ServerException extends ApiException {
  const ServerException([super.message = 'Something went wrong. Please try again.']);
}

/// Wraps an unknown error with a user-facing message.
class UnknownException extends ApiException {
  const UnknownException([super.message = 'An unexpected error occurred.']);
}
