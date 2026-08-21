package com.lms_erp.config.properties;

import com.lms_erp.security.SecurityConstants;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalUnit;
import java.util.ArrayList;
import java.util.List;

@Data
@ConfigurationProperties(prefix = "security")
public class SecurityConfigProperties {
    /**
     * Security Config CORS
     */
    private CorsConfigProperties cors = new CorsConfigProperties();
    /**
     * Security Config Jwt
     */
    private JwtConfigProperties jwt = new JwtConfigProperties();
    /**
     * Security Config Exceptions
     */
    private ExceptionConfigProperties exception = new ExceptionConfigProperties();

    @Data
    public static final class JwtConfigProperties {
        /**
         * Jwt Secret key
         */
        private String secret;
        /**
         * Jwt token expiration duration
         */
        private Duration expiration = Duration.of(
                SecurityConstants.EXPIRATION_TIME,
                ChronoUnit.MILLIS
        );
        /**
         * Jwt Config Issuer
         */
        private String issuer;
    }

    @Data
    public static final class CorsConfigProperties {
        /**
         * Cors Config Allowed Origins
         */
        private List<String> allowedOrigins = new ArrayList<>();
    }
    @Data
    public static class ExceptionConfigProperties {
        /**
         * Include exception message in response
         */
        private boolean includeMessage = true;

        /**
         * Include stack trace in response (only for development)
         */
        private boolean includeStackTrace = false;

        /**
         * Include request path in error response
         */
        private boolean includePath = true;
    }
}
