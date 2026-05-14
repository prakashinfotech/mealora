import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../../../core/api/api_client.dart';
import '../../../../core/api/api_endpoints.dart';
import '../../../../core/api/api_exception.dart';
import '../../../../core/config/app_config.dart';
import '../models/auth_models.dart';

class AuthRepository {
  AuthRepository(this._client, this._storage);

  final ApiClient _client;
  final FlutterSecureStorage _storage;

  // ─── Session ──────────────────────────────────────────────────────────────

  Future<AuthUser?> getSession() async {
    final token = await _storage.read(key: AppConfig.sessionTokenKey);
    if (token == null) return null;

    try {
      final response = await _client.rawGet(ApiEndpoints.session);
      final data = response.data;
      if (data is! Map<String, dynamic> || !data.containsKey('user')) {
        return null;
      }
      return AuthUser.fromJson(data['user'] as Map<String, dynamic>);
    } on UnauthorizedException {
      await _clearToken();
      return null;
    } catch (_) {
      return null;
    }
  }

  // ─── Login ────────────────────────────────────────────────────────────────

  Future<AuthUser> login(LoginInput input) async {
    final data = await _client.post<Map<String, dynamic>>(
      ApiEndpoints.mobileLogin,
      data: {
        'email': input.email.trim().toLowerCase(),
        'password': input.password,
      },
      fromJson: (d) => d as Map<String, dynamic>,
    );

    final sessionToken = data['sessionToken'] as String;
    await _storage.write(key: AppConfig.sessionTokenKey, value: sessionToken);

    return AuthUser.fromJson(data['user'] as Map<String, dynamic>);
  }

  // ─── Register ─────────────────────────────────────────────────────────────

  Future<void> register(RegisterInput input) async {
    await _client.post<Map<String, dynamic>>(
      ApiEndpoints.register,
      data: input.toJson(),
    );
  }

  // ─── Logout ───────────────────────────────────────────────────────────────

  Future<void> logout() async {
    await _clearToken();
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  Future<void> _clearToken() =>
      _storage.delete(key: AppConfig.sessionTokenKey);
}
