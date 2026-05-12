class AuthUser {
  const AuthUser({
    required this.id,
    required this.name,
    required this.email,
    this.image,
    this.phone,
    this.role = 'CUSTOMER',
  });

  final String id;
  final String name;
  final String email;
  final String? image;
  final String? phone;
  final String role;

  factory AuthUser.fromJson(Map<String, dynamic> json) => AuthUser(
        id: json['id'] as String,
        name: json['name'] as String,
        email: json['email'] as String,
        image: json['image'] as String?,
        phone: json['phone'] as String?,
        role: json['role'] as String? ?? 'CUSTOMER',
      );
}

class AuthSession {
  const AuthSession({required this.user, required this.expires});

  final AuthUser user;
  final String expires;

  factory AuthSession.fromJson(Map<String, dynamic> json) => AuthSession(
        user: AuthUser.fromJson(json['user'] as Map<String, dynamic>),
        expires: json['expires'] as String,
      );
}

class LoginInput {
  const LoginInput({required this.email, required this.password});

  final String email;
  final String password;

  Map<String, String> toFormData(String csrfToken) => {
        'csrfToken': csrfToken,
        'email': email,
        'password': password,
        'redirect': 'false',
        'callbackUrl': '/',
        'json': 'true',
      };
}

class RegisterInput {
  const RegisterInput({
    required this.name,
    required this.email,
    required this.password,
    this.phone,
  });

  final String name;
  final String email;
  final String password;
  final String? phone;

  Map<String, dynamic> toJson() => {
        'name': name,
        'email': email,
        'password': password,
        if (phone != null) 'phone': phone,
      };
}
