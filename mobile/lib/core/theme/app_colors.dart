import 'package:flutter/material.dart';

/// Mealora design system — colour palette
class AppColors {
  AppColors._();

  // ── Brand ──────────────────────────────────────────────────────────
  static const Color brandPrimary      = Color(0xFF5B4BDB); // indigo-violet
  static const Color brandPrimaryLight = Color(0xFFEEE9FF);
  static const Color brandPrimaryDark  = Color(0xFF4A3BC0);

  // ── Text / Neutral ─────────────────────────────────────────────────
  static const Color textPrimary   = Color(0xFF171525);
  static const Color textSecondary = Color(0xFF6B687A);
  static const Color textTertiary  = Color(0xFFA09DB8);

  // ── Semantic ───────────────────────────────────────────────────────
  static const Color success = Color(0xFF16A34A);
  static const Color error   = Color(0xFFDC2626);
  static const Color warning = Color(0xFFF59E0B);

  // ── Food indicators ────────────────────────────────────────────────
  static const Color vegGreen   = Color(0xFF16A34A);
  static const Color nonVegRed  = Color(0xFFDC2626);

  // ── Surface ────────────────────────────────────────────────────────
  static const Color background       = Color(0xFFF8F7FC);
  static const Color surface          = Color(0xFFFFFFFF);
  static const Color divider          = Color(0xFFE5E3F0);
  static const Color shimmerBase      = Color(0xFFEEEBFF);
  static const Color shimmerHighlight = Color(0xFFF5F3FF);
}
