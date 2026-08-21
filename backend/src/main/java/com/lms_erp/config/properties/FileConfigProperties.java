package com.lms_erp.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "file")
public class FileConfigProperties {

    /**
     * File Config Upload Directory
     */
    private String uploadDir;
}
