package com.lms_erp.location.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms_erp.location.dto.MasterLocationResponse;
import com.lms_erp.location.service.MasterLocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MasterLocationServiceImpl implements MasterLocationService {

    @Value("${geoapify.api.key}")
    private String apiKey;

    @Value("${geoapify.base-url}")
    private String baseUrl;

    private final ObjectMapper objectMapper;

    @Override
    public List<MasterLocationResponse> searchLocations(String text,
                                                        String countryCode) {

        if (text == null || text.trim().isEmpty()) {
            return Collections.emptyList();
        }

        try {

            RestClient restClient = RestClient.builder()
                    .baseUrl(baseUrl)
                    .build();

            String response = restClient.get()
                    .uri(uriBuilder ->{
                            uriBuilder
                                    .path("/v1/geocode/search")
                                    .queryParam("text", text.trim())
                                    .queryParam("limit", 10)
                                    .queryParam("apiKey", apiKey);

            if (countryCode != null
                    && !countryCode.trim().isEmpty()) {

                uriBuilder.queryParam(
                        "filter",
                        "countrycode:" + countryCode.toLowerCase()
                );
            }

            return uriBuilder.build();
        })
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(response);

            JsonNode features = root.path("features");

            if (!features.isArray()) {
                return Collections.emptyList();
            }

            List<MasterLocationResponse> locations =
                    new ArrayList<>();

            for (JsonNode feature : features) {

                JsonNode properties =
                        feature.path("properties");

                JsonNode geometry =
                        feature.path("geometry");

                JsonNode coordinates =
                        geometry.path("coordinates");

                Double longitude = null;
                Double latitude = null;

                if (coordinates.isArray()
                        && coordinates.size() >= 2) {

                    longitude =
                            coordinates.get(0).asDouble();

                    latitude =
                            coordinates.get(1).asDouble();
                }

                /*
                 * Geoapify can provide:
                 *
                 * formatted
                 * address_line1
                 * country
                 * state
                 * city
                 * postcode
                 */

                String addressLine1 =
                        properties.path("address_line1")
                                .asText(null);

                String formatted =
                        properties.path("formatted")
                                .asText(null);

                /*
                 * Some results may not have address_line1.
                 * In that case use formatted address.
                 */

                if (addressLine1 == null
                        || addressLine1.isBlank()) {

                    addressLine1 = formatted;
                }

                MasterLocationResponse location =
                        MasterLocationResponse.builder()

                                .country(
                                        properties
                                                .path("country")
                                                .asText(null)
                                )

                                .countryCode(
                                        properties
                                                .path("country_code")
                                                .asText(null)
                                )

                                .state(
                                        properties
                                                .path("state")
                                                .asText(null)
                                )

                                .stateCode(
                                        properties
                                                .path("state_code")
                                                .asText(null)
                                )

                                .city(
                                        properties
                                                .path("city")
                                                .asText(null)
                                )

                                .zipcode(
                                        properties
                                                .path("postcode")
                                                .asText(null)
                                )

                                .formatted(formatted)

                                .addressLine1(addressLine1)

                                .latitude(latitude)

                                .longitude(longitude)

                                .build();

                locations.add(location);
            }

            return locations;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to search location from Geoapify",
                    e
            );
        }
    }
}