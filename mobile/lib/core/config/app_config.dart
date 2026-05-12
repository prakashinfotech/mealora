class AppConfig {
  AppConfig._();

  // Override with your deployed URL for production
  static const String baseUrl = String.fromEnvironment(
    'BASE_URL',
    defaultValue: 'http://localhost:3000',
  );

  static const Duration connectTimeout = Duration(seconds: 15);
  static const Duration receiveTimeout = Duration(seconds: 30);

  static const String appName = 'Swiggy Clone';

  // StorageKeys used across the app
  static const String sessionTokenKey = 'next_auth_session_token';
}
