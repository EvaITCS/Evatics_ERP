package com.lms_erp.common.util;

public class NameFormatterUtil {

    private NameFormatterUtil() {
    }

    public static String toTitleCase(String value) {

        if (value == null || value.isBlank()) {
            return value;
        }

        String[] words = value.trim().toLowerCase().split("\\s+");

        StringBuilder builder = new StringBuilder();

        for (String word : words) {

            builder.append(Character.toUpperCase(word.charAt(0)))
                    .append(word.substring(1))
                    .append(" ");

        }

        return builder.toString().trim();
    }
}