package com.lms_erp.user.validation;

import com.lms_erp.user.dto.ChangePasswordRequest;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordsMatchValidator
        implements ConstraintValidator<PasswordsMatch, ChangePasswordRequest> {

    @Override
    public boolean isValid(
            ChangePasswordRequest request,
            ConstraintValidatorContext context
    ) {

        if (request == null) {
            return true;
        }

        boolean matches =
                request.getNewPassword() != null
                        && request.getNewPassword().equals(
                                request.getConfirmPassword()
                        );

        if (!matches) {

            context.disableDefaultConstraintViolation();

            context.buildConstraintViolationWithTemplate(
                    context.getDefaultConstraintMessageTemplate()
            )
                    .addPropertyNode("confirmPassword")
                    .addConstraintViolation();
        }

        return matches;
    }
}
