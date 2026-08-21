package com.lms_erp.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "admin")
public class AdminConfigProperties {
    /**
     * Temporary admin User
     */
    private TemporaryUser temp;

    @Data
    public static class TemporaryUser {
        /**
         * Username
         */
        private String username;
        /**
         * Password
         */
        private String password;
    }
}
