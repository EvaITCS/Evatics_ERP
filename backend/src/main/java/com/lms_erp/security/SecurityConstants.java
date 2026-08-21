package com.lms_erp.security;

/**
 * ===========================================================
 * SECURITY CONSTANTS
 * ===========================================================
 *
 * Centralized security configuration used throughout
 * the application.
 *
 * Keeping these values in one place makes them easier
 * to maintain and avoids hardcoded strings.
 *
 * ===========================================================
 */
public final class SecurityConstants {

    private SecurityConstants() {
        // Prevent instantiation
    }

    /**
     * JWT Authorization Header
     */
    public static final String AUTH_HEADER = "Authorization";

    /**
     * JWT Prefix
     */
    public static final String TOKEN_PREFIX = "Bearer ";

    /**
     * JWT Issuer
     */
    public static final String ISSUER = "EVA ERP";

    /**
     * JWT Expiration Time
     *
     * 24 Hours
     */
    public static final long EXPIRATION_TIME =
            1000L * 60 * 60 * 24;

    /**
     * Secret Key
     *
     * IMPORTANT:
     * For development only.
     *
     * In production this must be stored in:
     *
     * - application.properties
     * - Environment Variables
     * - Vault
     *
     */

}
