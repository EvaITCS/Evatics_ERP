package com.lms_erp.common.util;

import java.security.SecureRandom;

public class PasswordGenerator {

    private static final String UPPER =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    private static final String LOWER =
            "abcdefghijklmnopqrstuvwxyz";

    private static final String NUMBERS =
            "0123456789";

    private static final String SPECIAL =
            "@#$%&*!";

    private static final String ALL =
            UPPER + LOWER + NUMBERS + SPECIAL;

    public static String generatePassword(
            int length
    ) {

        SecureRandom random =
                new SecureRandom();

        StringBuilder password =
                new StringBuilder();

        password.append(
                UPPER.charAt(
                        random.nextInt(
                                UPPER.length()
                        )
                )
        );

        password.append(
                LOWER.charAt(
                        random.nextInt(
                                LOWER.length()
                        )
                )
        );

        password.append(
                NUMBERS.charAt(
                        random.nextInt(
                                NUMBERS.length()
                        )
                )
        );

        password.append(
                SPECIAL.charAt(
                        random.nextInt(
                                SPECIAL.length()
                        )
                )
        );

        for (int i = 4; i < length; i++) {

            password.append(
                    ALL.charAt(
                            random.nextInt(
                                    ALL.length()
                            )
                    )
            );
        }

        return password.toString();
    }
}